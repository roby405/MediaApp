import BookCard from "../components/cards/BookCard";
import { BookPlayer } from "../players/BookPlayer";
import type { BookMediaFile } from "../db/schema";
import { useMediaStore } from "../stores/useMediaStore";
import { useScreenViewStore } from "../stores/useScreenViewStore";
import { useNavStore } from "../stores/useNavStore";
import { useEffect } from "react";
import { useFilterStore } from "../stores/useFilterStore";
import { useActiveMedia } from "../hooks/useActiveMedia";
import { filterFiles } from "../utils/filterFiles";


function BookScreen() {
  const viewMode = useScreenViewStore((state) => state["viewModes"]["book"]);
  const {file} = useActiveMedia("book");
  const setActiveMedia = useNavStore((state) => state.setActiveMedia);
  const loadFiles = useMediaStore((state) => state.loadFiles);
  const filterParams = useFilterStore((state) => state.filterParams);
  const query = useFilterStore((state) => state.searchQuery);
  const mediaFiles = useMediaStore((state) => state.mediaFiles["book"]);
  
  const filteredBooks = filterFiles(mediaFiles, filterParams, query);

  useEffect(() => {
    loadFiles("book").catch((err) => console.error(err));
  }, [loadFiles]);

  if (file) {
    return (
      <BookPlayer file={file} />
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-primary">
      <div
        className={`flex-1 ${
          viewMode === "grid" ? "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 content-start" : "flex flex-col gap-1"
        }`}
      >
        {filteredBooks.map((file: BookMediaFile) => (
          <BookCard
            key={file.id}
            file={file}
            viewMode={viewMode}
            onClick={() => setActiveMedia(file)}
          />
        ))}
      </div>
    </div>
  );
}

export default BookScreen;
