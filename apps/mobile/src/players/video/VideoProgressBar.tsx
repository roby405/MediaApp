import { useActiveMedia } from "@media-app/core/hooks/useActiveMedia";
import { Slider } from "../../components/Slider";
import { Text } from "react-native";
import { useVideoProgress } from "src/hooks/useVideoProgress";
import { formatLength } from "@media-app/core/utils/formatLength";
import { useVideoPlayerStore } from "@media-app/core/stores/useVideoPlayerStore";
import { AppText } from "src/components/AppText";
import { Registry } from "@media-app/core/interfaces/Registry";

export function TimeViewer() {
  const currentTime = useVideoProgress();
  const {file} = useActiveMedia("video");
  if (!file) return null;
  return <AppText>{`${formatLength(currentTime)}/${formatLength(file.metadata.duration)}`}</AppText>
}

export function VideoProgressBar() {
  const currentTime = useVideoProgress();
  const {file} = useActiveMedia("video");
  const seek = Registry.video.seek;

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