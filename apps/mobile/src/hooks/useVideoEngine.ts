import { useEffect, useRef } from "react";
import { useVideoPlayer } from "expo-video";
import { useVideoPlayerStore } from "@media-app/core/stores/useVideoPlayerStore";
import { useNavStore } from "@media-app/core/stores/useNavStore";
import { useActiveMedia } from "@media-app/core/hooks/useActiveMedia";
import { getMediaUrl } from "src/utils/getMediaUrl";

export function useVideoEngine() {
  const isPlaying = useVideoPlayerStore((state) => state.isPlaying);
  const setPlaying = useVideoPlayerStore((state) => state.setPlaying);
  const playbackSpeed = useVideoPlayerStore((state) => state.playbackSpeed);
  const volume = useVideoPlayerStore((state) => state.volume);
  const setExpanded = useVideoPlayerStore((state) => state.setExpanded);
  const attachAdapter = useVideoPlayerStore((state) => state.attachAdapter);
  const setplayerInstance = useVideoPlayerStore((state) => state.setplayerInstance);

  const goToNext = useNavStore((state) => state.goToNextMedia);
  const goToPrev = useNavStore((state) => state.goToPreviousMedia);

  const { file } = useActiveMedia();

  const url = file?.category === "video" ? getMediaUrl(file.id) : null;

  const player = useVideoPlayer(url, (pl) => {
    pl.loop = false;
    pl.playbackRate = playbackSpeed;
    pl.volume = Math.max(0, Math.min(volume, 100) / 100);
    if (isPlaying) pl.play();
  });

  useEffect(() => {
    if (!player) return;
    if (url) {
      player.replace(url);
      if (isPlaying) player.play();
    } else {
      player.replace(null);
      player.pause();
      setPlaying(false);
    }
  }, [player, url]);

  useEffect(() => {
    if (!player) return;

    const playingChange = player.addListener(
      "playingChange",
      ({ isPlaying }) => {
        setPlaying(isPlaying);
      },
    );

    const playToEnd = player.addListener("playToEnd", () => {
      goToNext();
    });

    return () => {
      playingChange.remove();
      playToEnd.remove();
    };
  }, [setPlaying, goToNext, player]);

  useEffect(() => {
    if (!player) return;
    attachAdapter({
      play: () => player.play(),
      pause: () => player.pause(),
      seek: (val: number) => {
        player.currentTime = val;
      },
      getCurrentTime: () => player.currentTime,
      setVolume: (val: number) => {
        player.volume = Math.max(0, Math.min(val, 100) / 100);
      },
      setPlaybackSpeed: (val: number) => {
        player.playbackRate = val;
      },
    });
    setplayerInstance(player);

    return () => {
      attachAdapter(null);
      setplayerInstance(null);
    };
  }, [player, attachAdapter, setplayerInstance]);
}
