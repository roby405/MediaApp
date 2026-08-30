import { Registry } from "@media-app/core/interfaces/Registry";
import { useAudioPlayerStore } from "@media-app/core/stores/useAudioPlayerStore";
import { useNavStore } from "@media-app/core/stores/useNavStore";
import { useEffect, useRef } from "react";
import TrackPlayer, {
  Capability,
  Event,
  AppKilledPlaybackBehavior,
  useTrackPlayerEvents,
} from "react-native-track-player";

export function useAudioEngine() {
  const setupDone = useRef<boolean>(false);

  const goToNext = useNavStore((state) => state.goToNextMedia);
  const goToPrev = useNavStore((state) => state.goToPreviousMedia);
  const setPlaying = useAudioPlayerStore((state) => state.setPlaying);

  useEffect(() => {
    async function setup() {
      if (setupDone.current) return;
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
        setupDone.current = true;
        Registry.registerAudio({
          play: () => TrackPlayer.play(),
          pause: () => TrackPlayer.pause(),
          seek: (val: number) => TrackPlayer.seekTo(val),
          getCurrentTime: async () => {
            const progress = await TrackPlayer.getProgress();
            return progress.position;
          },
        });
      } catch (error) {
        setupDone.current = true;
      }
    }

    setup();
  }, []);

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
