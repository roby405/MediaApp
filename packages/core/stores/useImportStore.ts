import { create } from "zustand";
import type { MediaType, PlatformFile } from "../types/global";
import { MediaFile } from "../types/db";
import { Registry } from "../interfaces/Registry";
import { Extractor } from "../interfaces/ExtractorRegistry";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex } from "@noble/hashes/utils";

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
    files: PlatformFile[],
    importType: "files" | "folder",
  ) => Promise<void>;
}

const EXTENSIONS = {
  image: new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "bmp"]),
  video: new Set(["mp4", "mkv", "webm", "mov", "avi", "wmv", "m4v"]),
  audio: new Set(["mp3", "wav", "ogg", "flac", "aac", "m4a", "opus", "wma"]),
  book: new Set(["pdf", "epub", "mobi", "azw3", "cbz", "cbr", "djvu", "txt"]),
} as const;

export function determineFileType(file: PlatformFile): MediaType {
  const mime = file.mimeType?.toLowerCase() ?? "";
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

async function createFastHash(file: PlatformFile): Promise<string> {
  let toHash: Uint8Array;

  if (file.size < CHUNK_SIZE * 2) {
    toHash = await file.readBytes();
  } else {
    const head = await file.readSlice(0, CHUNK_SIZE);
    const tail = await file.readSlice(file.size - CHUNK_SIZE, file.size);

    const combined = new Uint8Array(CHUNK_SIZE * 2);
    combined.set(new Uint8Array(head), 0);
    combined.set(new Uint8Array(tail), CHUNK_SIZE);

    toHash = combined;
  }

  return bytesToHex(sha256(toHash));
}

async function createMediaFileObject(file: PlatformFile): Promise<MediaFile> {
  const base = {
    id: await createFastHash(file),
    name: file.name,
    extension: file.name.split(".").pop()?.toLowerCase() || "",
    path: file.path,
    category: determineFileType(file),
    size: file.size,
    created_at: Date.now(),
    last_opened_at: 0,
    is_favourite: 0,
  };

  const extracted = await Extractor.extract(file);

  // TODO compress cover and save it
  const meta = {
    ...extracted,
    cover: ""
  }

  return {
    ...base,
    ...meta
  }
}

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

      await Registry.db.saveFile(mediaFile, file);
    }
    set({ isImporting: false, importProgress: null });
  },
}));
