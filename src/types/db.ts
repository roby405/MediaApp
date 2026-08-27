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
