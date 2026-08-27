import { parseBlob } from "music-metadata";
import { unzip } from "unzipit";

interface CompressOptions {
  maxDim?: number;
  quality?: number;
}

export async function extractPdfCover(file: File): Promise<Blob | null> {
  try {
    const pdfjs = await import("pdfjs-dist");

    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();

    const arrayBuffer = await file.arrayBuffer();
    const loadTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadTask.promise;

    if (!pdf) throw new Error("Could not load pdf");

    const page = await pdf.getPage(1);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No canvas context");

    const viewport = page.getViewport({ scale: 1.3 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    }).promise;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.6),
    );

    return blob;
  } catch (error) {
    console.error(`Could not extract pdf ${file.name} cover: ${error}`);
    return null;
  }
}

export async function extractEpubCover(file: File): Promise<Blob | null> {
  try {
    const { entries } = await unzip(file);

    const coverEntry = Object.values(entries).find((entry) => {
      const name = entry.name.toLowerCase();

      return (
        name.includes("cover") &&
        (name.endsWith(".jpg") ||
          name.endsWith(".jpeg") ||
          name.endsWith(".png"))
      );
    });

    if (!coverEntry) return null;

    const cover = await coverEntry.blob();

    return cover;
  } catch (error) {
    console.error(`Could not extract epub ${file.name} cover: ${error}`);
    return null;
  }
}

export async function extractCbzCover(file: File): Promise<Blob | null> {
  try {
    const { entries } = await unzip(file);

    const coverEntry = Object.values(entries).find((entry) => {
      const name = entry.name.toLowerCase();

      return (
        name.includes("001") &&
        (name.endsWith(".jpg") ||
          name.endsWith(".jpeg") ||
          name.endsWith(".png"))
      );
    });

    if (!coverEntry) return null;

    const cover = await coverEntry.blob();

    return cover;
  } catch (error) {
    console.error(`Could not extract epub ${file.name} cover: ${error}`);
    return null;
  }
}

export async function extractImageCover(
  file: File | ImageBitmap | Blob,
  { maxDim = 600, quality = 0.7 }: CompressOptions = {},
): Promise<Blob | null> {
  try {
    const bitmap =
      file instanceof ImageBitmap ? file : await createImageBitmap(file);

    const minDimension = Math.min(bitmap.width, bitmap.height);
    const startX = (bitmap.width - minDimension) / 2;
    const startY = (bitmap.height - minDimension) / 2;

    const size = Math.min(maxDim, minDimension);

    const canvas = new OffscreenCanvas(size, size);

    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("offscreen canvas context failed");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      bitmap,
      startX,
      startY,
      minDimension,
      minDimension,
      0,
      0,
      size,
      size,
    );
    bitmap.close();

    return await canvas.convertToBlob({ type: "image/webp", quality: quality });
  } catch (error) {
    console.error(`Couldn't extract cover: ${error}`);
    return null;
  }
}

export async function extractVideoCover(
  file: File,
  seekTime: number = 1,
  { maxDim = 1200, quality = 0.7 }: CompressOptions = {},
): Promise<Blob | null> {
  try {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.muted = true;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => {
        video.currentTime =
          video.duration <= seekTime ? video.duration / 4 : seekTime;
      };
      video.onseeked = () => resolve();
      video.onerror = () =>
        reject(new Error("video format probably not supported"));
    });

    const bitmap = await createImageBitmap(video);
    URL.revokeObjectURL(video.src);
    return await extractImageCover(bitmap, { maxDim, quality });
  } catch (error) {
    console.error(`Couldn't extract ${file.name}'s cover: ${error}`);
    return null;
  }
}

export async function extractAudioCover(
  file: File | Blob,
  { maxDim = 1000, quality = 0.7 }: CompressOptions = {},
): Promise<Blob | null> {
  try {
    const metadata = await parseBlob(file);
    const picture = metadata.common.picture?.[0];

    if (!picture) {
      return null;
    }
    const rawCoverBlob = new Blob([picture.data as BlobPart], {
      type: picture.format,
    });
    return await extractImageCover(rawCoverBlob, { maxDim, quality });
  } catch (err) {
    console.warn("Failed to parse audio metadata:", err);
    return null;
  }
}
