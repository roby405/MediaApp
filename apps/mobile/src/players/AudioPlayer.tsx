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
} from "lucide-react-native";
import { ScrollingText } from "../components/motion/ScrollingText";
import { Slider } from "../components/Slider";
import { AudioVolumeMenu } from "../modals/AudioPlayerSettings";
import { IconButton } from "../components/buttons/IconButton";
import { CoverImage } from "../components/CoverImage";
import { Pressable, Text, View } from "react-native";
import { useProgress } from "react-native-track-player";
import { useAudioPlayerStore } from "@media-app/core/stores/useAudioPlayerStore";
import { useNavStore } from "@media-app/core/stores/useNavStore";
import { useMediaStore } from "@media-app/core/stores/useMediaStore";
import { useActiveMedia } from "@media-app/core/hooks/useActiveMedia";

export function MiniAudioControls() {
  const isPlaying = useAudioPlayerStore((state) => state.isPlaying);
  const goToPrev = useNavStore((state) => state.goToPreviousMedia);
  const goToNext = useNavStore((state) => state.goToNextMedia);
  const setPlaying = useAudioPlayerStore((state) => state.setPlaying);

  return (
    <View className="flex flex-row justify-center gap-2 pointer-events-auto">
      <IconButton
        Icon={SkipBackIcon}
        onPress={goToPrev}
        iconProps={{ fill: "currentColor" }}
      />
      <IconButton
        onPress={() => setPlaying(!isPlaying)}
        className=" bg-white"
        Icon={isPlaying ? PauseIcon : PlayIcon}
        iconProps={{ fill: "currentColor", className: "text-gray-800 w-7 h-7" }}
      />
      <IconButton
        Icon={SkipForwardIcon}
        onPress={goToNext}
        iconProps={{ fill: "currentColor" }}
      />
    </View>
  );
}

export function ExtendedAudioControls() {
  const isPlaying = useAudioPlayerStore((state) => state.isPlaying);
  const goToPrev = useNavStore((state) => state.goToPreviousMedia);
  const goToNext = useNavStore((state) => state.goToNextMedia);
  const setPlaying = useAudioPlayerStore((state) => state.setPlaying);
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
    <View className="flex flex-row pointer-events-auto justify-between">
      <View className="relative">
        <IconButton
          onPress={() => setActiveMenu("sound")}
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
      </View>
      <View className="flex flex-row justify-center gap-1 shrink-0">
        <IconButton
          onPress={toggleShuffle}
          Icon={ShuffleIcon}
          iconProps={{ strokeWidth: isShuffle ? 2.5 : 1.4 }}
        />
        <IconButton
          onPress={goToPrev}
          Icon={SkipBackIcon}
          iconProps={{ fill: "currentColor" }}
        />
        <IconButton
          onPress={() => setPlaying(!isPlaying)}
          className=" bg-white"
          Icon={isPlaying ? PauseIcon : PlayIcon}
          iconProps={{
            fill: "currentColor",
            className: "text-gray-800 w-7 h-7",
          }}
        />
        <IconButton
          Icon={SkipForwardIcon}
          onPress={goToNext}
          iconProps={{ fill: "currentColor" }}
        />
        <IconButton
          onPress={() => {
            toggleFavourite(file.category, file.id);
          }}
          Icon={StarIcon}
          iconProps={{ fill: isFavourite ? "currentColor" : "#00000000" }}
          className="rounded-full h-10 w-10 flex items-center justify-center"
        />
      </View>
      <View className="flex flex-row justify-center gap-1">
        <IconButton Icon={ListMusicIcon} />
      </View>
    </View>
  );
}

export function AudioProgressBar() {
  const seek = useAudioPlayerStore((state) => state.audioRef?.seek);
  const { position } = useProgress();

  const {file} = useActiveMedia("audio");

  if (!file || !seek) return null;

  return (
    <Slider
      min={0}
      max={file.metadata.duration}
      step={0.1}
      value={position}
      onChange={(val) => seek(val)}
      className="w-full no-drag"
    />
  );
}

export function MiniAudioPlayer() {
  const setExtended = useAudioPlayerStore((state) => state.setExtended);
  const {file} = useActiveMedia("audio");
  if (!file) return null;
  // TODO fix onpress to on tap from motion
  return (
    <View className="h-24 select-none w-full grid grid-cols-[1fr_auto] gap-3 items-center justify-center">
      <Pressable
        className="grid grid-cols-[auto_1fr] h-full gap-3"
        onPress={() => {
          setExtended(true);
        }}
      >
        <CoverImage file={file} className="w-24 h-24" />
        <View className="flex flex-col justify-center min-w-0 pr-2">
          <ScrollingText
            text={file.metadata.title || ""}
            className="text-text"
          />
          <AppText className="text-gray-300 truncate">{file.metadata.artist}</AppText>
        </View>
      </Pressable>
      <View className="flex align-center flex-col">
        <MiniAudioControls />
      </View>
    </View>
  );
}

export function ExtendedAudioPlayer() {
  const setExtended = useAudioPlayerStore((state) => state.setExtended);
  const {file} = useActiveMedia("audio");
  if (!file) return null;
  // TODO same stuff
  return (
    <View className="select-none w-full flex flex-col gap-3 mb-8">
      <Pressable
        className="flex-col gap-3 flex"
        onPress={() => {
          setExtended(false);
        }}
      >
        <CoverImage file={file} className="flex-1 rounded-2xl" />
        <View className="flex flex-col min-w-0 pr-2">
          <ScrollingText
            text={file.metadata.title || ""}
            className="text-text"
          />
          <AppText className="text-gray-300 truncate">{file.metadata.artist}</AppText>
        </View>
      </Pressable>
      <AudioProgressBar />

      <ExtendedAudioControls />
    </View>
  );
}

export function AudioPlayer() {
  const isExtended = useAudioPlayerStore((state) => state.isExtended);
  return <>{isExtended ? <ExtendedAudioPlayer /> : <MiniAudioPlayer />}</>;
}
