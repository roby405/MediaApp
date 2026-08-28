import { create } from "zustand";
import { MediaController } from "../interfaces/MediaController";

type AudioMenu = "sound" | "queue" | null;

type AudioController = MediaController;

interface AudioPlayerState {
  volume: number;
  playbackSpeed: number;
  isPlaying: boolean;
  activeMenu: AudioMenu;
  isExtended: boolean;
  audioRef: AudioController | null;
  setAudioRef: (val: AudioController | null) => void;
  setExtended: (val: boolean) => void;
  setActiveMenu: (val: AudioMenu) => void;
  setVolume: (val: number) => void;
  setPlaying: (val: boolean) => void;
  setPlaybackSpeed: (val: number) => void;
}

export const useAudioPlayerStore = create<AudioPlayerState>((set, get) => ({
  volume: 80,
  playbackSpeed: 1,
  isPlaying: true,
  activeMenu: null,
  isExtended: false,
  audioRef: null,
  setPlaying: (val) => set({isPlaying: val}),
  setExtended: (val: boolean) => set({isExtended: val}),
  setAudioRef: (val) => set({audioRef: val}),
  setActiveMenu: (val) => set({activeMenu: val}),
  setVolume: (val) => set({ volume: val }),
  setPlaybackSpeed: (val) => set({ playbackSpeed: val }),
}));
