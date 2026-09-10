import type { ComponentType } from "react";

import ImportScreen from "./ImportScreen";
import type { MediaType, Screen } from "@media-app/core/types/global";

export function isMediaScreen(screen: Screen): screen is MediaType {
  return ["audio", "video", "image", "book"].includes(screen);
}

export const SCREEN_MAP: Record<Exclude<Screen, MediaType>, ComponentType> = {
    import: ImportScreen
}

export function getResponsiveColumns(type: MediaType, width: number): number {
  if (width >= 1024) {
    switch (type) {
      case "video": return 3;
      case "audio": return 4;
      case "book": return 4;
      case "image": return 5;
    }
  }

  if (width >= 768) {
    switch (type) {
      case "video": return 2;
      case "audio": return 3;
      case "book": return 3;
      case "image": return 4;
    }
  }

  if (width >= 600) {
    switch (type) {
      case "video": return 2;
      case "audio": return 2;
      case "book": return 3;
      case "image": return 4;
    }
  }
  switch (type) {
    case "video": return 1;
    case "audio": return 2;
    case "book": return 2;
    case "image": return 3;
  }
}