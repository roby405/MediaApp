import { create } from "zustand";
import type { AudioMediaFile, BookMediaFile, ImageMediaFile, MediaFile, VideoMediaFile } from "../db/schema";
import { saveFile } from "../db/operations";
import {
  extractAudioCover,
  extractCbzCover,
  extractEpubCover,
  extractImageCover,
  extractPdfCover,
  extractVideoCover,
} from "../utils/extractCovers";
import type { MediaType } from "../types/global";
import { extractAudioMetadata, extractCbzMetadata, extractEpubMetadata, extractImageMetadata, extractPdfMetadata, extractVideoMetadata } from "../utils/extractMetadata";

interface ImportProgress {
  current: number;
  total: number;
  currentFileName: string;
  currentFileSize: number;
}

interface ImportState {
  isImporting: boolean;
  importProgress: ImportProgress | null;
  startImporting: (
    files: File[],
    importType: "files" | "folder",
  ) => Promise<void>;
}

const EXTENSIONS = {
  image: new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "bmp"]),
  video: new Set(["mp4", "mkv", "webm", "mov", "avi", "wmv", "m4v"]),
  audio: new Set(["mp3", "wav", "ogg", "flac", "aac", "m4a", "opus", "wma"]),
  book: new Set(["pdf", "epub", "mobi", "azw3", "cbz", "cbr", "djvu", "txt"]),
} as const;

export function determineFileType(file: File): MediaType {
  const mime = file.type.toLowerCase();
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf" || mime === "application/epub+zip")
    return "book";

  if (EXTENSIONS.image.has(extension)) return "image";
  if (EXTENSIONS.video.has(extension)) return "video";
  if (EXTENSIONS.audio.has(extension)) return "audio";
  if (EXTENSIONS.book.has(extension)) return "book";

  return "book";
}

const CHUNK_SIZE = 64 * 1024;

async function createFastHash(file: File): Promise<string> {
  let toHash: ArrayBuffer;

  if (file.size < CHUNK_SIZE * 2) {
    toHash = await file.arrayBuffer();
  } else {
    const head = file.slice(0, CHUNK_SIZE);
    const tail = file.slice(file.size - CHUNK_SIZE, file.size);

    const headBuffer = await head.arrayBuffer();
    const tailBuffer = await tail.arrayBuffer();

    const combined = new Uint8Array(CHUNK_SIZE * 2);
    combined.set(new Uint8Array(headBuffer), 0);
    combined.set(new Uint8Array(tailBuffer), CHUNK_SIZE);

    toHash = combined.buffer;
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", toHash);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexaHash = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hexaHash;
}

async function createMediaFileObject(file: File): Promise<MediaFile> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  const base = {
    id: await createFastHash(file),
    name: file.name,
    extension: file.name.split(".").pop()?.toLowerCase() || "",
    path: file.webkitRelativePath,
    category: determineFileType(file),
    size: file.size,
    created_at: Date.now(),
    last_opened_at: 0,
    is_favourite: 0,
  };

  switch (extension)    {
  case "epub": {
      const res: BookMediaFile = {
        ...base,
        category: "book",
        cover: await extractEpubCover(file),
        metadata: await extractEpubMetadata(file),
      }
      return res;
    }

    case "pdf": {
      const res: BookMediaFile = {
        ...base,
        category: "book",
        cover: await extractPdfCover(file),
        metadata: await extractPdfMetadata(file),
      }
      return res;
    }

    case "cbz": {
      const res: BookMediaFile = {
        ...base,
        category: "book",
        cover: await extractCbzCover(file),
        metadata: await extractCbzMetadata(file),
      }
      return res;
    }

    case "jpg":
    case "jpeg":
    case "png":
    case "webp":
    case "gif":
    case "avif":
    case "bmp":
    case "svg": {
      const res: ImageMediaFile = {
        ...base,
        category: "image",
        cover: await extractImageCover(file),
        metadata: await extractImageMetadata(file),
      }
      return res;
    }

    case "mp4":
    case "webm":
    case "mov":
    case "mkv":
    case "m4v":
    case "wmv":
    case "avi": {
      const res: VideoMediaFile = {
        ...base,
        category: "video",
        cover: await extractVideoCover(file),
        metadata: await extractVideoMetadata(file),
      }
      return res;
    }

    case "mp3":
    case "wav":
    case "ogg":
    case "flac":
    case "aac":
    case "m4a":
    case "opus":
    case "wma": {
      const res: AudioMediaFile = {
        ...base,
        category: "audio",
        cover: await extractAudioCover(file),
        metadata: await extractAudioMetadata(file),
      }
      return res;
    }

    default:
      return {
        ...base,
        category: "book",
        metadata: {},
        cover: null,
      }
  }
}

// async function getCover(file: File): Promise<Blob | null> {
//   const extension = file.name.split(".").pop()?.toLowerCase() || "";
//   let cover = null;
//   switch (extension) {
//     case "epub": {
//       cover = await extractEpubCover(file);
//       break;
//     }

//     case "pdf": {
//       cover = await extractPdfCover(file);
//       break;
//     }

//     case "cbz": {
//       cover = await extractCbzCover(file);
//       break;
//     }

//     case "jpg":
//     case "jpeg":
//     case "png":
//     case "webp":
//     case "gif":
//     case "avif":
//     case "bmp":
//     case "svg": {
//       cover = await extractImageCover(file);
//       break;
//     }

//     case "mp4":
//     case "webm":
//     case "mov":
//     case "mkv":
//     case "m4v":
//     case "wmv":
//     case "avi": {
//       cover = await extractVideoCover(file);
//       break;
//     }

//     case "mp3":
//     case "wav":
//     case "ogg":
//     case "flac":
//     case "aac":
//     case "m4a":
//     case "opus":
//     case "wma": {
//       cover = await extractAudioCover(file);
//       break;
//     }

//     default:
//       break;
//   }
//   return cover;
// }

// function getMetadata(file: File): Metadata {
//   const extension = file.name.split(".").pop()?.toLowerCase() || "";
//   switch (extension) {
//     case "epub": {
//       break;
//     }

//     case "pdf": {
//       break;
//     }

//     case "cbz": {
//       break;
//     }

//     case "jpg":
//     case "jpeg":
//     case "png":
//     case "webp":
//     case "gif":
//     case "avif":
//     case "bmp":
//     case "svg": {
//       break;
//     }

//     case "mp4":
//     case "webm":
//     case "mov":
//     case "mkv":
//     case "m4v":
//     case "wmv":
//     case "avi": {
//       break;
//     }

//     case "mp3":
//     case "wav":
//     case "ogg":
//     case "flac":
//     case "aac":
//     case "m4a":
//     case "opus":
//     case "wma": {
//       break;
//     }

//     default:
//       break;
//   }
// }

export const useImportStore = create<ImportState>((set) => ({
  isImporting: false,
  importProgress: null,
  startImporting: async (files) => {
    set({
      isImporting: true,
      importProgress: {
        current: 0,
        total: files.length,
        currentFileName: "",
        currentFileSize: 0,
      },
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      set({
        importProgress: {
          current: i + 1,
          total: files.length,
          currentFileName: file.name,
          currentFileSize: file.size,
        },
      });
      const mediaFile = await createMediaFileObject(file);

      await saveFile(mediaFile, file);
    }
    set({ isImporting: false, importProgress: null });
  },
}));
