import { create } from "zustand";
import { createStreamMediaSlice, StreamMediaState } from "./slices/createStreamMediaSlice";

type AudioMenu = "sound" | "queue" | null;

interface AudioSpecificState {
  activeMenu: AudioMenu;
  isExtended: boolean;
  setExtended: (val: boolean) => void;
  setActiveMenu: (val: AudioMenu) => void;
}

type AudioPlayerState = StreamMediaState & AudioSpecificState;

export const useAudioPlayerStore = create<AudioPlayerState>((set, get) => ({
  ...createStreamMediaSlice(set, get),
  activeMenu: null,
  isExtended: false,
  setExtended: (val: boolean) => set({isExtended: val}),
  setActiveMenu: (val) => set({activeMenu: val}),
}));
