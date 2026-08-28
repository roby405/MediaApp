import { useEffect, useRef } from "react";
import { useNavStore } from "../../../../../packages/core/stores/useNavStore";
import { useAudioPlayerStore } from "../../../../../packages/core/stores/useAudioPlayerStore";
import { getMediaUrl } from "../../utils/getMediaUrl";
import { useActiveMedia } from "../../../../../packages/core/hooks/useActiveMedia";

export function AudioEngine() {
  const isPlaying = useAudioPlayerStore((state) => state.isPlaying);
  const togglePlaying = useAudioPlayerStore((state) => state.togglePlaying);
  const volume = useAudioPlayerStore((state) => state.volume);
  const goToNext = useNavStore((state) => state.goToNextMedia);
  const goToPrev = useNavStore((state) => state.goToPreviousMedia);

  const {file} = useActiveMedia();
  const setCurrentTime = useAudioPlayerStore((state) => state.setCurrentTime);

  const audioRef = useRef<HTMLAudioElement>(null);
  const setAudioRef = useAudioPlayerStore((state) => state.setAudioRef);

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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev, togglePlaying]);

  // useEffect(() => {
  //   const media = useNavStore.getState().activeMedia;
  //   if (!media || media.category !== "audio") return;
  //   initializeAudio(media);
  // }, [file?.id, initializeAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = Math.max(0, Math.min(volume, 100) / 100);
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio
        .play()
        .catch((err) =>
          console.warn(`Can't auto play cause browser policy: ${err}`),
        );
    } else {
      audio.pause();
    }
  }, [isPlaying, file?.id]);

  useEffect(() => {
    const video = audioRef.current;
    if (video) setAudioRef(video);
    return () => {
      setAudioRef(null);
    };
  }, [setAudioRef, audioRef, file?.id]);

  if (file?.category !== "audio") return null;
  return (
    <audio
      ref={audioRef}
      preload="metadata"
      src={getMediaUrl(file.id)}
      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      onEnded={goToNext}
    />
  );
}
