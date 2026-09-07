import { MediaExtractor } from "@media-app/core/extractors/extractor";
import { PlatformFile } from "@media-app/core/types/global";
import { MobileFile } from "src/types/MobileFile";

export class ImageExtractor implements MediaExtractor {
  matches(file: PlatformFile) {
    return ["jpg", "jpeg", "png", "webp", "gif", "avif", "bpm", "svg"].includes(file.name.split(".").pop()?.toLowerCase() || "");
  }
}