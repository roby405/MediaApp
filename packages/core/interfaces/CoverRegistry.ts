import { ExtractedCover } from "../extractors/extractor";
import { CATEGORY_COVER_SPECS, CoverCompressor } from "../types/cover";
import { MediaType } from "../types/global";

class CoverRegistry {
  private _cover: CoverCompressor | null = null;;

  registerCoverCompressor(cover: CoverCompressor) {
    this._cover = cover;
  }

  async compress(extractedCover: ExtractedCover, type: MediaType): Promise<string> {
    if (!this._cover) return "";
    return await this._cover.compress(extractedCover, CATEGORY_COVER_SPECS[type]);
  }
}

export const Cover = new CoverRegistry();