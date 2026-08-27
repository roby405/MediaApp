import { create } from "zustand";

type AudioMenu = "sound" | "queue" | null;

interface AudioPlayerState {
  currentTime: number;
  volume: number;
  playbackSpeed: number;
  isPlaying: boolean;
  activeMenu: AudioMenu;
  isExtended: boolean;
  audioRef: HTMLAudioElement | null;
  onSeek: (val: number) => void;
  setAudioRef: (val: HTMLAudioElement | null) => void;
  setExtended: (val: boolean) => void;
  setActiveMenu: (val: AudioMenu) => void;
  setVolume: (val: number) => void;
  togglePlaying: () => void;
  setPlaybackSpeed: (val: number) => void;
  setCurrentTime: (time: number) => void;
}

export const useAudioPlayerStore = create<AudioPlayerState>((set, get) => ({
  currentTime: 0,
  volume: 80,
  playbackSpeed: 1,
  isPlaying: true,
  activeMenu: null,
  isExtended: false,
  setExtended: (val: boolean) => set({isExtended: val}),
  audioRef: null,
  setAudioRef: (val) => set({audioRef: val}),
  onSeek: (val: number) => {
    const {audioRef, setCurrentTime} = get();
    const audio = audioRef;
    if (!audio) return;

    audio.currentTime = val;
    setCurrentTime(val);
  },
  setActiveMenu: (val) => set({activeMenu: val}),
  setVolume: (val) => set({ volume: val }),
  togglePlaying: () => set({ isPlaying: !get().isPlaying }),
  setPlaybackSpeed: (val) => set({ playbackSpeed: val }),
  setCurrentTime: (time) => set({ currentTime: time }),
}));
