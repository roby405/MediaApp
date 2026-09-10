import { useCallback, useMemo } from "react";
import { MediaType } from "@media-app/core/types/global";
import { useWindowDimensions, View, FlatList } from "react-native";
import { CardRegistry } from "../components/cards/registry";
import { getResponsiveColumns } from ".";
import { useScreenViewStore } from "@media-app/core/stores/useScreenViewStore";
import { useNavStore } from "@media-app/core/stores/useNavStore";
import { useMediaStore } from "@media-app/core/stores/useMediaStore";
import { useFilterStore } from "@media-app/core/stores/useFilterStore";
import { filterFiles } from "@media-app/core/utils/filterFiles";
import { MediaFile } from "@media-app/core/types/db";

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
  const { width } = useWindowDimensions();
  const cols = viewMode === "line" ? 1 : getResponsiveColumns(type, width);

  const filteredMedia = useMemo(
    () => filterFiles(mediaFiles, filterParams, query),
    [mediaFiles, filterParams, query],
  );

  const filteredIds = useMemo(
    () => filteredMedia.map((file) => file.id),
    [filteredMedia],
  );
  const CardComponent = CardRegistry[type];

  const renderCard = useCallback(
    ({ item }: { item: MediaFile }) => (
      <CardComponent
        file={item}
        viewMode={viewMode}
        onPress={() => setActiveMedia(item, filteredIds)}
      />
    ),
    [CardComponent, viewMode, setActiveMedia, filteredIds],
  );

  return (
    <View className="flex flex-col w-full h-full px-4 bg-primary">
      <FlatList
        key={`flatlist-${type}-${viewMode}-${cols}`}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{gap:8}}
        columnWrapperStyle={cols > 1 ? {gap:8} : undefined}
        data={filteredMedia}
        renderItem={renderCard}
        numColumns={cols}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
        windowSize={5}
      />
    </View>
  );
}
