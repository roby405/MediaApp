import { EXTENSIONS, MediaType, PlatformFile } from "../types/global";

export function determineFileType(file: PlatformFile): MediaType {
  const mime = file.mimeType?.toLowerCase() ?? "";
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf" || mime === "application/epub+zip")
    return "book";

  if (EXTENSIONS.image.has(extension)) return "image";
  if (EXTENSIONS.video.has(extension)) return "video";
  if (EXTENSIONS.audio.has(extension)) return "audio";
  if (EXTENSIONS.book.has(extension)) return "book";

  return "book";
}