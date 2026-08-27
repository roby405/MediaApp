import { useEffect, useRef } from "react";
import { useNavStore } from "../../stores/useNavStore";
import { useVideoPlayerStore } from "../../stores/useVideoPlayerStore";
import { startViewTransition } from "../../utils/startViewTransition";
import { getMediaUrl } from "../../utils/getMediaUrl";
import { useActiveMedia } from "../../hooks/useActiveMedia";

export function VideoEngine() {
  // const currentTime = useVideoPlayerStore((state) => state.currentTime);
  const isPlaying = useVideoPlayerStore((state) => state.isPlaying);
  const togglePlaying = useVideoPlayerStore((state) => state.togglePlaying);
  const playbackSpeed = useVideoPlayerStore((state) => state.playbackSpeed);
  const volume = useVideoPlayerStore((state) => state.volume);
  const setExpanded = useVideoPlayerStore((state) => state.setExpanded);

  const setCurrentTime = useVideoPlayerStore((state) => state.setCurrentTime);
  const setVideoRef = useVideoPlayerStore((state) => state.setVideoRef);
  const goToNext = useNavStore((state) => state.goToNextMedia);
  const goToPrev = useNavStore((state) => state.goToPreviousMedia);

  const {file} = useActiveMedia();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;
      switch (e.code) {
        case "Space":
        case "MediaPlayPause":
        case "MediaPlay":
        case "MediaPause": {
          e.preventDefault();
          togglePlaying();
          break;
        }

        case "MediaTrackNext": {
          e.preventDefault();
          goToNext();
          break;
        }

        case "MediaTrackPrevious": {
          e.preventDefault();
          goToPrev();
          break;
        }

        case "Escape": {
          if (!(useVideoPlayerStore.getState().isExpanded))
            break;
          e.preventDefault();
          startViewTransition(() => setExpanded(false))
          break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev, togglePlaying, setExpanded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = Math.max(0, Math.min(volume, 100) / 100);
  }, [volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackSpeed;
  }, [playbackSpeed])

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video
        .play()
        .catch((err) =>
          console.warn(`Can't auto play cause browser policy: ${err}`),
        );
    } else {
      video.pause();
    }
  }, [isPlaying, file?.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) setVideoRef(video);
    return () => {
      setVideoRef(null);
    };
  }, [setVideoRef, videoRef, file?.id]);

  if (!file) return null;

  return (
    <div className="hidden" id="video-engine">
      <video
        ref={videoRef}
        className="w-full h-full [view-transition-name:video-engine]"
        autoPlay
        src={getMediaUrl(file.id)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={goToNext}
        preload="metadata"
      />
    </div>
  );
}
