import { Extraction, MediaExtractor } from "@media-app/core/extractors/extractor";
import { EXTENSIONS, PlatformFile } from "@media-app/core/types/global";
import { createVideoPlayer, VideoPlayer } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import { File } from "expo-file-system/next";

export class MobileVideoExtractor implements MediaExtractor {
  private videoPlayer: VideoPlayer | null = null;
  private duration: number = 0;
  private onDurationReady: (() => void) | null = null;
  matches(file: PlatformFile) {
    return EXTENSIONS.video.has(
      file.name.split(".").pop()?.toLowerCase() || "",
    );
  }

  private getBackgroundVideoPlayer() {
    if (this.videoPlayer) return this.videoPlayer;
    this.videoPlayer = createVideoPlayer(null);
    this.videoPlayer.addListener("statusChange", ({status}) => {
      if (status === "readyToPlay") {
        this.duration = this.videoPlayer?.duration ?? 0;
        this.onDurationReady?.();
      } else if (status === "error") {
        this.duration = 0;
        this.onDurationReady?.();
      }
    });
    return this.videoPlayer;
  }

  private findDuration(): Promise<void> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.onDurationReady = null;
        console.error("Encountered timeout when trying to import Video duration")
        resolve();
      }, 30000);

      this.onDurationReady = () => {
        clearTimeout(timer);
        this.onDurationReady = null;
        resolve();
      }
    });
  }

  private async getVideoCover(uri: string) {
    try {
      const thumb = await VideoThumbnails.getThumbnailAsync(uri, {
        time: 1000,
        quality: 0.8
      }).catch(() => VideoThumbnails.getThumbnailAsync(uri, { time: 0, quality: 0.8}));
      const file = new File(thumb.uri);
      const data = file.bytes();
      if (file.exists) file.delete();

      return {
        cover: {
          data: data,
          mimeType: "image/jpeg",
        },
        width: thumb.width,
        height: thumb.height
      }

    } catch {
      return {cover: null};
    }
  }

  async extract(file: PlatformFile): Promise<Extraction> {
    const {cover, width, height} = await this.getVideoCover(file.path);
    const player = this.getBackgroundVideoPlayer();
    player.replace(file.path);
    await this.findDuration();
    player.replace(null);
    return {
      category: "video",
      metadata: {
        duration: this.duration,
        width,
        height
      },
      cover
    }
  }
}