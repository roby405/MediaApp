// sorry i got lazy after i had to switch from unzipit to fflate

import { unzip as fflateUnzip, strFromU8 } from "fflate";
import { PlatformFile } from "../types/global";

export interface ZipEntry {
  name: string;
  text(): Promise<string>;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export class PlatformFileReader {
  constructor(public file: PlatformFile) {}
}

export async function unzip(reader: PlatformFileReader): Promise<{ entries: Record<string, ZipEntry> }> {
  const bytes = await reader.file.readBytes();
  return new Promise((resolve, reject) => {
    fflateUnzip(bytes, (err, unzipped) => {
      if (err) return reject(err);

      const entries: Record<string, ZipEntry> = {};
      for (const [name, data] of Object.entries(unzipped)) {
        entries[name] = {
          name,
          text: async () => strFromU8(data),
          arrayBuffer: async () =>
            data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength),
        };
      }
      resolve({ entries });
    });
  });
}
