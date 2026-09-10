import { PlatformFile } from "../types/global";
import { Extraction, MediaExtractor } from "./extractor";
import { PlatformFileReader, unzip } from "../utils/PlatformFileReader";
import { XMLParser } from "fast-xml-parser";
import { BookMetadata } from "../types/db";

const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
});

export class EpubExtractor implements MediaExtractor {
  matches(file: PlatformFile) {
    return (file.name.split(".").pop()?.toLowerCase() || "") === "epub";
  }

  async extract(file: PlatformFile): Promise<Extraction> {
    try {
      const { entries } = await unzip(new PlatformFileReader(file));

      const coverEntry = Object.values(entries).find((entry) => {
        const name = entry.name.toLowerCase();

        return (
          name.includes("cover") &&
          (name.endsWith(".jpg") ||
            name.endsWith(".jpeg") ||
            name.endsWith(".png"))
        );
      });

      const ext = coverEntry?.name.split(".").pop()?.toLowerCase() || "";

      const mimeType = "image/" + ext === "jpg" ? "jpeg" : ext;

      const containerEntry = entries["META-INF/container.xml"];
      const containerXml = await containerEntry.text();
      const parsed = parser.parse(containerXml);
      const rootfilePath = parsed.container.rootfiles.rootfile["@_full-path"];

      if (!rootfilePath) throw new Error("no opf file found");
      const opfEntry = entries[rootfilePath];

      const opfXml = await opfEntry.text();
      const opf = parser.parse(opfXml);
      const metadata = opf.package.metadata;

      if (!metadata) throw new Error("no metadata");
      const title = metadata.title?.textContent?.trim() ?? file.name;
      const author = metadata.creator?.textContent?.trim() ?? "";
      const publisher = metadata.publisher?.textContent?.trim() ?? "";
      const language = metadata.language?.textContent?.trim() ?? "";

      // const chapters = await getEpubChapters(file); // will need for word and character count later on
      // if (!chapters)
      //   throw new Error("couldn't extract chapters from epub");
      // const pageCount = chapters.chapterList.length;

      const res: BookMetadata = {
        title,
        author,
        publisher,
        language,
        // pageCount,
        lastPageRead: 0,
      };
      return {
        category: "book",
        metadata: res,
        cover: coverEntry
          ? {
              data: new Uint8Array(await coverEntry.arrayBuffer()),
              mimeType,
            }
          : null,
      };
    } catch (error) {
      console.error(`Could not extract epub chapters ${file.name}: ${error}`);
      return {
        category: "book",
        metadata: {},
        cover: null,
      };
    }
  }
}
