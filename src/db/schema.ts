import type { DBSchema } from "idb";
import type { MediaType } from "../types/global";
import type { AudioMetadata, BookMetadata, ImageMetadata, VideoMetadata } from "../types/db";

export interface BaseMediaFile {
  id: string; // sha256
  name: string;
  extension: string;
  path: string;
  size: number;
  created_at: number; //unix time
  cover: Blob | null;
  last_opened_at: number;
  is_favourite: number;
}

export type AudioMediaFile = BaseMediaFile & {
  category: "audio";
  metadata: AudioMetadata;
};

export type VideoMediaFile = BaseMediaFile & {
  category: "video";
  metadata: VideoMetadata;
};

export type ImageMediaFile = BaseMediaFile & {
  category: "image";
  metadata: ImageMetadata;
};

export type BookMediaFile = BaseMediaFile & {
  category: "book";
  metadata: BookMetadata;
};

export type MediaFile =
  | AudioMediaFile
  | VideoMediaFile
  | ImageMediaFile
  | BookMediaFile;

export interface AppDB extends DBSchema {
  files: {
    key: string;
    value: MediaFile;
    indexes: {
      by_category: MediaType;
      by_created_at: number;
      by_size: number;
      by_extension: string;
      by_category_and_created_at: [MediaType, number];
    };
  };
}
