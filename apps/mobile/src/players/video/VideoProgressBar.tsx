import { useActiveMedia } from "@media-app/core/hooks/useActiveMedia";
import { Slider } from "../../components/Slider";
import { Text } from "react-native";
import { useVideoProgress } from "src/hooks/useVideoProgress";
import { formatLength } from "@media-app/core/utils/formatLength";
import { useVideoPlayerStore } from "@media-app/core/stores/useVideoPlayerStore";

export function TimeViewer() {
  const currentTime = useVideoProgress();
  const {file} = useActiveMedia("video");
  if (!file) return null;
  return <Text>{`${formatLength(currentTime)}/${formatLength(file.metadata.duration)}`}</Text>
}

export function VideoProgressBar() {
  const currentTime = useVideoProgress();
  const {file} = useActiveMedia("video");
  const seek = useVideoPlayerStore((state) => state.videoRef?.seek);

  if (!file || !seek)
    return null;

  return (
    <Slider
      orientation="h"
      min={0}
      max={file.metadata.duration || 0}
      step={0.1}
      value={currentTime}
      className="w-full"
      onChange={(e) => {
        seek(e);
      }}
    />
  );
}