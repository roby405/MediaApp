import { create } from "zustand";

import type { MediaType } from "../types/global";
import {
  AudioMediaFile,
  BookMediaFile,
  ImageMediaFile,
  MediaFile,
  VideoMediaFile,
} from "../types/db";
import { buildIndex } from "../utils/buildIndex";
import { Registry } from "../interfaces/Registry";
import { dbEventBus } from "../buses/DBEventBus";

interface MediaState {
  mediaFiles: {
    audio: AudioMediaFile[];
    video: VideoMediaFile[];
    image: ImageMediaFile[];
    book: BookMediaFile[];
  };
  byId: Record<string, MediaFile>;
  isLoading: boolean;
  loadFiles: (category: MediaType) => Promise<void>;
  loadAll: () => void;
  toggleFavourite: (category: MediaType, id: string) => void;
}

export const useMediaStore = create<MediaState>((set, get) => {
  dbEventBus.subscribe((event) => {
    switch (event.type) {
      case "file-delete": {
        const byId = get().byId;
        const category = byId[event.id].category;
        set((state) => {
          const { [event.id]: _, ...newById } = state.byId;
          return {
            mediaFiles: {
              ...state.mediaFiles,
              [category]: state.mediaFiles[category].filter(
                (file) => file.id !== event.id,
              ),
            },
            byId: newById,
          };
        });
        break;
      }
      case "file-rename": {
        const byId = get().byId;
        const category = byId[event.id].category;
        const file = byId[event.id];
        const newFile = {
          ...file,
          name: event.newName,
        };
        set((state) => {
          const { [event.id]: newFile, ...newById } = state.byId;
          return {
            mediaFiles: {
              ...state.mediaFiles,
              [category]: state.mediaFiles[category].map((file) =>
                file.id === event.id ? newFile : file,
              ),
            },
            byId: newById,
          };
        });
        break;
      }
      case "file-save": {
        const category = event.file.category;
        set((state) => {
          return {
            mediaFiles: {
              ...state.mediaFiles,
              [category]: [...state.mediaFiles[category], event.file],
            },
            byId: {
              ...state.byId,
              [event.file.id]: event.file,
            },
          };
        });
        break;
      }
      case "file-update": {
        const category = event.file.category;
        set((state) => {
          return {
            mediaFiles: {
              ...state.mediaFiles,
              [category]: state.mediaFiles[category].map((file) => file.id === event.file.id ? event.file : file )
            },
            byId: {
              ...state.byId,
              [event.file.id]: event.file,
            },
          };
        });
        break;
      }
    }
  });

  return {
    mediaFiles: {
      book: [],
      audio: [],
      video: [],
      image: [],
    },
    byId: {},
    isLoading: false,
    loadFiles: async (category) => {
      set({ isLoading: true });
      const db = Registry.db;
      const files = await db.getFilesByCategory(category);
      set((state) => {
        const newIndex = buildIndex(files, (f: MediaFile) => f.id);
        return {
          isLoading: false,
          mediaFiles: {
            ...state.mediaFiles,
            [category]: files,
          },
          byId: { ...state.byId, ...newIndex },
        };
      });
    },
    loadAll: async () => {
      set({ isLoading: true });
      const db = Registry.db;
      const [books, audio, videos, images] = await Promise.all([
        db.getFilesByCategory("book"),
        db.getFilesByCategory("audio"),
        db.getFilesByCategory("video"),
        db.getFilesByCategory("image"),
      ]);

      const allFiles = [...books, ...audio, ...videos, ...images];

      set({
        isLoading: false,
        mediaFiles: {
          book: books,
          audio: audio,
          video: videos,
          image: images,
        },
        byId: buildIndex(allFiles, (f: MediaFile) => f.id),
      });
    },

    toggleFavourite: async (category, id) => {
      const byId = get().byId;

      const target = byId[id];
      if (!target) return;

      const favValue = target.is_favourite === 1 ? 0 : 1;

      set((state) => ({
        ...state,
        mediaFiles: {
          ...state.mediaFiles,
          [category]: state.mediaFiles[category].map((f) =>
            f.id === id ? { ...f, is_favourite: favValue } : f,
          ),
        },
        byId: {
          ...state.byId,
          [id]: {
            ...state.byId[id],
            is_favourite: favValue,
          },
        },
      }));
      const db = Registry.db;
      await db
        .updateFile({
          ...target,
          is_favourite: favValue,
        })
        .catch((err) => console.error(`Couldn't toggle favourite: ${err}`));
    },
  };
});
