import { useVideoPlayerStore } from "../stores/useVideoPlayerStore";

import { motion } from "framer-motion";
import { MiniVideoControls } from "./video/MiniVideoControls";
import { ExpandedVideoControls } from "./video/ExpandedVideoControls";
import { VideoOutlet } from "./video/VideoOutlet";
import { startViewTransition } from "../utils/startViewTransition";
import { useNavStore } from "../../../../packages/core/stores/useNavStore";
export function MiniVideoPlayer() {
  const activeMedia = useNavStore((state) => state.activeMedia);
  const setExpanded = useVideoPlayerStore((state) => state.setExpanded);
  if (!activeMedia || activeMedia.category !== "video") return null;
  return (
    <div className="select-none w-full flex flex-row gap-2 justify-center">
      <div className="flex-1 aspect-video rounded-lg rounded-tr-3xl overflow-hidden">
        <VideoOutlet />
      </div>
      <MiniVideoControls
        startViewTransition={() => startViewTransition(() => setExpanded(true))}
      />
    </div>
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
    <div
      id="expanded-video-player"
      className="fixed inset-0 select-none w-screen h-screen flex justify-center items-center pointer-events-auto z-80 bg-black"
    >
      <VideoOutlet />


      <motion.div 
        className="absolute inset-0 z-10"
        onTap={pingTimer} 
        onPointerMove={handlePointerMove} 
      />

      {controlsVisible && <ExpandedVideoControls />}
    </div>
  );
}
