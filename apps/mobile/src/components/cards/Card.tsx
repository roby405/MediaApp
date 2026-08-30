/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { MediaMenuButton } from "../buttons/MediaMenuButton";
import { Image, Pressable, View } from "react-native";
import { MediaType } from "@media-app/core/types/global";
import { MediaFile } from "@media-app/core/types/db";

interface CardProps {
  file: MediaFile;
  viewMode: "grid" | "line";
  onPress?: () => void;
  title: string;
  bottomRow: string;
  extra: string;
  type: MediaType;
}

export interface BasicCardProps {
  viewMode: "grid" | "line";
  onPress?: () => void;
}

function Card({
  file,
  viewMode,
  onPress,
  title,
  bottomRow,
  extra,
  type,
}: CardProps) {
  const cover = file.cover;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!cover) {
      setImageUrl(null);
      return;
    }

    const url = "/db/cover/" + file.id;
    setImageUrl(url);
  }, [cover, file.id]);
  return (
    <>
      {viewMode === "grid" && (
        <Pressable
          onPress={onPress}
          className="relative shadow-md group w-full aspect-square rounded-xl bg-secondary select-none"
        >
          {imageUrl ? (
            <View className="w-full h-full overflow-hidden rounded-xl">
              <Image
                source={{ uri: imageUrl }}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
              />
            </View>
          ) : (
            <View className="flex h-full w-full items-center justify-center text-muted-foreground pointer-events-none">
              No Image
            </View>
          )}

          <MediaMenuButton file={file} type="grid" />
          {type !== "image" ? (
            <>
              <View className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/70 pointer-events-none"></View>

              <View className="pointer-events-none absolute left-0 bottom-0 right-0 p-3">
                <View className="truncate text-md drop-shadow-sm">{title}</View>
                <View className="text-gray-400">{bottomRow}</View>
              </View>
            </>
          ) : (
            <></>
          )}
        </Pressable>
      )}
      {viewMode === "line" && (
        <Pressable
          onPress={onPress}
          className="bg-secondary h-16 w-full rounded-xl border-2 border-gray-600 bg-linear-to-b from-secondary to-black/20 select-none"
        >
          <View className="flex flex-row w-full h-full pointer-events-none">
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                className="aspect-square object-cover rounded-md border border-gray-600"
              />
            ) : (
              <View className="flex h-full aspect-square shrink-0 border border-gray-600 rounded-md items-center justify-center p-1 text-center text-muted-foreground">
                No Image
              </View>
            )}
            <View className="flex-1 min-w-0 pt-1 pl-1 pr-2 h-full flex flex-col">
              <View className="flex flex-row relative">
                <View className="truncate text-lg flex-1">{title}</View>
                <MediaMenuButton file={file} type="line" />
              </View>
              <View className="flex-1 pb-2 pr-8 flex flex-row justify-between text-xs items-end">
                <View className="truncate text-left">{extra}</View>
                <View className="truncate text-right">{bottomRow}</View>
              </View>
            </View>
          </View>
        </Pressable>
      )}
    </>
  );
}

export default Card;
