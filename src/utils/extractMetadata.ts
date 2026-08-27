import { parseBlob } from "music-metadata";
import type {
  AudioMetadata,
  BookMetadata,
  ImageMetadata,
  VideoMetadata,
} from "../types/db";
import { unzip } from "unzipit";
import { getEpubChapters } from "../stores/useBookPlayerStore";

export async function extractEpubMetadata(file: File): Promise<BookMetadata> {
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
    const opf = domParser.parseFromString(opfXml, "text/html");
    const metadata = opf.querySelector("metadata");

    if (!metadata) throw new Error("no metadata");
    const title = metadata?.querySelector("dc\\:title")?.textContent?.trim() ?? file.name;
    const author = metadata?.querySelector("dc\\:creator")?.textContent?.trim() ?? "";
    const publisher = metadata?.querySelector("dc\\:publisher")?.textContent?.trim() ?? "";
    const language = metadata?.querySelector("dc\\:language")?.textContent?.trim() ?? "";

    const chapters = await getEpubChapters(file); // will need for word and character count later on
    if (!chapters)
      throw new Error("couldn't extract chapters from epub");
    const pageCount = chapters.chapterList.length;

    const res: BookMetadata = {
      title,
      author,
      publisher,
      language,
      pageCount,
      lastPageRead: 0,
    }
    return res;
  } catch (error) {
    console.error(`Could not extract epub chapters ${file.name}: ${error}`);
    return {};
  }
}

interface PdfInfo {
  Title?: unknown;
  Author?: unknown;
  Producer?: unknown;
  Creator?: unknown;
}

export async function extractPdfMetadata(file: File): Promise<BookMetadata> {
  const pdfjs = await import("pdfjs-dist");

        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();

        const arrayBuffer = await file.arrayBuffer();
        const loadTask = pdfjs.getDocument({data: arrayBuffer});
        const pdf = await loadTask.promise;

        let info: PdfInfo = {}
        try {
          info = (await pdf.getMetadata()).info;
          
        } catch (err) {
          console.error(`couldn't get metadata: ${err}`);
        }

        return {
          title: info.Title as string || file.name,
          author: info.Author as string || undefined,
          publisher: (info.Producer || info.Creator) as string || undefined,
          pageCount: pdf.numPages,
          lastPageRead: 0,
        };
}

export async function extractCbzMetadata(file: File): Promise<BookMetadata> {
  try {
        const { entries } = await unzip(file);

    const imageFormats = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "bmp"]);
    const images = Object.keys(entries).filter((val) => {
      const ext = val.split(".").pop()?.toLowerCase();
      return ext && imageFormats.has(ext);
    });

    const containerEntry = entries["ComicInfo.xml"];
    const containerXml = await containerEntry.text();
    const domParser = new DOMParser();
    const container = domParser.parseFromString(
      containerXml,
      "application/xml",
    );

    const title = `${container.querySelector("Series")?.textContent} - ${container.querySelector("Number")?.textContent}`
    const author = container.querySelector("Writer")?.textContent;


        return {
          title,
          author,
          pageCount: images.length,
          lastPageRead: 0,
        };
  } catch (err) {
    console.error(`Couldn't extract metadata: ${err}`);
    return {}
  }
}

export async function extractVideoMetadata(
  file: File,
): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.src = url;
    video.preload = 'metadata';

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.removeAttribute('src');
      video.load();
    };

    video.onloadedmetadata = () => {
      const result: VideoMetadata = {
        duration: video.duration || 0,
        width: video.videoWidth || undefined,
        height: video.videoHeight || undefined,
      };
      cleanup();
      resolve(result);
    };

    video.onerror = () => {
      cleanup();
      resolve({ duration: 0 });
    };
  });
}

export async function extractImageMetadata(
  file: File,
): Promise<ImageMetadata> {
  try {
    const bitmap = await createImageBitmap(file);
    const result: ImageMetadata = {
      width: bitmap.width,
      height: bitmap.height,
    };
    bitmap.close();
    return result;
  } catch {
    return {};
  }
}

export async function extractAudioMetadata(file: File): Promise<AudioMetadata> {
  try {
    const metadata = await parseBlob(file, { duration: true });
    const { common, format } = metadata;

    return {
      duration: format.duration || 0,
      title: common.title || file.name.replace(/\.[^/.]+$/, ""),
      artist: common.artist,
      album: common.album,
      albumArtist: common.albumartist,
      trackNumber: common.track?.no ?? undefined,
      diskNumber: common.disk?.no ?? undefined,
      year: common.year,
      genre: common.genre,
      isLossless: format.lossless ?? false,
      bitrate: format.bitrate,
      sampleRate: format.sampleRate,
    };
  } catch (err) {
    console.warn(`Failed to read audio tags for ${file.name}:`, err);
    return {
      duration: 0,
      title: file.name,
    };
  }
}
