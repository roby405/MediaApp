import type { AudioMediaFile, BookMediaFile, ImageMediaFile, MediaFile, VideoMediaFile } from "../db/schema";
import { useMediaStore } from "../stores/useMediaStore";
import { useNavStore } from "../stores/useNavStore";
import type { MediaType } from "../types/global";



export function useActiveMedia(): { file: MediaFile | null; index: number };
export function useActiveMedia(category: "audio"): { file: AudioMediaFile | null; index: number };
export function useActiveMedia(category: "video"): { file: VideoMediaFile | null; index: number };
export function useActiveMedia(category: "book"): { file: BookMediaFile | null; index: number };
export function useActiveMedia(category: "image"): { file: ImageMediaFile | null; index: number };

export function useActiveMedia(category?: MediaType) {
  const activeMedia = useNavStore((state) => state.activeMedia);
  const file = useMediaStore((state) =>
    activeMedia ? state.byId[activeMedia.id] : null,
  );

  const index = useNavStore((state) => activeMedia ? state.playQueue.findIndex((v) => v === activeMedia.id) : -1);

  if (!file) return {file: null, index: -1};
  if (category && file.category !== category) return {file: null, index: -1};
  return {
    file,
    index
  };
}
