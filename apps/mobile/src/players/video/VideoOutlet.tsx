import { View } from "react-native";
import { VideoView } from "expo-video";
import { useVideoPlayerStore } from "@media-app/core/stores/useVideoPlayerStore";

export function VideoOutlet() {
  const player = useVideoPlayerStore((state) => state.playerInstance);

  if (!player) return <View className="bg-black w-full h-full" />;

  return (
    <View className="w-full h-full overflow-hidden">
      <VideoView
        player={player}
        style={{width: "100%", height: "100%"}}
        nativeControls={false}
        contentFit="contain"
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  );
}
