import { useLayoutEffect, useRef } from "react";
import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";

export function VideoOutlet() {
  const videoRef = useVideoPlayerStore((state) => state.videoRef);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (videoRef && containerRef.current) {
      containerRef.current.appendChild(videoRef);
    }

    return () => {
      const videoEngine = document.getElementById("video-engine");
      if (!videoEngine) {
        console.error("Video engine doesn't exist")
        return;
      }
      if (!videoRef) {
        console.error("Video no longer exists for whatever reason");
        return;
      }
      videoEngine.appendChild(videoRef);
    }

  }, [videoRef])

  return (
    <div ref={containerRef} className="w-full h-full rounded-[inherit] overflow-hidden" />
  )
}