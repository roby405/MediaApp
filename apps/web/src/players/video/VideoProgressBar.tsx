import { Slider } from "../../components/Slider";
import { useActiveMedia } from "../../../../../packages/core/hooks/useActiveMedia";
import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";
import { formatLength } from "../../../../../packages/core/utils/formatLength";

export function TimeViewer() {
  const currentTime = useVideoPlayerStore((state) => state.currentTime);
  const {file} = useActiveMedia("video");
  if (!file) return null;
  return <span>{`${formatLength(currentTime)}/${formatLength(file.metadata.duration)}`}</span>
}

export function VideoProgressBar() {
  const currentTime = useVideoPlayerStore((state) => state.currentTime);
  const {file} = useActiveMedia("video");
  const seek = useVideoPlayerStore((state) => state.seek);

  const handleSeek = (val: number) => {
    seek(val)
  };

  if (!file)
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
        handleSeek(e);
      }}
    />
  );
}