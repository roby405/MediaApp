import { useAudioPlayerStore } from "../stores/useAudioPlayerStore";
import {
  ListMusicIcon,
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
import { useNavStore } from "../../../../packages/core/stores/useNavStore";
import { ScrollingText } from "../components/motion/ScrollingText";
import { motion } from "framer-motion";
import { useMediaStore } from "../../../../packages/core/stores/useMediaStore";
import { Slider } from "../components/Slider";
import { AudioVolumeMenu } from "../modals/AudioPlayerSettings";
import { IconButton } from "../components/buttons/IconButton";
import { CoverImage } from "../components/CoverImage";
import { useActiveMedia } from "../../../../packages/core/hooks/useActiveMedia";

export function MiniAudioControls() {
  const isPlaying = useAudioPlayerStore((state) => state.isPlaying);
  const goToPrev = useNavStore((state) => state.goToPreviousMedia);
  const goToNext = useNavStore((state) => state.goToNextMedia);
  const togglePlaying = useAudioPlayerStore((state) => state.togglePlaying);

  return (
    <div className="flex flex-row justify-center gap-2 pointer-events-auto">
      <IconButton
        Icon={SkipBackIcon}
        onClick={goToPrev}
        iconProps={{ fill: "currentColor" }}
      />
      <IconButton
        onClick={togglePlaying}
        className=" bg-white"
        Icon={isPlaying ? PauseIcon : PlayIcon}
        iconProps={{ fill: "currentColor", className: "text-gray-800 w-7 h-7" }}
      />
      <IconButton
        Icon={SkipForwardIcon}
        onClick={goToNext}
        iconProps={{ fill: "currentColor" }}
      />
    </div>
  );
}

export function ExtendedAudioControls() {
  const isPlaying = useAudioPlayerStore((state) => state.isPlaying);
  const goToPrev = useNavStore((state) => state.goToPreviousMedia);
  const goToNext = useNavStore((state) => state.goToNextMedia);
  const togglePlaying = useAudioPlayerStore((state) => state.togglePlaying);
  const volume = useAudioPlayerStore((state) => state.volume);
  const toggleFavourite = useMediaStore((state) => state.toggleFavourite);
  const {file} = useActiveMedia();
  const activeMenu = useAudioPlayerStore((state) => state.activeMenu);
  const setActiveMenu = useAudioPlayerStore((state) => state.setActiveMenu);
  const isShuffle = useNavStore((state) => state.isShuffle);
  const toggleShuffle = useNavStore((state) => state.toggleShuffle);

  if (!file) return null;
  const isFavourite = file.is_favourite;

  return (
    <div className="flex flex-row pointer-events-auto justify-between">
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
        <AudioVolumeMenu
          isOpen={activeMenu === "sound"}
          onClose={() => setActiveMenu(null)}
        />
      </div>
      <div className="flex flex-row justify-center gap-1 shrink-0">
        <IconButton
          onClick={toggleShuffle}
          Icon={ShuffleIcon}
          iconProps={{ strokeWidth: isShuffle ? 2.5 : 1.4 }}
        />
        <IconButton
          onClick={goToPrev}
          Icon={SkipBackIcon}
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
        <IconButton
          onClick={() => {
            toggleFavourite(file.category, file.id);
          }}
          Icon={StarIcon}
          iconProps={{ fill: isFavourite ? "currentColor" : "#00000000" }}
          className="rounded-full h-10 w-10 flex items-center justify-center"
        />
      </div>
      <div className="flex flex-row justify-center gap-1">
        <IconButton Icon={ListMusicIcon} />
      </div>
    </div>
  );
}

export function AudioProgressBar() {
  const onSeek = useAudioPlayerStore((state) => state.onSeek);
  const currentTime = useAudioPlayerStore((state) => state.currentTime);

  const {file} = useActiveMedia("audio");

  if (!file) return null;

  return (
    <Slider
      min={0}
      max={file.metadata.duration}
      step={0.1}
      value={currentTime}
      onChange={(val) => onSeek(val)}
      className="w-full no-drag"
    />
  );
}

export function MiniAudioPlayer() {
  const setExtended = useAudioPlayerStore((state) => state.setExtended);
  const {file} = useActiveMedia("audio");
  if (!file) return null;
  return (
    <div className="h-24 select-none w-full grid grid-cols-[1fr_auto] gap-3 items-center justify-center">
      <motion.div
        className="grid grid-cols-[auto_1fr] h-full gap-3"
        onTap={() => {
          setExtended(true);
        }}
      >
        <CoverImage file={file} className="w-24 h-24" />
        <div className="flex flex-col justify-center min-w-0 pr-2">
          <ScrollingText
            text={file.metadata.title || ""}
            className="text-text"
          />
          <span className="text-gray-300 truncate">{file.metadata.artist}</span>
        </div>
      </motion.div>
      <div className="flex align-center flex-col">
        <MiniAudioControls />
      </div>
    </div>
  );
}

export function ExtendedAudioPlayer() {
  const setExtended = useAudioPlayerStore((state) => state.setExtended);
  const {file} = useActiveMedia("audio");
  if (!file) return null;
  return (
    <div className="select-none w-full flex flex-col gap-3 mb-8">
      <motion.div
        className="flex-col gap-3 flex"
        onTap={() => {
          setExtended(false);
        }}
      >
        <CoverImage file={file} className="flex-1 rounded-2xl" />
        <div className="flex flex-col min-w-0 pr-2">
          <ScrollingText
            text={file.metadata.title || ""}
            className="text-text"
          />
          <span className="text-gray-300 truncate">{file.metadata.artist}</span>
        </div>
      </motion.div>
      <AudioProgressBar />

      <ExtendedAudioControls />
    </div>
  );
}

export function AudioPlayer() {
  const isExtended = useAudioPlayerStore((state) => state.isExtended);
  return <>{isExtended ? <ExtendedAudioPlayer /> : <MiniAudioPlayer />}</>;
}
