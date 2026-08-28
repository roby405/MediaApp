import { MediaType } from "@media-app/core/types/global";
import AudioCard from "./AudioCard";
import BookCard from "./BookCard";
import VideoCard from "./VideoCard";
import ImageCard from "./ImageCard";
import { ElementType } from "react";

export const CardRegistry: Record<MediaType, ElementType> = {
  "audio": AudioCard,
  "book": BookCard,
  "video": VideoCard,
  "image": ImageCard
}