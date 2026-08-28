
import { MiniVideoControls } from "./video/MiniVideoControls";
import { ExpandedVideoControls } from "./video/ExpandedVideoControls";
import { VideoOutlet } from "./video/VideoOutlet";
import { useNavStore } from "../../../../packages/core/stores/useNavStore";
import { Pressable, View } from "react-native";
import { useVideoPlayerStore } from "@media-app/core/stores/useVideoPlayerStore";
export function MiniVideoPlayer() {
  const activeMedia = useNavStore((state) => state.activeMedia);
  const setExpanded = useVideoPlayerStore((state) => state.setExpanded);
  if (!activeMedia || activeMedia.category !== "video") return null;
  return (
    <View className="select-none w-full flex flex-row gap-2 justify-center">
      <View className="flex-1 aspect-video rounded-lg rounded-tr-3xl overflow-hidden">
        <VideoOutlet />
      </View>
      <MiniVideoControls
        startViewTransition={() => setExpanded(true)}
      />
    </View>
  );
}

let lastPing = 0;
export function ExpandedVideoPlayer() {
  const activeMedia = useNavStore((state) => state.activeMedia);
  const pingTimer = useVideoPlayerStore((state) => state.pingActivity);
  const controlsVisible = useVideoPlayerStore((state) => state.controlsVisible);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e) {
      const now = Date.now();
      if (now - lastPing > 100) {
        pingTimer();
        lastPing = now;
      }
    }
  };

  if (!activeMedia)
    return null;

  return (
    <View
      id="expanded-video-player"
      className="fixed inset-0 select-none w-screen h-screen flex justify-center items-center pointer-events-auto z-80 bg-black"
    >
      <VideoOutlet />


      <Pressable
        className="absolute inset-0 z-10"
        onPress={pingTimer}
      />

      {controlsVisible && <ExpandedVideoControls />}
    </View>
  );
}
