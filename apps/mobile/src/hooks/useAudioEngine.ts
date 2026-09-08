import { useActiveMedia } from "@media-app/core/hooks/useActiveMedia";
import { useAudioPlayerStore } from "@media-app/core/stores/useAudioPlayerStore";
import { useNavStore } from "@media-app/core/stores/useNavStore";
import { useEffect, useState } from "react";
import TrackPlayer, {
  Capability,
  Event,
  AppKilledPlaybackBehavior,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { getMediaUrl } from "src/utils/getMediaUrl";

export function useAudioEngine() {
  const [setupDone, setSetupDone] = useState<boolean>(false);

  const goToNext = useNavStore((state) => state.goToNextMedia);
  const goToPrev = useNavStore((state) => state.goToPreviousMedia);
  const setPlaying = useAudioPlayerStore((state) => state.setPlaying);
  const attachAdapter = useAudioPlayerStore((state) => state.attachAdapter);
  const { file } = useActiveMedia("audio");

  const url = file?.id ? getMediaUrl(file.id) : null;

  useEffect(() => {
    async function setup() {
      if (setupDone) return;
      try {
        await TrackPlayer.setupPlayer({ autoHandleInterruptions: true });
        await TrackPlayer.updateOptions({
          android: {
            appKilledPlaybackBehavior:
              AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
          },
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });
        attachAdapter({
          play: () => TrackPlayer.play(),
          pause: () => TrackPlayer.pause(),
          seek: (val: number) => TrackPlayer.seekTo(val),
          getCurrentTime: async () => {
            const progress = await TrackPlayer.getProgress();
            return progress.position;
          },
          setVolume: (val: number) => TrackPlayer.setVolume(val),
          setPlaybackSpeed: (val: number) => TrackPlayer.setRate(val),
        });
        setSetupDone(true);
      } catch (error) {
        setSetupDone(false);
      }
    }

    setup();
  }, []);

  useEffect(() => {
    if (!setupDone) return;
    async function loadTrack() {
      if (url && file) {
        await TrackPlayer.reset();
        TrackPlayer.add([
          {
            id: file.id,
            url: url,
            title: file.metadata.title ?? file.name,
            artist: file.metadata.artist ?? "Unknown",
            duration: file.metadata.duration,
          },
        ]);
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
        await TrackPlayer.reset();
      }
    }
    loadTrack();
  }, [TrackPlayer, url, setupDone]);

  useTrackPlayerEvents(
    [
      Event.RemotePlay,
      Event.RemoteNext,
      Event.RemotePrevious,
      Event.RemotePause,
      Event.PlaybackQueueEnded,
    ],
    (event) => {
      switch (event.type) {
        case Event.RemotePlay: {
          TrackPlayer.play();
          setPlaying(true);
          break;
        }
        case Event.RemotePause: {
          TrackPlayer.pause();
          setPlaying(false);
          break;
        }
        case Event.PlaybackQueueEnded:
        case Event.RemoteNext: {
          goToNext();
          break;
        }
        case Event.RemotePrevious: {
          goToPrev();
          break;
        }
      }
    },
  );
}
