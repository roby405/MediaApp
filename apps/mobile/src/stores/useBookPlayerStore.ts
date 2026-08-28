import { unzip, ZipEntry } from "unzipit";
import { create } from "zustand";
import type { BookMediaFile } from "../db/schema";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { getFileContent } from "../db/operations";

export type BookType = "epub" | "cbz" | "pdf" | "md" | "text";

interface BookPlayerState {
  currentPage: number;
  totalPages: number;
  epubData: EpubData | null;
  pdfDoc: PDFDocumentProxy | null;
  cbzData: CbzData | null;
  setPage: (page: number) => void;
  increasePage: () => void;
  decreasePage: () => void;
  setTotalPages: (page: number) => void;
  initializeBook: (book: BookMediaFile) => void;
  getEpubChapterHtml: () => Promise<string>;
  renderPdfToCanvas: (canvas: HTMLCanvasElement) => Promise<void>;
}

interface EpubChapters {
  fileMap: Record<string, string>;
  mimeTypeMap: Record<string, string>;
  chapterList: string[];
  entries: Record<string, ZipEntry>;
}

interface EpubData extends EpubChapters {
  urlMap: Record<string, string>;
}

interface CbzData {
  images: string[];
}

export async function getCbzImages(file: File): Promise<CbzData | null> {
  try {
    const { entries } = await unzip(file);

    const imageFormats = new Set([
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      "avif",
      "bmp",
    ]);
    const images = Object.keys(entries).filter((val) => {
      const ext = val.split(".").pop()?.toLowerCase();
      return ext && imageFormats.has(ext);
    });

    const MIME_TYPES: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      avif: "image/avif",
      bmp: "image/bmp",
    };

    images.sort();

    const imageUrls = await Promise.all(
      images.map(async (path) => {
        const entry = entries[path];
        if (entry) {
          const ext = path.split(".").pop()!.toLowerCase();
          const blob = await entry.blob(MIME_TYPES[ext]);
          const blobUrl = URL.createObjectURL(blob);
          return blobUrl;
        }
        return null;
      }),
    );

    const cbzData: CbzData = {
      images: imageUrls.filter((val): val is string => val !== null),
    };

    return cbzData;
  } catch (err) {
    console.error(`Could not extract cbz images ${file.name}: ${err}`);
    return null;
  }
}

export async function getEpubChapters(
  file: File,
): Promise<EpubChapters | null> {
  try {
    const { entries } = await unzip(file);

    const containerEntry = entries["META-INF/container.xml"];
    const containerXml = await containerEntry.text();
    const domParser = new DOMParser();
    const container = domParser.parseFromString(
      containerXml,
      "application/xml",
    );
    const rootfilePath = container
      .querySelector("rootfile")
      ?.getAttribute("full-path");

    if (!rootfilePath) throw new Error("no opf file found");
    const opfEntry = entries[rootfilePath];

    const opfXml = await opfEntry.text();
    const opf = domParser.parseFromString(opfXml, "application/xml");
    const manifest = opf.querySelector("manifest");
    const spine = opf.querySelector("spine");

    const manifestItems = manifest?.querySelectorAll("item");
    if (!manifestItems) throw new Error("No items in manifest file");
    const itemMap: Record<string, string> = {};
    const mimeTypeMap: Record<string, string> = {};
    manifestItems.forEach((item) => {
      const id = item.getAttribute("id");
      const href = item.getAttribute("href");
      const mimeType = item.getAttribute("media-type");
      const newPathSegments = rootfilePath.split("/").slice(0, -1);
      if (href) newPathSegments.push(href);
      if (id && href) itemMap[id] = newPathSegments.join("/");
      if (id && mimeType) mimeTypeMap[id] = mimeType;
    });

    const spineItems = spine?.querySelectorAll("itemref");
    if (!spineItems) throw new Error("nothing found in spine");
    const chapterPaths: string[] = [];
    spineItems.forEach((item) => {
      const idref = item.getAttribute("idref");
      if (idref) chapterPaths.push(itemMap[idref]);
    });
    const res: EpubChapters = {
      fileMap: itemMap,
      mimeTypeMap: mimeTypeMap,
      chapterList: chapterPaths,
      entries: entries,
    };
    return res;
  } catch (error) {
    console.error(`Could not extract epub chapters ${file.name}: ${error}`);
    return null;
  }
}

export async function createEpubUrls({
  fileMap,
  mimeTypeMap,
  entries,
}: EpubChapters): Promise<Record<string, string> | null> {
  try {
    const urlMap: Record<string, string> = {};
    await Promise.all(
      Object.entries(fileMap).map(async ([id, path]) => {
        const entry = entries[path];
        if (entry) {
          const blob = await entry.blob(mimeTypeMap[id]);
          const blobUrl = URL.createObjectURL(blob);
          urlMap[path] = blobUrl;
        }
      }),
    );

    return urlMap;
  } catch (err) {
    console.error(`Could not create epub urls: ${err}`);
    return null;
  }
}

function parseXhtmlDocument(rawHtml: string): Document {
  const parser = new DOMParser();
  // Parse strictly as XML/XHTML first
  const xmlDoc = parser.parseFromString(rawHtml, "application/xhtml+xml");

  const parserError = xmlDoc.querySelector("parsererror");
  if (!parserError) {
    return xmlDoc;
  }

  // Fallback to text/html only if XML syntax fails
  return parser.parseFromString(rawHtml, "text/html");
}

export function sanitizeHtml(
  rawHtml: string,
  urlMap: Record<string, string>,
  chapterPath: string,
): string {
  function findGlobalPath(origin: string, path: string): string {
    if (path.startsWith("/")) return decodeURIComponent(path.slice(1));
    if (path.startsWith("http://") || path.startsWith("https://"))
      return decodeURIComponent(path);
    const segments = origin.split("/").slice(0, -1);
    const parts = path.split("/");
    parts.forEach((part) => {
      if (!part || part === ".") return;
      if (part === "..") {
        segments.pop();
      } else {
        segments.push(part);
      }
    });

    return decodeURIComponent(segments.join("/"));
  }

  const doc = parseXhtmlDocument(rawHtml);

  doc.querySelectorAll("script").forEach((elem) => elem.remove());
  doc.querySelectorAll("*").forEach((elem) => {
    Array.from(elem.attributes).forEach((attr) => {
      if (attr.name.toLowerCase().startsWith("on"))
        elem.removeAttribute(attr.name);
      if (
        attr.name.toLowerCase() === "href" &&
        attr.value.toLowerCase().startsWith("javascript:")
      ) {
        elem.removeAttribute(attr.name);
      }
    });
  });

  doc.querySelectorAll('link[rel="stylesheet"]').forEach((elem) => {
    const originalUrl = elem.getAttribute("href");
    if (!originalUrl) return;
    const newUrl = urlMap[findGlobalPath(chapterPath, originalUrl)];
    elem.setAttribute("href", newUrl);
  });

  doc.querySelectorAll("img").forEach((elem) => {
    const originalUrl = elem.getAttribute("src");
    if (!originalUrl) return;
    const newUrl = urlMap[findGlobalPath(chapterPath, originalUrl)];
    elem.setAttribute("src", newUrl);
  });

  doc.querySelectorAll("image").forEach((elem) => {
    const originalUrl =
      elem.getAttribute("href") || elem.getAttribute("xlink:href");
    if (!originalUrl) return;
    const newUrl = urlMap[findGlobalPath(chapterPath, originalUrl)];
    elem.setAttribute("href", newUrl);
    elem.setAttribute("xlink:href", newUrl);
  });

  return new XMLSerializer().serializeToString(doc);
}

export const useBookPlayerStore = create<BookPlayerState>((set, get) => ({
  currentPage: 0,
  totalPages: 1,
  epubData: null,
  pdfDoc: null,
  cbzData: null,
  setPage: (page) => {
    if (page < 0 || page >= useBookPlayerStore.getState().totalPages) return;
    set({ currentPage: page });
  },
  increasePage: () => {
    if (
      useBookPlayerStore.getState().currentPage >=
      useBookPlayerStore.getState().totalPages
    )
      return;
    set({ currentPage: useBookPlayerStore.getState().currentPage + 1 });
  },
  decreasePage: () => {
    if (useBookPlayerStore.getState().currentPage <= 0) return;
    set({ currentPage: useBookPlayerStore.getState().currentPage - 1 });
  },
  setTotalPages: (pageCount) => {
    if (pageCount < 1) return;
    set({ totalPages: pageCount });
  },
  initializeBook: async (book) => {
    const file = await getFileContent(book.id);
    if (!file) return;
    switch (book.extension) {
      case "epub": {
        const epubData = await getEpubChapters(file);
        if (!epubData) break;
        const urlMap = await createEpubUrls(epubData);
        if (!urlMap) break;
        set({
          epubData: {
            ...epubData,
            urlMap,
          },
          cbzData: null,
          pdfDoc: null,
          totalPages: epubData.chapterList.length,
          currentPage: 0,
        });

        break;
      }

      case "pdf": {
        const pdfjs = await import("pdfjs-dist");

        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        const arrayBuffer = await file.arrayBuffer();
        const loadTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadTask.promise;

        set({
          pdfDoc: pdf,
          epubData: null,
          cbzData: null,
          totalPages: pdf.numPages,
          currentPage: 0,
        });
        break;
      }

      case "cbz": {
        const cbzData = await getCbzImages(file);

        set({
          epubData: null,
          pdfDoc: null,
          cbzData: cbzData,
          totalPages: cbzData?.images.length,
          currentPage: 0,
        });

        break;
      }

      default:
        break;
    }
  },
  getEpubChapterHtml: async () => {
    const { epubData, currentPage } = get();
    if (!epubData) return "";
    const chapterPath = epubData.chapterList[currentPage];
    const entry = epubData.entries[chapterPath];
    const rawHtml = await entry.text();
    const sanitized = sanitizeHtml(rawHtml, epubData.urlMap, chapterPath);

    return sanitized;
  },
  renderPdfToCanvas: async (canvas) => {
    const { pdfDoc, currentPage } = get();
    if (!pdfDoc) return;

    const page = await pdfDoc.getPage(currentPage + 1);

    const context = canvas.getContext("2d");
    if (!context) return;

    const viewport = page.getViewport({ scale: 1.3 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    }).promise;
  },
}));
