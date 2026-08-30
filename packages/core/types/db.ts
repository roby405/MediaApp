export interface AudioMetadata {
  duration: number;
  title?: string;
  artist?: string;
  album?: string;
  albumArtist?: string;
  trackNumber?: number;
  diskNumber?: number;
  year?: number;
  genre?: string[];
  isLossless?: boolean;
  bitrate?: number;
  sampleRate?: number;
}

export interface VideoMetadata {
  duration: number;
  width?: number;
  height?: number;
}

export interface ImageMetadata {
  width?: number;
  height?: number;
}

export interface BookMetadata {
  title?: string;
  author?: string;
  pageCount?: number;
  publisher?: string;
  language?: string;
  lastPageRead?: number;
}

export type Metadata =
  | ImageMetadata
  | VideoMetadata
  | BookMetadata
  | AudioMetadata;


  
export interface BaseMediaFile {
  id: string; // sha256
  name: string;
  extension: string;
  path: string;
  size: number;
  created_at: number; //unix time
  cover: string | null;
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