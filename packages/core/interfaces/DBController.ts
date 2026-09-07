import { MediaFile } from "../types/db";
import { MediaType, PlatformFile } from "../types/global";

export interface DBController {
  getFile: (id: string) => Promise<MediaFile | null>;
  getFileContent: (id: string) => Promise<Uint8Array | null>;
  deleteFile: (id: string) => Promise<void>;
  renameFile: (id: string, newName: string) => Promise<void>;
  updateFile: (file: MediaFile) => Promise<void>;
  saveFile: (file: MediaFile, source: PlatformFile) => Promise<void>;
  getFilesByCategory: <T extends MediaType>(
    category: T,
  ) => Promise<Extract<MediaFile, { category: T }>[]>;
}
