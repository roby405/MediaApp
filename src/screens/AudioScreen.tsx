import AudioCard from "../components/cards/AudioCard";
import type { AudioMediaFile } from "../db/schema";
import { useMediaStore } from "../stores/useMediaStore";
import { useScreenViewStore } from "../stores/useScreenViewStore";
import { useNavStore } from "../stores/useNavStore";
import { useEffect } from "react";
import { useFilterStore } from "../stores/useFilterStore";
import { filterFiles } from "../utils/filterFiles";


function AudioScreen() {
  const viewMode = useScreenViewStore((state) => state["viewModes"]["audio"]);
  const setActiveMedia = useNavStore((state) => state.setActiveMedia);
  const loadFiles = useMediaStore((state) => state.loadFiles);
  const filterParams = useFilterStore((state) => state.filterParams);
  const query = useFilterStore((state) => state.searchQuery);
  const mediaFiles = useMediaStore((state) => state.mediaFiles["audio"]);
  
  const filteredAudios = filterFiles(mediaFiles, filterParams, query);

  useEffect(() => {
    loadFiles("audio").catch((err) => console.error(err));
  }, [loadFiles]);

  // if (activeMedia && activeMedia.category === "audio") {
  //   return (
  //     <AudioPlayer file={activeMedia} />
  //   );
  // }

  return (
    <div className="flex flex-col w-full h-full bg-primary">
      <div
        className={`flex-1 ${
          viewMode === "grid" ? "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 content-start no-scrollbar overflow-y-auto min-h-0" : "flex flex-col gap-1 no-scrollbar overflow-y-auto min-h-0"
        }`}
      >
        {filteredAudios.map((file: AudioMediaFile) => (
          <AudioCard
            key={file.id}
            file={file}
            viewMode={viewMode}
            onClick={() => setActiveMedia(file, filteredAudios.map((f) => f.id))}
          />
        ))}
      </div>
    </div>
  );
}

export default AudioScreen;
