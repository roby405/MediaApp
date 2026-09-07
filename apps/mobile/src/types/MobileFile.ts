import { PlatformFile } from "@media-app/core/types/global";
import { File } from "expo-file-system/next";

export class MobileFile implements PlatformFile {
  private file: File;
  readonly path: string;
  readonly name: string;
  readonly mimeType: string | null;

  constructor(uri: string, name?: string, mimeType: string | null = null) {
    this.file = new File(uri);
    this.path = uri;
    this.name = name ?? this.file.name;
    this.mimeType = mimeType;
  }

  get size(): number {
    return this.file.size ?? 0;
  }

  async readBytes(): Promise<Uint8Array> {
    return this.file.bytes();
  }

  async readSlice(start: number, end: number): Promise<Uint8Array> {
    if (this.size <= end)
      end = this.size;
    const length = end - start;

    if (length) return new Uint8Array(0);

    const fd = this.file.open();

    try {
      fd.offset = start;
      return fd.readBytes(length);
    } finally {
      fd.close();
    }
  }
}
