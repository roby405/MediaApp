import { create } from 'zustand'

export type Theme = 'light' | 'dark';
export type Font = 'default';

interface ThemeState {
    theme: Theme;
    fontSize: number;
    font: Font;
    setTheme: (theme: Theme) => void;
    increaseFontSize: () => void;
    decreaseFontSize: () => void;
    setFontSize: (size: number) => void;
    setFont: (font: Font) => void;
    resetSettings: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: 'dark',
    fontSize: 16,
    font: 'default',
    
    setTheme: (newTheme) => set({ theme: newTheme }),

    increaseFontSize: () => set((state) => ({ fontSize: state.fontSize + 1 })),
    decreaseFontSize: () => set((state) => ({ fontSize: Math.max(state.fontSize - 1, 8) })),
    setFontSize: (size) => set({ fontSize: Math.max(8, size) }),
    
    setFont: (font) => set({font: font}),

    resetSettings: () => set({theme: 'dark', fontSize: 16, font: 'default'}),
}));