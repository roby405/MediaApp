import { PlatformFile } from "../types/global";
import { Extraction, MediaExtractor } from "./extractor";

export class ImageExtractor implements MediaExtractor {
  matches(file: PlatformFile) {
    return ["jpg", "jpeg", "png", "webp", "gif", "avif", "bpm", "svg"].includes(
      file.name.split(".").pop()?.toLowerCase() || "",
    );
  }

  // TODO add metadata at some point
  async extract(file: PlatformFile): Promise<Extraction> {
    return {
      category: "image",
      metadata: {},
      cover: {
        data: await file.readBytes(),
        mimeType: file.mimeType || "",
      },
    };
  }
}
