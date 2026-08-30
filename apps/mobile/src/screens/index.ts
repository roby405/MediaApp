import type { ComponentType } from "react";

import ImportScreen from "./ImportScreen";
import type { MediaType, Screen } from "@media-app/core/types/global";

export function isMediaScreen(screen: Screen): screen is MediaType {
  return ["audio", "video", "image", "book"].includes(screen);
}

export const SCREEN_MAP: Record<Exclude<Screen, MediaType>, ComponentType> = {
    import: ImportScreen
}

export const GRID_LAYOUT_MAP: Record<MediaType, string> = {
  "image": "grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  "audio": "grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  "video": "grid-cols-1 gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3",
  "book": "grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
}