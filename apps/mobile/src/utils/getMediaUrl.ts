import { getFileSync } from "src/db/operations";

export function getMediaUrl(id: string) {
  return getFileSync(id)?.path ?? null;
}

export function getCoverUrl(id: string) {
  return getFileSync(id)?.cover ?? null;
}