import { create } from "zustand";
import type { MediaType, PlatformFile } from "../types/global";
import { MediaFile } from "../types/db";
import { Registry } from "../interfaces/Registry";
import { Extractor } from "../interfaces/ExtractorRegistry";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { Cover } from "../interfaces/CoverRegistry";
import { createFastHash } from "../utils/createFastHash";
import { determineFileType } from "../utils/determineFileType";

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
  const cover = extracted.cover ? (await Cover.compress(extracted.cover, determineFileType(file))) : "";

  const meta = {
    ...extracted,
    cover
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
      file.close?.();
    }
    set({ isImporting: false, importProgress: null });
  },
}));
