import { useLayoutEffect, useRef } from "react";
import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";

export function VideoOutlet() {
  const playerInstance = useVideoPlayerStore((state) => state.playerInstance);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (playerInstance && containerRef.current) {
      containerRef.current.appendChild(playerInstance);
    }

    return () => {
      const videoEngine = document.getElementById("video-engine");
      if (!videoEngine) {
        console.error("Video engine doesn't exist")
        return;
      }
      if (!playerInstance) {
        console.error("Video no longer exists for whatever reason");
        return;
      }
      videoEngine.appendChild(playerInstance);
    }

  }, [playerInstance])

  return (
    <div ref={containerRef} className="w-full h-full rounded-[inherit] overflow-hidden" />
  )
}