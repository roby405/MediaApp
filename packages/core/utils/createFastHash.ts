import { bytesToHex } from "@noble/hashes/utils";
import { PlatformFile } from "../types/global";
import { sha256 } from "@noble/hashes/sha2";

const CHUNK_SIZE = 64 * 1024;

export async function createFastHash(file: PlatformFile): Promise<string> {
  let toHash: Uint8Array;

  if (file.size < CHUNK_SIZE * 2) {
    toHash = await file.readBytes();
  } else {
    const head = await file.readSlice(0, CHUNK_SIZE);
    const tail = await file.readSlice(file.size - CHUNK_SIZE, file.size);

    const combined = new Uint8Array(CHUNK_SIZE * 2);
    combined.set(new Uint8Array(head), 0);
    combined.set(new Uint8Array(tail), CHUNK_SIZE);

    toHash = combined;
  }

  return bytesToHex(sha256(toHash));
}