import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";
import {
  GaugeIcon,
  ListVideoIcon,
  MinimizeIcon,
  PauseIcon,
  PlayIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  StarIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeOffIcon,
} from "lucide-react";
import { useNavStore } from "../../../../../packages/core/stores/useNavStore";
import { useMediaStore } from "../../../../../packages/core/stores/useMediaStore";
import { TimeViewer, VideoProgressBar } from "./VideoProgressBar";
import { startViewTransition } from "../../utils/startViewTransition";
import { IconButton } from "../../components/buttons/IconButton";
import {
  VideoPlaybackMenu,
  VideoQueueMenu,
  VideoVolumeMenu,
} from "../../modals/VideoPlayerSettings";
import { useActiveMedia } from "../../../../../packages/core/hooks/useActiveMedia";

export function ExpandedVideoControls() {
  const isPlaying = useVideoPlayerStore((state) => state.isPlaying);
  const goToPrev = useNavStore((state) => state.goToPreviousMedia);
  const goToNext = useNavStore((state) => state.goToNextMedia);
  const togglePlaying = useVideoPlayerStore((state) => state.togglePlaying);
  const volume = useVideoPlayerStore((state) => state.volume);
  const toggleFavourite = useMediaStore((state) => state.toggleFavourite);
  const {file} = useActiveMedia();
  const setExpanded = useVideoPlayerStore((state) => state.setExpanded);
  const activeMenu = useVideoPlayerStore((state) => state.activeMenu);
  const setActiveMenu = useVideoPlayerStore((state) => state.setActiveMenu);
  const isShuffle = useNavStore((state) => state.isShuffle);
  const toggleShuffle = useNavStore((state) => state.toggleShuffle);

  
  if (!file || file.category !== "video") return null;
  const isFavourite = file.is_favourite;

  return (
    <div className="pb-7 px-6 pt-5 grid grid-flow-row auto-rows-fr h-full w-full absolute inset-0 text-gray-100 bg-linear-to-b from-black/40 via-black/20 to-black/40 z-60">
      {/* top row video settings buttons*/}
      <div className="flex flex-row pointer-events-auto justify-between items-start">
        <div className="flex flex-row justify-center gap-1 shrink-0">
          <IconButton onClick={toggleShuffle} Icon={ShuffleIcon} iconProps={{strokeWidth: isShuffle ? 2 : 1.4}} />
          <IconButton
            onClick={() => {
              toggleFavourite(file.category, file.id);
            }}
            Icon={StarIcon}
            iconProps={{
              fill: isFavourite ? "currentColor" : "#00000000",
            }}
          />
        </div>
        <div className="flex flex-row justify-center gap-1">
          <div className="relative">
            <IconButton
              Icon={GaugeIcon}
              onClick={() => setActiveMenu("playback")}
            />
            <VideoPlaybackMenu
              isOpen={activeMenu === "playback"}
              onClose={() => setActiveMenu(null)}
            />
          </div>
          <div className="relative">
            <IconButton
              Icon={ListVideoIcon}
              onClick={() => setActiveMenu("queue")}
            />
            <VideoQueueMenu
              isOpen={activeMenu === "queue"}
              onClose={() => setActiveMenu(null)}
            />
          </div>
        </div>
      </div>
      {/* mid row video control buttons */}
      <div className="flex flex-row justify-center items-center gap-12 sm:gap-16 md:gap-24">
        <IconButton
          onClick={goToPrev}
          Icon={SkipBackIcon}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-200"
          iconProps={{
            fill: "currentColor",
            className:
              "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 drop-shadow-md",
          }}
        />
        <IconButton
          onClick={togglePlaying}
          Icon={isPlaying ? PauseIcon : PlayIcon}
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-gray-100"
          iconProps={{
            fill: "currentColor",
            className:
              "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-lg",
          }}
        />

        <IconButton
          onClick={goToNext}
          Icon={SkipForwardIcon}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-200"
          iconProps={{
            fill: "currentColor",
            className:
              "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 drop-shadow-md",
          }}
        />
      </div>
      {/* bottom row minimize button + progress bar with time and name of file*/}
      <div className="flex flex-col gap-2 justify-end">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row justify-start gap-5">
            <TimeViewer />
            <span>{file.name}</span>
          </div>
          <div className="flex flex-row justify-end gap-2">
            <div className="relative">
              <IconButton
                onClick={() => setActiveMenu("sound")}
                Icon={
                  volume === 0
                    ? VolumeOffIcon
                    : volume < 50
                      ? Volume1Icon
                      : Volume2Icon
                }
              />
              <VideoVolumeMenu
                isOpen={activeMenu === "sound"}
                onClose={() => setActiveMenu(null)}
              />
            </div>
            <IconButton
              onClick={() => startViewTransition(() => setExpanded(false))}
              Icon={MinimizeIcon}
            />
          </div>
        </div>
        <VideoProgressBar />
      </div>
    </div>
  );
}
