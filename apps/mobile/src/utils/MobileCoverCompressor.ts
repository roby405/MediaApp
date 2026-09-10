import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { CoverCompressor, CoverSpecs } from "@media-app/core/types/cover";
import { COVER_DIR, makeSureDirsExist } from "src/db/operations";
import { ExtractedCover } from "@media-app/core/extractors/extractor";
import { File, Paths } from "expo-file-system/next";
import { MediaType } from "@media-app/core/types/global";
import { createFastHash } from "@media-app/core/utils/createFastHash";
import { MobileFile } from "src/types/MobileFile";

export class MobileCoverCompressor implements CoverCompressor {
  async compress(cover: ExtractedCover, specs: CoverSpecs): Promise<string> {
    const { data } = cover;

    if (!data || data.byteLength === 0) return "";

    const tempFile = new File(Paths.cache, `temp_cover_${Date.now()}`);
    tempFile.create();
    tempFile.write(data);

    try {
      const context = ImageManipulator.manipulate(tempFile.uri);
      context.resize({ width: specs.width, height: specs.height });
      const imageRef = await context.renderAsync();
      const res = await imageRef.saveAsync({
        format: SaveFormat.WEBP,
        compress: specs.quality,
      });

      context.release();
      imageRef.release();

      const id = await createFastHash(MobileFile.fromFile(new File(res.uri)));

      const dest = `${COVER_DIR}${id}.webp`;

      await makeSureDirsExist();
      await FileSystem.moveAsync({
        from: res.uri,
        to: dest,
      });

      return id;
    } catch (error) {
      console.error(`Couldn't compress cover: ${error}`);
      return "";
    } finally {
      if (tempFile.exists)
        tempFile.delete();
    }
  }
}
