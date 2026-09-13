import { PlatformFile } from "@media-app/core/types/global";
import { DocumentPickerAsset } from "expo-document-picker";
import { File } from "expo-file-system/next";
import { makeSureDirsExist, MEDIA_DIR } from "src/db/operations";
import * as FileSystem from "expo-file-system";

export class MobileFile implements PlatformFile {
  private file: File;
  private cachedFd: ReturnType<File["open"]> | null = null;
  readonly path: string;
  readonly name: string;
  readonly mimeType: string | null;
  private _size: number;

  constructor(
    uri: string,
    name?: string,
    mimeType: string | null = null,
    size: number = 0,
  ) {
    this.file = new File(uri);
    this.path = uri;
    this.name = name ?? this.file.name;
    this.mimeType = mimeType;
    this._size = size;
  }

  static async fromAsset(asset: DocumentPickerAsset) {
    await makeSureDirsExist();
    const ext = asset.name.split(".").pop() || "";
    const mediaDest = `${MEDIA_DIR}staging${Date.now()}_${(Math.random() * 100000).toString(10).slice(0, 4)}.${ext}`;
    await FileSystem.copyAsync({
      from: asset.uri,
      to: mediaDest,
    });

    return new MobileFile(
      mediaDest,
      asset.name,
      asset.mimeType ?? null,
      asset.size ?? 0,
    );
  }

  static fromFile(file: File) {
    return new MobileFile(file.uri, file.name, file.type ?? null);
  }

  get size(): number {
    return this._size || (this.file.size ?? 0);
  }

  async readBytes(): Promise<Uint8Array> {
    return this.file.bytes();
  }

  private getHandle() {
    if (!this.cachedFd) {
      this.cachedFd = this.file.open();
    }
    return this.cachedFd;
  }

  async readSlice(start: number, end: number): Promise<Uint8Array> {
    if (this.size <= end) end = this.size;
    const length = end - start;

    if (length <= 0) return new Uint8Array(0);

    const fd = this.getHandle();
    fd.offset = start;
    return fd.readBytes(length);
  }

  close(): void {
    if (this.cachedFd) {
      this.cachedFd.close();
      this.cachedFd = null;
    }
  }
}
