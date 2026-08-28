import { Image } from "react-native";
import type { MediaFile } from "../db/schema";
import { getCoverUrl } from "../utils/getMediaUrl";
import { View } from "lucide-react-native";

interface CoverImageProps {
  file: MediaFile;
  className?: string;
}

export function CoverImage({ file, className = "" }: CoverImageProps) {
  const hasCover = file.cover !== null;
  if (hasCover)
    return (
      <Image
        className={`aspect-square rounded-sm pointer-events-none shrink-0 ${className}`}
        source={{uri: getCoverUrl(file.id)}}
      />
    );
  else
    return (
      <View
        className={`aspect-square rounded-md border border-primary shrink-0 ${className}`}
      />
    );
}
