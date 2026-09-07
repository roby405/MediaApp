import { create } from "zustand";
import { MediaController } from "../interfaces/MediaController";
import { createStreamMediaSlice, StreamMediaState } from "./slices/createStreamMediaSlice";

// const controlsTimer = new Timer();

interface VideoSpecificState {

  isExpanded: boolean;
  controlsVisible: boolean;
  activeMenu: VideoMenuType;

  setActiveMenu: (val: VideoMenuType) => void;
  setControlsVisible: (val: boolean) => void;
  setExpanded: (val: boolean) => void;
  setPlaying: (val: boolean) => void;
  pingActivity: () => void;
  clearActivityTimer: () => void;
}

export type VideoMenuType = "queue" | "playback" | "sound" | null;


type VideoPlayerState = StreamMediaState & VideoSpecificState;

export const useVideoPlayerStore = create<VideoPlayerState>((set, get) => ({
  ...createStreamMediaSlice(set, get),
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

  pingActivity: () => {
    set({ controlsVisible: true });

    // The SmartTimer handles clearing its previous instance automatically
    // controlsTimer.run(5000, () => {
    //   const state = get();
    //   if (state.isPlaying && state.isExpanded && !state.activeMenu) {
    //     set({ controlsVisible: false });
    //   }
    // });
  },

  clearActivityTimer: () => {
    // controlsTimer.clear();
  },
}));
