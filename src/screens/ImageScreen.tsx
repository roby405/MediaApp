import ImageCard from "../components/cards/ImageCard";
import { ImagePlayer } from "../players/ImagePlayer";
import type { MediaFile } from "../db/schema";
import { useMediaStore } from "../stores/useMediaStore";
import { useScreenViewStore } from "../stores/useScreenViewStore";
import { useNavStore } from "../stores/useNavStore";
import { useEffect } from "react";
import { useFilterStore } from "../stores/useFilterStore";
import { filterFiles } from "../utils/filterFiles";
import { useActiveMedia } from "../hooks/useActiveMedia";


function ImageScreen() {
  const viewMode = useScreenViewStore((state) => state["viewModes"]["image"]);
  const {file} = useActiveMedia("image");
  const setActiveMedia = useNavStore((state) => state.setActiveMedia);
  const loadFiles = useMediaStore((state) => state.loadFiles);
  const filterParams = useFilterStore((state) => state.filterParams);
  const query = useFilterStore((state) => state.searchQuery);
  const mediaFiles = useMediaStore((state) => state.mediaFiles["image"]);
  
  const filteredImages = filterFiles(mediaFiles, filterParams, query);

  useEffect(() => {
    loadFiles("image").catch((err) => console.error(err));
  }, [loadFiles]);

  if (file) {
    return (
      <ImagePlayer />
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-primary">
      <div
        className={`flex-1 ${
          viewMode === "grid" ? "grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 content-start" : "flex flex-col gap-1"
        }`}
      >
        {filteredImages.map((file: MediaFile) => (
          <ImageCard
            key={file.id}
            file={file}
            viewMode={viewMode}
            onClick={() => setActiveMedia(file, filteredImages.map((file) => file.id))}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageScreen;
