import type { DBSchema } from "idb";
import type { MediaFile } from "@media-app/core/types/db";
import type { MediaType } from "@media-app/core/types/global";

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
