import { AudioMetadata, BookMetadata, ImageMetadata, VideoMetadata } from "../types/db";
import { PlatformFile } from "../types/global";

export interface ExtractedCover {
  data: Uint8Array;
  mimeType: string;
}

interface AudioExtraction {
  category: "audio";
  metadata: AudioMetadata;
  cover: ExtractedCover | null;
}

interface VideoExtraction {
  category: "video";
  metadata: VideoMetadata;
  cover: ExtractedCover | null;
}

interface ImageExtraction {
  category: "image";
  metadata: ImageMetadata;
  cover: ExtractedCover | null;
}

interface BookExtraction {
  category: "book";
  metadata: BookMetadata;
  cover: ExtractedCover | null;
}

export type Extraction =
  AudioExtraction | VideoExtraction | ImageExtraction | BookExtraction;

export interface MediaExtractor {
  matches: (file: PlatformFile) => boolean;
  extract: (file: PlatformFile) => Promise<Extraction>;
}
