import { DefaultExtractor } from "../extractors/DefaultExtractor";
import { Extraction, MediaExtractor } from "../extractors/extractor";
import { PlatformFile } from "../types/global";

class ExtractorRegistry {
  private extractors: MediaExtractor[] = [];
  private defaultExtractor = new DefaultExtractor();

  registerExtractor(extractor: MediaExtractor) {
    this.extractors.push(extractor);
  }

  getExtractor(file: PlatformFile) {
    return (
      this.extractors.find((extr) => extr.matches(file)) ??
      this.defaultExtractor
    );
  }

  async extract(file: PlatformFile): Promise<Extraction> {
    const extractor = this.getExtractor(file);
    return await extractor.extract(file);
  }
}

export const Extractor = new ExtractorRegistry();
