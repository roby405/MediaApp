import { useEffect, useRef } from "react";
import { useVideoPlayer } from "expo-video";
import { useVideoPlayerStore } from "@media-app/core/stores/useVideoPlayerStore";
import { useNavStore } from "@media-app/core/stores/useNavStore";
import { useActiveMedia } from "@media-app/core/hooks/useActiveMedia";
import { getMediaUrl } from "src/utils/getMediaUrl";
import { Registry } from "@media-app/core/interfaces/Registry";

export function useVideoEngine() {
  const isPlaying = useVideoPlayerStore((state) => state.isPlaying);
  const setPlaying = useVideoPlayerStore((state) => state.setPlaying);
  const playbackSpeed = useVideoPlayerStore((state) => state.playbackSpeed);
  const volume = useVideoPlayerStore((state) => state.volume);
  const setExpanded = useVideoPlayerStore((state) => state.setExpanded);

  const setVideoRef = useVideoPlayerStore((state) => state.setVideoRef);
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
    if (!url || !player) return;
    player.replace(url);
    if (isPlaying) player.play();
  }, [player, url]);

  useEffect(() => {
    if (!player) return;

    player.volume = Math.max(0, Math.min(volume, 100) / 100);
  }, [volume, player]);

  useEffect(() => {
    if (!player) return;

    player.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    if (!player) return;

    if (isPlaying && !player.playing) {
      player.play();
    } else if (!isPlaying && player.playing) {
      player.pause();
    }
  }, [isPlaying, player, file?.id]);

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
    if (!player) {
      setVideoRef(null);
      return;
    }

    Registry.registerVideo({
      play: player.play,
      pause: player.pause,
      seek: (val: number) => {
        player.currentTime = val;
      },
      getCurrentTime: () => player.currentTime,
    });
    setVideoRef(player);

    return () => setVideoRef(null);
  }, [player, setVideoRef]);
}
