import { AudioMetadata, BookMetadata, ImageMetadata, VideoMetadata } from "../types/db";
import { PlatformFile } from "../types/global";

export interface ImportController {
  extractEpubCover: (file: PlatformFile) => Promise<string | null>;
  extractPdfCover: (file: PlatformFile) => Promise<string | null>;
  extractCbzCover: (file: PlatformFile) => Promise<string | null>;
  extractImageCover: (file: PlatformFile) => Promise<string | null>;
  extractVideoCover: (file: PlatformFile) => Promise<string | null>;
  extractAudioCover: (file: PlatformFile) => Promise<string | null>;
  // Metadata
  extractEpubMetadata: (file: PlatformFile) => Promise<BookMetadata>;
  extractPdfMetadata: (file: PlatformFile) => Promise<BookMetadata>;
  extractCbzMetadata: (file: PlatformFile) => Promise<BookMetadata>;
  extractImageMetadata: (file: PlatformFile) => Promise<ImageMetadata>;
  extractVideoMetadata: (file: PlatformFile) => Promise<VideoMetadata>;
  extractAudioMetadata: (file: PlatformFile) => Promise<AudioMetadata>;
}