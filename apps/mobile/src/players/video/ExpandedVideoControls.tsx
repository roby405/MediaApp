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
} from "lucide-react-native";
import { TimeViewer, VideoProgressBar } from "./VideoProgressBar";
// import { startViewTransition } from "../../utils/startViewTransition";
import { IconButton } from "../../components/buttons/IconButton";
import {
  VideoPlaybackMenu,
  VideoQueueMenu,
  VideoVolumeMenu,
} from "../../modals/VideoPlayerSettings";
import { Text, View } from "react-native";
import { useVideoPlayerStore } from "@media-app/core/stores/useVideoPlayerStore";
import { useNavStore } from "@media-app/core/stores/useNavStore";
import { useMediaStore } from "@media-app/core/stores/useMediaStore";
import { useActiveMedia } from "@media-app/core/hooks/useActiveMedia";
import { AppText } from "src/components/AppText";

export function ExpandedVideoControls() {
  const isPlaying = useVideoPlayerStore((state) => state.isPlaying);
  const goToPrev = useNavStore((state) => state.goToPreviousMedia);
  const goToNext = useNavStore((state) => state.goToNextMedia);
  const setPlaying = useVideoPlayerStore((state) => state.setPlaying);
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
    <View className="pb-7 px-6 pt-5 grid grid-flow-row auto-rows-fr h-full w-full absolute inset-0 text-gray-100 bg-linear-to-b from-black/40 via-black/20 to-black/40 z-60">
      {/* top row video settings buttons*/}
      <View className="flex flex-row pointer-events-auto justify-between items-start">
        <View className="flex flex-row justify-center gap-1 shrink-0">
          <IconButton onPress={toggleShuffle} Icon={ShuffleIcon} iconProps={{strokeWidth: isShuffle ? 2 : 1.4}} />
          <IconButton
            onPress={() => {
              toggleFavourite(file.category, file.id);
            }}
            Icon={StarIcon}
            iconProps={{
              fill: isFavourite ? "currentColor" : "#00000000",
            }}
          />
        </View>
        <View className="flex flex-row justify-center gap-1">
          <View className="relative">
            <IconButton
              Icon={GaugeIcon}
              onPress={() => setActiveMenu("playback")}
            />
            <VideoPlaybackMenu
              isOpen={activeMenu === "playback"}
              onClose={() => setActiveMenu(null)}
            />
          </View>
          <View className="relative">
            <IconButton
              Icon={ListVideoIcon}
              onPress={() => setActiveMenu("queue")}
            />
            <VideoQueueMenu
              isOpen={activeMenu === "queue"}
              onClose={() => setActiveMenu(null)}
            />
          </View>
        </View>
      </View>
      {/* mid row video control buttons */}
      <View className="flex flex-row justify-center items-center gap-12 sm:gap-16 md:gap-24">
        <IconButton
          onPress={goToPrev}
          Icon={SkipBackIcon}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-200"
          iconProps={{
            fill: "currentColor",
            className:
              "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 drop-shadow-md",
          }}
        />
        <IconButton
          onPress={() => setPlaying(!isPlaying)}
          Icon={isPlaying ? PauseIcon : PlayIcon}
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-gray-100"
          iconProps={{
            fill: "currentColor",
            className:
              "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-lg",
          }}
        />

        <IconButton
          onPress={goToNext}
          Icon={SkipForwardIcon}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-200"
          iconProps={{
            fill: "currentColor",
            className:
              "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 drop-shadow-md",
          }}
        />
      </View>
      {/* bottom row minimize button + progress bar with time and name of file*/}
      <View className="flex flex-col gap-2 justify-end">
        <View className="flex flex-row justify-between">
          <View className="flex flex-row justify-start gap-5">
            <TimeViewer />
            <AppText>{file.name}</AppText>
          </View>
          <View className="flex flex-row justify-end gap-2">
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
              <VideoVolumeMenu
                isOpen={activeMenu === "sound"}
                onClose={() => setActiveMenu(null)}
              />
            </View>
            <IconButton
              onPress={() => setExpanded(false)}
              Icon={MinimizeIcon}
            />
          </View>
        </View>
        <VideoProgressBar />
      </View>
    </View>
  );
}
