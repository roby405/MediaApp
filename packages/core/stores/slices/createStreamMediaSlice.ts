import { MediaController } from "@media-app/core/interfaces/MediaController";

export interface StreamMediaState {
  volume: number;
  playbackSpeed: number;
  isPlaying: boolean;
  adapter: MediaController | null;
  play: () => void;
  pause: () => void;
  seek: (val: number) => void;
  getCurrentTime: () => number | Promise<number>;
  setVolume: (val: number) => void;
  setPlaybackSpeed: (val: number) => void;
  attachAdapter: (adapter: MediaController | null) => void;
  setPlaying: (val: boolean) => void;
}

export const createStreamMediaSlice = (
  set: (partial: Partial<StreamMediaState>) => void,
  get: () => StreamMediaState,
) => ({
  volume: 80,
  playbackSpeed: 1,
  isPlaying: false,
  adapter: null,
  attachAdapter: (val: MediaController | null) => set({adapter: val}),
  play: () => get().adapter?.play(),
  pause: () => get().adapter?.pause(),
  seek: (val: number) => get().adapter?.seek(val),
  getCurrentTime: () => get().adapter?.getCurrentTime() ?? 0,
  setVolume: (val: number) => {
    set({ volume: val });
    get().adapter?.setVolume(val);
  },
  setPlaying: (val: boolean) => set({ isPlaying: val }),
  setPlaybackSpeed: (val: number) => {
    set({ playbackSpeed: val });
    get().adapter?.setPlaybackSpeed(val);
  },
});
