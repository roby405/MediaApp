import { MediaFile } from "../types/db";
import { MediaType } from "../types/global";

type SaveSource =
  { kind: "file"; value: File } | { kind: "uri"; value: string };

export interface DBController {
  getFile: (id: string) => Promise<MediaFile | null>;
  getFileContent: (id: string) => Promise<ArrayBuffer | null>;
  deleteFile: (id: string) => Promise<void>;
  renameFile: (id: string, newName: string) => Promise<void>;
  updateFile: (file: MediaFile) => Promise<void>;
  saveFile: (file: MediaFile, source: SaveSource) => Promise<void>;
  getFilesByCategory: <T extends MediaType>(
    category: T,
  ) => Promise<Extract<MediaFile, { category: T }>[]>;
}
