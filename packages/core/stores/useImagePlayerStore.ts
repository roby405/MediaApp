import { create } from "zustand";

interface ImagePlayerState {
  zoomLevel: number;
}


export const useImagePlayerStore = create<ImagePlayerState>((set) => ({
  zoomLevel: 100,
}));