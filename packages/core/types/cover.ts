import { ExtractedCover } from "../extractors/extractor";
import { MediaType } from "./global";

export interface CoverSpecs {
  width: number;
  height: number;
  quality: number;
  format: "webp";
}

export const CATEGORY_COVER_SPECS: Record<MediaType, CoverSpecs> = {
  "audio": {width: 300, height: 300, quality: 0.7, format: "webp"},
  "video": {width: 640, height: 320, quality: 0.7, format: "webp"},
  "book": {width: 400, height: 600, quality: 0.7, format: "webp"},
  "image": {width: 300, height: 300, quality: 0.7, format: "webp"},
}

export interface CoverCompressor {
  compress(extractedCover: ExtractedCover, type: CoverSpecs): Promise<string>;
}