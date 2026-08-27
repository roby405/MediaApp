import type { MediaFile } from "../db/schema";
import { getCoverUrl } from "../utils/getMediaUrl";

interface CoverImageProps {
  file: MediaFile;
  className?: string;
}

export function CoverImage({ file, className = "" }: CoverImageProps) {
  const hasCover = file.cover !== null;
  if (hasCover)
    return (
      <img
        className={`aspect-square rounded-sm pointer-events-none shrink-0 ${className}`}
        src={getCoverUrl(file.id)}
      />
    );
  else
    return (
      <div
        className={`aspect-square rounded-md border border-primary shrink-0 ${className}`}
      />
    );
}
