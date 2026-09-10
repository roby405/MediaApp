import { COVER_DIR, getFileSync } from "src/db/operations";

export function getMediaUrl(id: string) {
  return getFileSync(id)?.path ?? null;
}

export function getCoverUrl(id: string) {
  const cover = getFileSync(id)?.cover;
  if (!cover) return null;

  return `${COVER_DIR}${cover}.webp`;
}