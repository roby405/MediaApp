import AudioCard from "../components/cards/AudioCard";
import type { AudioMediaFile, MediaFile } from "../db/schema";
import { useMediaStore } from "../../../../packages/core/stores/useMediaStore";
import { useScreenViewStore } from "../../../../packages/core/stores/useScreenViewStore";
import { useNavStore } from "../../../../packages/core/stores/useNavStore";
import { useEffect, useMemo } from "react";
import { useFilterStore } from "../../../../packages/core/stores/useFilterStore";
import { filterFiles } from "../../../../packages/core/utils/filterFiles";
import { MediaType } from "@media-app/core/types/global";
import { View } from "react-native";
import { CardRegistry } from "../components/cards/registry";
import { GRID_LAYOUT_MAP } from ".";

export interface ScreenProps {
  type: MediaType;
}

export function MediaScreen({ type }: ScreenProps) {
  const viewMode = useScreenViewStore((state) => state["viewModes"][type]);
  const setActiveMedia = useNavStore((state) => state.setActiveMedia);
  const loadFiles = useMediaStore((state) => state.loadFiles);
  const filterParams = useFilterStore((state) => state.filterParams);
  const query = useFilterStore((state) => state.searchQuery);
  const mediaFiles = useMediaStore((state) => state.mediaFiles[type]);

  const filteredMedia = useMemo(
    () => filterFiles(mediaFiles, filterParams, query),
    [mediaFiles, filterFiles, query],
  );
  const CardComponent = CardRegistry[type];
  const gridLayout = GRID_LAYOUT_MAP[type];

  useEffect(() => {
    loadFiles(type).catch((err) => console.error(err));
  }, [loadFiles]);

  // if (activeMedia && activeMedia.category === "audio") {
  //   return (
  //     <AudioPlayer file={activeMedia} />
  //   );
  // }

  return (
    <View className="flex flex-col w-full h-full bg-primary">
      <View
        className={`flex-1 ${
          viewMode === "grid"
            ? `grid ${gridLayout} content-start no-scrollbar overflow-y-auto min-h-0`
            : "flex flex-col gap-1 no-scrollbar overflow-y-auto min-h-0"
        }`}
      >
        {filteredMedia.map((file: MediaFile) => (
          <CardComponent
            key={file.id}
            file={file}
            viewMode={viewMode}
            onPress={() =>
              setActiveMedia(
                file,
                filteredMedia.map((f) => f.id),
              )
            }
          />
        ))}
      </View>
    </View>
  );
}
