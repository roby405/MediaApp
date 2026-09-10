export type MediaType = "book" | "audio" | "video" | "image";
export interface ActiveMedia {
  id: string;
  category: MediaType;
}
export type Screen = "audio" | "book" | "image" | "video" | "import";
export const MB = 1024 * 1024;

export interface PlatformFile {
  name: string;
  size: number;
  mimeType: string | null;
  path: string;
  readBytes(): Promise<Uint8Array>;
  readSlice(start: number, end: number): Promise<Uint8Array>;
  close?(): void;
}


export const EXTENSIONS = {
  image: new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "bmp"]),
  video: new Set(["mp4", "mkv", "webm", "mov", "avi", "wmv", "m4v"]),
  audio: new Set(["mp3", "wav", "ogg", "flac", "aac", "m4a", "opus", "wma"]),
  book: new Set(["pdf", "epub", "mobi", "azw3", "cbz", "cbr", "djvu", "txt"]),
} as const;

