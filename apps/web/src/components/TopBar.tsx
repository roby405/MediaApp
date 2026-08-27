import { useState } from "react";
import FilterMedia from "../modals/FilterMedia";
import { useNavStore } from "../../../../packages/core/stores/useNavStore";
import { useScreenViewStore } from "../../../../packages/core/stores/useScreenViewStore";
import {
  ArrowLeftIcon,
  EllipsisVertical,
  Filter,
  LayoutGrid,
  LayoutList,
  Search,
} from "lucide-react";
import SearchMedia from "../modals/SearchMedia";
import { IconButton } from "./buttons/IconButton";
import { useActiveMedia } from "../../../../packages/core/hooks/useActiveMedia";

const ITEMS: Record<string, string> = {
  book: "Books",
  audio: "Audio",
  video: "Videos",
  image: "Images",
};

function TopBar() {
  const setViewMode = useScreenViewStore((state) => state.setViewMode);
  const activeScreen = useNavStore((state) => state.activeScreen);
  const viewModes = useScreenViewStore((state) => state["viewModes"]);
  const {file} = useActiveMedia();
  const name = file?.name ?? "";
  const setActiveMedia = useNavStore((state) => state.setActiveMedia);


  const [filterActive, setFilterActive] = useState<boolean>(false);
  const [searchActive, setSearchActive] = useState<boolean>(false);

  if (activeScreen === "import") return null;

  const viewMode = viewModes[activeScreen];
  return (
    <div className="h-12 mb-4 flex flex-row bg-secondary justify-center items-center px-2 rounded-b-sm">
      {!file || file.category === "audio" || file.category === "video" ? (
        <>
          <span className="text-2xl text-center font-medium">
            {ITEMS[activeScreen]}
          </span>
          <div className="flex flex-row justify-end w-full gap-3">
            <IconButton
              onClick={() => {
                if (viewMode === "grid") {
                  setViewMode("line");
                } else {
                  setViewMode("grid");
                }
              }}
              Icon={viewMode === "grid" ? LayoutList : LayoutGrid}
              iconProps={{ strokeWidth: 1.7, className: "w-7 h-7" }}
            />
            <IconButton
              Icon={Filter}
              iconProps={{ strokeWidth: 1.7, className: "w-7 h-7" }}
              onClick={() => {
                setFilterActive(true);
                console.log("heyyy");
              }}
            />
            {filterActive && (
              <FilterMedia
                isOpen={filterActive}
                onClose={() => setFilterActive(false)}
                category={activeScreen}
              />
            )}
            <IconButton
              Icon={Search}
              iconProps={{ strokeWidth: 1.7, className: "w-7 h-7" }}
              onClick={() => setSearchActive(true)}
            />
            {searchActive && (
              <SearchMedia
                isOpen={searchActive}
                onClose={() => setSearchActive(false)}
                category={activeScreen}
              />
            )}
            <IconButton
              Icon={EllipsisVertical}
              iconProps={{ strokeWidth: 1.7, className: "w-7 h-7" }}
              onClick={() => {}}
            />
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setActiveMedia(null)} className="pointer-events-auto">
            {<ArrowLeftIcon className="w-7 h-7" strokeWidth={1.7} />}
          </button>

          <span className="w-full text-center text-xl truncate px-8">
            {name}
          </span>
          <div className="flex flex-row justify-end gap-3">
            <button onClick={() => {}} className="">
              {<EllipsisVertical className="w-7 h-7" strokeWidth={1.7} />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TopBar;
