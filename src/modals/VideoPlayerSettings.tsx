import { Slider } from "../components/Slider";
import { useMediaStore } from "../stores/useMediaStore";
import { useNavStore } from "../stores/useNavStore";
import { useVideoPlayerStore } from "../stores/useVideoPlayerStore";
import { formatLength } from "../utils/formatLength";
import { formatPlaybackSpeed } from "../utils/formatPlaybackSpeed";
import { Modal, type BasicModalProps } from "./Modal";

export function VideoVolumeMenu({ isOpen, onClose }: BasicModalProps) {
  const volume = useVideoPlayerStore((state) => state.volume);
  const setVolume = useVideoPlayerStore((state) => state.setVolume);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isPopup={true}>
      <div
        className="absolute flex left-1/2 -translate-x-1/2 bg-black/50 border border-white bottom-full mb-2 h-36 lg:h-42 rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Slider
          orientation="v"
          length={"40"}
          min={0}
          max={100}
          step={0.5}
          value={volume}
          className="py-2"
          onChange={(val) => {
            setVolume(val);
          }}
        />
      </div>
    </Modal>
  );
}

export function VideoPlaybackMenu({ isOpen, onClose }: BasicModalProps) {
  const playback = useVideoPlayerStore((state) => state.playbackSpeed);
  const setPlayback = useVideoPlayerStore((state) => state.setPlaybackSpeed);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isPopup={true}>
      <div className="bg-black/50 border border-white top-full mt-10 w-40 h-20 left-1/2 -translate-x-1/2 rounded-xl rounded-tr-3xl flex-col flex items-center justify-center">
        <span className="text-2xl">{formatPlaybackSpeed(playback)}</span>
        <Slider
          orientation="h"
          length={"40"}
          min={0.25}
          max={4}
          step={0.05}
          value={playback}
          className="px-4"
          onChange={(val) => {
            setPlayback(val);
          }}
        />
      </div>
    </Modal>
  );
}

export function VideoQueueMenu({ isOpen, onClose }: BasicModalProps) {
  const activeMedia = useNavStore((state) => state.activeMedia);
  const setActiveMedia = useNavStore((state) => state.setActiveMedia);
  const queue = useNavStore((state) => state.playQueue);
  const byId = useMediaStore((state) => state.byId);
  if (!activeMedia) return null;
  const index = queue.findIndex((id) => id === activeMedia.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isPopup={true}>
      <div className="absolute bg-black/50 border border-white top-full mt-2 w-100 right-2 rounded-xl rounded-tr-3xl flex-col flex px-2">
        <div className="flex flex-row justify-between px-2">
          <span className="text-xl text-left">Play Queue</span>
          <span className="text-lg text-right">{`${index + 1}/${queue.length}`}</span>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 max-h-100 no-scrollbar space-y-2">
          {queue.map((id) => {
            const video = byId[id];
            if (!video || video.category !== "video") return null;
            // watch out for memory leak from urls
            return (
              <div
                key={id}
                className="select-none flex flex-row w-full h-30 border border-white rounded-xl overflow-hidden gap-3"
                onClick={() => setActiveMedia(video)}
              >
                <div className="rounded-lg relative pointer-events-none">
                  {video?.cover ? (
                    <img
                      src={`/db/cover/${id}`}
                      className="h-full aspect-square object-cover"
                    />
                  ) : (
                    <div className="h-full aspect-video bg-red" />
                  )}
                  <div className="right-0.5 bottom-1.5 absolute w-fit px-1.5 py-0.5 bg-black/60 rounded-xl">
                    <span>{formatLength(video.metadata.duration)}</span>
                  </div>
                </div>
                <div className="flex flex-col text-text min-w-0">
                  <span className="text-lg truncate">{video?.name}</span>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
