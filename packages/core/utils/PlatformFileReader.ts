import { Reader } from "unzipit";
import { PlatformFile } from "../types/global";

export class PlatformFileReader implements Reader {
  constructor(private file: PlatformFile) {}

  async getLength(): Promise<number> {
    return this.file.size;
  }
  async read(offset: number, size: number): Promise<Uint8Array<ArrayBuffer>> {
    const slice = await this.file.readSlice(offset, size + offset);

    if (slice.buffer instanceof ArrayBuffer)
      return slice as Uint8Array<ArrayBuffer>;

    // make copy in case of shared array buffer
    const buffer = new ArrayBuffer(size);
    const copy = new Uint8Array(buffer);
    copy.set(slice);
    return copy;
  }
}
