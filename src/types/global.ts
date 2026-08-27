export type MediaType = 'book' | 'audio' | 'video' | 'image';
export interface ActiveMedia {
  id: string;
  category: MediaType;
}
export type Screen = 'audio' | 'book' | 'image' | 'video' | 'import';
export const MB = 1024 * 1024;