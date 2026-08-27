import { create } from 'zustand'
import { useNavStore } from './useNavStore';
import type { MediaType } from '../types/global';

export type ViewMode = "grid" | "line";

interface ScreenViewState {
    viewModes: Record<MediaType, ViewMode>;
    showInfo: boolean;
    setViewMode: (viewMode: "grid" | "line") => void;
}

export const useScreenViewStore = create<ScreenViewState>((set) => ({
    viewModes: {
        "book": "line",
        "audio": "line",
        "video": "grid",
        "image": "grid"
    },
    showInfo: true,
    setViewMode: (viewMode) => {
        const activeCategory = useNavStore.getState().activeScreen as MediaType;
        set((state) => ({viewModes: {
            ...state.viewModes,
            [activeCategory]: viewMode,
        }}));
    },
}));