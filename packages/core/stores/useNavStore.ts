import { create } from "zustand";
import type { ActiveMedia, Screen } from "../types/global";
import { shuffle } from "../utils/shuffleList";



interface NavState {
  activeScreen: Screen;
  deferred: boolean;
  originalQueue: string[];
  playQueue: string[];
  isShuffle: boolean;
  toggleShuffle: () => void;
  activeMedia: ActiveMedia | null;
  setActiveMedia: (media: ActiveMedia | null, queue?: string[]) => void;
  goToNextMedia: () => void;
  goToPreviousMedia: () => void;
  setScreen: (screen: Screen) => void;
  setDeferred: (value: boolean) => void;
}

export const useNavStore = create<NavState>((set, get) => ({
  activeScreen: "book",
  deferred: false,
  originalQueue: [],
  playQueue: [],
  activeMedia: null,
  isShuffle: false,
  toggleShuffle: () => {
    const isShuffle = !get().isShuffle;
    const {
      activeMedia,
      originalQueue
     } = get();
    if (!activeMedia)
      return;
    set({ isShuffle: isShuffle, playQueue: isShuffle ? [activeMedia.id, ...shuffle(originalQueue).filter((id) => activeMedia.id !== id)] : originalQueue});
  },
  setActiveMedia: (media, queue?) => {
    const isShuffle = get().isShuffle;
    if (!media) {
      set({ activeMedia: null })
      return;
    }
    if (queue) {
      set({ activeMedia: media, originalQueue: queue, playQueue: isShuffle ? [media.id, ...(shuffle(queue).filter((id) => id !== media.id))] : queue });
    }
    else set({ activeMedia: media });
  },
  goToNextMedia: () => {
    const { setActiveMedia, activeMedia, playQueue } = get();
    if (!activeMedia) return;
    const index = playQueue.findIndex((id) => id === activeMedia.id);
    if (index + 1 >= playQueue.length) return;
    const media = {
      id: playQueue[index + 1],
      category: activeMedia.category
    };
    setActiveMedia(media);
  },
  goToPreviousMedia: () => {
    const { setActiveMedia, activeMedia, playQueue } = get();
    if (!activeMedia) return;
    const index = playQueue.findIndex((id) => id === activeMedia.id);
    if (index <= 0) return;
    const media = {
      id: playQueue[index - 1],
      category: activeMedia.category
    };
    setActiveMedia(media);
  },
  setScreen: (screen: Screen) => set({ activeScreen: screen }),
  setDeferred: (value: boolean) => set({ deferred: value }),
}));
