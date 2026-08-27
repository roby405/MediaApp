import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";
import {
  MaximizeIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeOffIcon,
} from "lucide-react";
import { useNavStore } from "../../../../../packages/core/stores/useNavStore";
import { toggleFullscreen } from "../../utils/toggleFullscreen";
import { IconButton } from "../../components/buttons/IconButton";

interface MiniVideoControlsProps {
  startViewTransition: () => void;
}

export function MiniVideoControls({
  startViewTransition,
}: MiniVideoControlsProps) {
  const isPlaying = useVideoPlayerStore((state) => state.isPlaying);
  const goToPrev = useNavStore((state) => state.goToPreviousMedia);
  const goToNext = useNavStore((state) => state.goToNextMedia);
  const togglePlaying = useVideoPlayerStore((state) => state.togglePlaying);
  const volume = useVideoPlayerStore((state) => state.volume);

  return (
    <div className="flex flex-col justify-between self-stretch pointer-events-auto">
      <IconButton
        Icon={MaximizeIcon}
        onClick={() => {
          toggleFullscreen("expanded-video-player").then(
            () => console.log("fullscreen"),
            () => console.error("epic fail"),
          );
          startViewTransition();
        }}
      />
      <div className="flex flex-col items-center justify-center gap-2 pointer-events-auto">
        <IconButton
          Icon={SkipBackIcon}
          onClick={goToPrev}
          iconProps={{ fill: "currentColor" }}
        />
        <IconButton
          onClick={togglePlaying}
          className=" bg-white"
          Icon={isPlaying ? PauseIcon : PlayIcon}
          iconProps={{
            fill: "currentColor",
            className: "text-gray-800 w-7 h-7",
          }}
        />
        <IconButton
          Icon={SkipForwardIcon}
          onClick={goToNext}
          iconProps={{ fill: "currentColor" }}
        />
      </div>
      <button className="w-10 h-10 flex items-center justify-center rounded-full">
        {volume === 0 ? (
          <VolumeOffIcon className="w-6 h-6 text-gray-800" strokeWidth={1.4} />
        ) : volume < 50 ? (
          <Volume1Icon className="w-6 h-6 text-gray-800" strokeWidth={1.4} />
        ) : (
          <Volume2Icon className="w-6 h-6 text-gray-800" strokeWidth={1.4} />
        )}
      </button>
    </div>
  );
}
