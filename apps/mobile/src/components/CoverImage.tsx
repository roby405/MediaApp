import { Image } from "react-native";
import { getCoverUrl } from "../utils/getMediaUrl";
import { View } from "lucide-react-native";
import { MediaFile } from "@media-app/core/types/db";

interface CoverImageProps {
  file: MediaFile;
  className?: string;
}

export function CoverImage({ file, className = "" }: CoverImageProps) {
  if (file.cover)
    return (
      <Image
        className={`aspect-square rounded-sm pointer-events-none shrink-0 ${className}`}
        source={{uri: file.cover}}
      />
    );
  else
    return (
      <View
        className={`aspect-square rounded-md border border-primary shrink-0 ${className}`}
      />
    );
}
