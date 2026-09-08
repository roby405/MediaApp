import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { CoverCompressor } from "@media-app/core/types/cover";
import { COVER_DIR } from "src/db/operations";

export class MobileCoverCompressor implements CoverCompressor {
  compress(data: Uint8Array, mimeType: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  // async compress(data: Uint8Array, mimeType: string) {
  //   const temp = `${COVER_DIR}tempfile`;
  //   await FileSystem.writeAsStringAsync(temp, Buffer.from(data).to)
  // }
}