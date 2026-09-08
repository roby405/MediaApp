import { AudioExtractor } from "../extractors/AudioExtractor";
import { CbzExtractor } from "../extractors/CbzExtractor";
import { DefaultExtractor } from "../extractors/DefaultExtractor";
import { EpubExtractor } from "../extractors/EpubExtractor";
import { Extraction, MediaExtractor } from "../extractors/extractor";
import { ImageExtractor } from "../extractors/ImageExtractor";
import { PlatformFile } from "../types/global";

class ExtractorRegistry {
  // global extractors
  private extractors: MediaExtractor[] = [new AudioExtractor(), new ImageExtractor(), new CbzExtractor(), new EpubExtractor()];
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
