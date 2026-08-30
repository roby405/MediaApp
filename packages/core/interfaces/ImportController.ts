import { AudioMetadata, BookMetadata, ImageMetadata, VideoMetadata } from "../types/db";

export interface ImportController {
  extractEpubCover: (file: File) => Promise<string | null>;
  extractPdfCover: (file: File) => Promise<string | null>;
  extractCbzCover: (file: File) => Promise<string | null>;
  extractImageCover: (file: File) => Promise<string | null>;
  extractVideoCover: (file: File) => Promise<string | null>;
  extractAudioCover: (file: File) => Promise<string | null>;
  // Metadata
  extractEpubMetadata: (file: File) => Promise<BookMetadata>;
  extractPdfMetadata: (file: File) => Promise<BookMetadata>;
  extractCbzMetadata: (file: File) => Promise<BookMetadata>;
  extractImageMetadata: (file: File) => Promise<ImageMetadata>;
  extractVideoMetadata: (file: File) => Promise<VideoMetadata>;
  extractAudioMetadata: (file: File) => Promise<AudioMetadata>;
}