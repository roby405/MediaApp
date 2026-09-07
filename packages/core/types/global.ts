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
}
