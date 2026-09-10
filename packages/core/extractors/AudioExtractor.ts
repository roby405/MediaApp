import { parseBuffer } from "music-metadata";
import { Extraction, MediaExtractor } from "./extractor";
import { PlatformFile } from "../types/global";

export class AudioExtractor implements MediaExtractor {
  matches(file: PlatformFile) {
    return ["mp3", "wav", "ogg", "flac", "aac", "m4a", "opus", "wma"].includes(
      file.name.split(".").pop()?.toLowerCase() || "",
    );
  }

  async extract(file: PlatformFile): Promise<Extraction> {
    const buffer = await file.readBytes();
    const metadata = await parseBuffer(buffer, { mimeType: file.mimeType ?? undefined, path: file.name });
    const { common, format } = metadata;

    return {
      category: "audio",
      metadata: {
        duration: format.duration || 0,
        title: common.title || file.name.replace(/\.[^/.]+$/, ""),
        artist: common.artist,
        album: common.album,
        albumArtist: common.albumartist,
        trackNumber: common.track?.no ?? undefined,
        diskNumber: common.disk?.no ?? undefined,
        year: common.year,
        genre: common.genre,
        isLossless: format.lossless ?? false,
        bitrate: format.bitrate,
        sampleRate: format.sampleRate,
      },
      cover: common.picture
        ? {
            data: common.picture?.[0].data,
            mimeType: common.picture?.[0].format,
          }
        : null,
    };
  }
}

