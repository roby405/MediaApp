import { Image, View } from "react-native";
import { getCoverUrl } from "../utils/getMediaUrl";
import { MediaFile } from "@media-app/core/types/db";

interface CoverImageProps {
  file: MediaFile;
  className?: string;
}

export function CoverImage({ file, className = "" }: CoverImageProps) {
  const coverUrl = file.cover ? getCoverUrl(file.id) : "";
  if (coverUrl)
    return (
      <View className="overflow-hidden">
        <Image
          className={`aspect-square rounded-md object-cover pointer-events-none shrink-0 ${className}`}
          source={{ uri: coverUrl }}
        />
      </View>
    );
  else
    return (
      <View
        className={`aspect-square rounded-md border border-primary bg-red shrink-0 ${className}`}
      />
    );
}
