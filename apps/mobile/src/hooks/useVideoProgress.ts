import { useVideoPlayerStore } from "@media-app/core/stores/useVideoPlayerStore";
import { useEffect, useState } from "react";

export function useVideoProgress() {
  const player = useVideoPlayerStore((state) => state.playerInstance);
  const [currentTime, setCurrentTime] = useState<number>(player?.currentTime ?? 0);

  useEffect(() => {
    if (!player) {
      setCurrentTime(0);
      return;
    }

    setCurrentTime(player.currentTime);

    const listener = player.addListener("timeUpdate", ({ currentTime: time }: { currentTime: number }) => {
      setCurrentTime(time);
    });

    return () => listener.remove();
  }, [player])
  return currentTime;
}