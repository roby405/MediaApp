import VideoCard from "../components/cards/VideoCard";
// import { VideoPlayer } from "../players/VideoPlayer";
import type { MediaFile } from "../db/schema";
import { useMediaStore } from "../stores/useMediaStore";
import { useScreenViewStore } from "../stores/useScreenViewStore";
import { useNavStore } from "../stores/useNavStore";
import { useEffect } from "react";
import { useFilterStore } from "../stores/useFilterStore";
import { filterFiles } from "../utils/filterFiles";


function VideoScreen() {
  const viewMode = useScreenViewStore((state) => state["viewModes"]["video"]);
  // const activeMedia = useNavStore((state) => state.activeMedia);
  const setActiveMedia = useNavStore((state) => state.setActiveMedia);
  const loadFiles = useMediaStore((state) => state.loadFiles);
  const filterParams = useFilterStore((state) => state.filterParams);
  const query = useFilterStore((state) => state.searchQuery);
  const mediaFiles = useMediaStore((state) => state.mediaFiles["video"]);
  
  const filteredVideos = filterFiles(mediaFiles, filterParams, query);

  useEffect(() => {
    loadFiles("video").catch((err) => console.error(err));
  }, [loadFiles]);

  // if (activeMedia) {
  //   return (
  //     <VideoPlayer file={activeMedia} />
  //   );
  // }

  return (
    <div className="flex flex-col w-full h-full bg-primary">
      <div
        className={`flex-1 ${
          viewMode === "grid" ? "grid grid-cols-1 gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 content-start no-scrollbar overflow-y-auto min-h-0" : "flex flex-col gap-1 no-scrollbar overflow-y-auto min-h-0"
        }`}
      >
        {filteredVideos.map((file: MediaFile) => (
          <VideoCard
            key={file.id}
            file={file}
            viewMode={viewMode}
            onClick={() => setActiveMedia(file, filteredVideos.map((f) => f.id))}
          />
        ))}
      </div>
    </div>
  );
}

export default VideoScreen;
