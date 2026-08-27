import type { ComponentType } from "react";
import ImageScreen from "./ImageScreen";
import VideoScreen from "./VideoScreen";
import BookScreen from "./BookScreen";
import ImportScreen from "./ImportScreen";
import AudioScreen from "./AudioScreen";
import type { Screen } from "../../../../packages/core/types/global";

export const SCREEN_MAP: Record<Screen, ComponentType> = {
    image: ImageScreen,
    video: VideoScreen,
    book: BookScreen,
    import: ImportScreen,
    audio: AudioScreen,
}