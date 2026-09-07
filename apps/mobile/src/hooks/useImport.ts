import { Registry } from "@media-app/core/interfaces/Registry";
import { BookMetadata, ImageMetadata, VideoMetadata, AudioMetadata } from "@media-app/core/types/db";
import { PlatformFile } from "@media-app/core/types/global";
import { useEffect } from "react";

export function useImport() {
  useEffect(() => {
    Registry.registerImport({
      extractEpubCover: function (file: PlatformFile): Promise<string | null> {
        throw new Error("Function not implemented.");
      },
      extractPdfCover: function (file: PlatformFile): Promise<string | null> {
        throw new Error("Function not implemented.");
      },
      extractCbzCover: function (file: PlatformFile): Promise<string | null> {
        throw new Error("Function not implemented.");
      },
      extractImageCover: function (file: PlatformFile): Promise<string | null> {
        throw new Error("Function not implemented.");
      },
      extractVideoCover: function (file: PlatformFile): Promise<string | null> {
        throw new Error("Function not implemented.");
      },
      extractAudioCover: function (file: PlatformFile): Promise<string | null> {
        throw new Error("Function not implemented.");
      },
      extractEpubMetadata: function (file: PlatformFile): Promise<BookMetadata> {
        throw new Error("Function not implemented.");
      },
      extractPdfMetadata: function (file: PlatformFile): Promise<BookMetadata> {
        throw new Error("Function not implemented.");
      },
      extractCbzMetadata: function (file: PlatformFile): Promise<BookMetadata> {
        throw new Error("Function not implemented.");
      },
      extractImageMetadata: function (file: PlatformFile): Promise<ImageMetadata> {
        throw new Error("Function not implemented.");
      },
      extractVideoMetadata: function (file: PlatformFile): Promise<VideoMetadata> {
        throw new Error("Function not implemented.");
      },
      extractAudioMetadata: function (file: PlatformFile): Promise<AudioMetadata> {
        throw new Error("Function not implemented.");
      }
    })
  }, []);
}