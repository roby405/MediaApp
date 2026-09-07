import { PlatformFile } from "../types/global";
import { Extraction, MediaExtractor } from "./extractor";

export class DefaultExtractor implements MediaExtractor {
  matches(file: PlatformFile) {
    return true;
  }
  async extract(file: PlatformFile): Promise<Extraction> {
    return {
      category: "book",
      metadata: {},
      cover: null
    }
  }
}