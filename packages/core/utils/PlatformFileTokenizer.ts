import { PlatformFile } from "../types/global";
import { AbstractTokenizer, IFileInfo, IReadChunkOptions } from "strtok3";

export class PlatformFileTokenizer extends AbstractTokenizer {
  private file: PlatformFile;
  fileInfo: IFileInfo;

  constructor(file: PlatformFile) {
    super();
    this.file = file;
    this.fileInfo = {
      size: file.size,
      mimeType: file.mimeType ?? undefined,
      path: file.name
    }
  }
  public override supportsRandomAccess(): boolean {
    return true;
  }
  public setPosition(position: number): void {
    this.position = position;
  }
  public override async readBuffer(buffer: Uint8Array, options?: IReadChunkOptions): Promise<number> {
    const length = options?.length ?? (buffer.byteLength);
    const position = options?.position ?? this.position;

    if (length === 0) return 0;

    const slice = await this.file.readSlice(position, position + length);
    if (slice.byteLength === 0 && length > 0 && !options?.mayBeLess) {
      throw new Error("End-Of-File reached while reading");
    }

    buffer.set(slice, 0);

    if (options?.position === undefined)
      this.position += slice.byteLength;

    return slice.byteLength;
  }
  public override async peekBuffer(uint8Array: Uint8Array, options?: IReadChunkOptions): Promise<number> {
    const length = options?.length ?? (uint8Array.byteLength);
    const position = options?.position ?? this.position;

    if (length === 0) return 0;

    const slice = await this.file.readSlice(position, position + length);
    if (slice.byteLength < length && !options?.mayBeLess) {
      throw new Error("End-Of-File reached while reading");
    }

    uint8Array.set(slice, 0);

    return slice.byteLength;
  }

}