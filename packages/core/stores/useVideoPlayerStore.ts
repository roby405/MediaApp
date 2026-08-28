import { create } from "zustand";
import { Timer } from "../../../apps/mobile/src/utils/Timer";
import { MediaController } from "../interfaces/MediaController";

const controlsTimer = new Timer();

interface VideoController extends MediaController {
  // nothing you can do about it
  videoEngine: any
}

interface VideoPlayerState {
  volume: number;
  playbackSpeed: number;
  isPlaying: boolean;
  videoRef: VideoController | null;
  isExpanded: boolean;
  controlsVisible: boolean;
  activeMenu: VideoMenuType;
  setActiveMenu: (val: VideoMenuType) => void;
  setControlsVisible: (val: boolean) => void;
  setExpanded: (val: boolean) => void;
  setVideoRef: (videoRef: VideoController) => void;
  setVolume: (val: number) => void;
  setPlaying: (val: boolean) => void;
  setPlaybackSpeed: (val: number) => void;
  pingActivity: () => void;
  clearActivityTimer: () => void;
}

export type VideoMenuType = "queue" | "playback" | "sound" | null;

export const useVideoPlayerStore = create<VideoPlayerState>((set, get) => ({
  volume: 80,
  playbackSpeed: 1,
  isPlaying: true,
  videoRef: null,
  isExpanded: false,
  controlsVisible: true,
  activeMenu: null,
  setActiveMenu: (val: VideoMenuType) => set({ activeMenu: val }),
  setControlsVisible: (val: boolean) => set({ controlsVisible: val }),
  setExpanded: (val: boolean) => {
    if (val) {
      get().pingActivity();
    } else {
      get().clearActivityTimer();
    }
    set({ isExpanded: val });
  },
  setVideoRef: (videoRef) => set({ videoRef }),
  setVolume: (val) => set({ volume: val }),
  setPlaying: (val) => set({ isPlaying: val }),
  setPlaybackSpeed: (val) => set({ playbackSpeed: val }),
  videoData: null,
  // seek: (time: number) => {
  //   const video = get().videoRef;
  //   if (!video) return;
  //   video.currentTime = time;
  //   set({ currentTime: time });
  // },

  pingActivity: () => {
    set({ controlsVisible: true });

    // The SmartTimer handles clearing its previous instance automatically
    controlsTimer.run(5000, () => {
      const state = get();
      if (state.isPlaying && state.isExpanded && !state.activeMenu) {
        set({ controlsVisible: false });
      }
    });
  },

  clearActivityTimer: () => {
    controlsTimer.clear();
  },
}));
