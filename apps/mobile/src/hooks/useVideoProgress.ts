import { useVideoPlayerStore } from "@media-app/core/stores/useVideoPlayerStore";
import { useEffect, useState } from "react";

export function useVideoProgress() {
  const player = useVideoPlayerStore((state) => state.videoRef?.videoEngine);
  const [currentTime, setCurrentTime] = useState<number>(player?.currentTime ?? 0);

  useEffect(() => {
    if (!player) {
      setCurrentTime(0);
      return;
    }

    setCurrentTime(player.currentTime);

    player.addListener("timeUpdate", ({ currentTime: time }: { currentTime: number }) => {
      setCurrentTime(time);
    });
  }, [player, currentTime])
  return currentTime;
}