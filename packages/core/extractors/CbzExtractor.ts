import { PlatformFile } from "../types/global";
import { PlatformFileReader } from "../utils/PlatformFileReader";
import { Extraction, MediaExtractor } from "./extractor";
import { unzip } from "unzipit";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
});

export class CbzExtractor implements MediaExtractor {
  matches(file: PlatformFile) {
    return (file.name.split(".").pop()?.toLowerCase() || "") === "cbz";
  }

  async extract(file: PlatformFile): Promise<Extraction> {
    try {
      const { entries } = await unzip(new PlatformFileReader(file));

      const imageFormats = new Set([
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "svg",
        "avif",
        "bmp",
      ]);
      const images = Object.keys(entries).filter((val) => {
        const ext = val.split(".").pop()?.toLowerCase();
        return ext && imageFormats.has(ext);
      });

      const coverEntry = Object.values(entries).find((entry) => {
        const name = entry.name.toLowerCase();

        return (
          name.includes("001") &&
          (name.endsWith(".jpg") ||
            name.endsWith(".jpeg") ||
            name.endsWith(".png"))
        );
      });

      const ext = coverEntry?.name.split(".").pop()?.toLowerCase() || "";

      const mimeType = "image/" + ext === "jpg" ? "jpeg" : ext;

      const containerEntry = entries["ComicInfo.xml"];
      const containerXml = await containerEntry.text();

      const parsed = parser.parse(containerXml);
      const info = parsed.ComicInfo ?? {};

      const series = info.Series ? String(info.Series) : "";
      const number = info.Number ? String(info.Number) : "";
      const author = info.Writer ? String(info.Author) : "";
      const title = `${series} - ${number}`;

      return {
        category: "book",
        metadata: {
          title,
          author,
          pageCount: images.length,
          lastPageRead: 0,
        },
        cover: coverEntry
          ? {
              data: new Uint8Array(await coverEntry.arrayBuffer()),
              mimeType,
            }
          : null,
      };
    } catch (err) {
      console.error(`Couldn't extract metadata: ${err}`);
      return {
        category: "book",
        metadata: {},
        cover: null
      };
    }
  }
}
