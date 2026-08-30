import { View } from "react-native";
import { VideoView } from "expo-video";
import { useVideoPlayerStore } from "@media-app/core/stores/useVideoPlayerStore";

export function VideoOutlet() {
  const player = useVideoPlayerStore((state) => state.videoRef);

  if (!player) return <View className="bg-black w-full h-full" />;

  return (
    <View className="w-full h-full rounded-[inherit] overflow-hidden">
      <VideoView
        player={player}
        className="w-full h-full"
        nativeControls={false}
        contentFit="contain"
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  );
}
