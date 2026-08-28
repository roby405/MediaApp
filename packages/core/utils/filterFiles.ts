import type { MediaFile } from "../../../apps/web/src/db/schema";
import type { FileSize } from "../types/filter";

export interface FilterParams {
  selectedExtensions: string[];
  selectedFileSizes: FileSize[];
  minFileSize: number;
  maxFileSize: number;
  minCreationDate: number;
  maxCreationDate: number;
}

const MB = 1024 * 1024;

export const sizeFilter: Record<FileSize, (size: number) => boolean> = {
  "<1": (size) => size < 1 * MB,
  "1-5": (size) => size >= 1 * MB && size < 5 * MB,
  "5-25": (size) => size >= 5 * MB && size < 25 * MB,
  "25-100": (size) => size >= 25 * MB && size < 100 * MB,
  "100-500": (size) => size >= 100 * MB && size < 500 * MB,
  ">500": (size) => size >= 500 * MB,
};

export const defaultFilters: FilterParams = {
  selectedExtensions: [],
  selectedFileSizes: [],
  minFileSize: 0,
  maxFileSize: Infinity,
  minCreationDate: 0,
  maxCreationDate: Infinity,
};

export function hasMatchingExtension(
  file: MediaFile,
  selectedExtensions: Set<string>,
): boolean {
  if (selectedExtensions.size === 0) return true;
  return selectedExtensions.has(file.extension);
}

export function hasMatchingFileSize(
  file: MediaFile,
  selectedFileSizes: FileSize[],
  minSize: number,
  maxSize: number,
): boolean {
  if (selectedFileSizes.length === 0) {
    if (minSize === 0 && maxSize === Infinity) return true;
    if (minSize <= file.size && maxSize >= file.size) return true;
    return false;
  }
  if (!(minSize <= file.size && maxSize >= file.size)) return false;
  for (const fileSize of selectedFileSizes) {
    if (sizeFilter[fileSize](file.size)) return true;
  }
  return false;
}

export function hasMatchingDate(
  file: MediaFile,
  minCreated: number,
  maxCreated: number,
): boolean {
  if (minCreated === 0 && maxCreated === Infinity) return true;
  if (minCreated > maxCreated) return false;

  if (minCreated <= file.created_at && maxCreated >= file.created_at)
    return true;
  return false;
}

export function filterFiles<T extends readonly MediaFile[]>(
  files: T,
  filters: FilterParams,
  query: string,
) {
  const extSet = new Set(filters.selectedExtensions);

  const isMatching = (file: MediaFile) => {
    return (
      hasMatchingExtension(file, extSet) &&
      hasMatchingFileSize(
        file,
        filters.selectedFileSizes,
        filters.minFileSize,
        filters.maxFileSize,
      ) &&
      hasMatchingDate(file, filters.minCreationDate, filters.maxCreationDate)
    );
  };

  const hasQuery = (file: MediaFile) => file.name.includes(query);

  return files.filter(isMatching).filter(hasQuery);
}




export function getExtensionCounts(files: MediaFile[], filters: FilterParams) {

    const isMatching = (file: MediaFile) => {
      return (
        hasMatchingFileSize(
          file,
          filters.selectedFileSizes,
          filters.minFileSize,
          filters.maxFileSize,
        ) && hasMatchingDate(file, filters.minCreationDate, filters.maxCreationDate)
      );
    };

    return files
      .filter(isMatching)
      .reduce<Record<string, number>>((acc, file) => {
        acc[file.extension] = (acc[file.extension] || 0) + 1;
        return acc;
      }, {});
  }

export function getFileSizeCounts(files: MediaFile[], filters: FilterParams) {
    const extSet = new Set(filters.selectedExtensions);

    const isMatching = (file: MediaFile) => {
      return (
        hasMatchingExtension(file, extSet) &&
        hasMatchingDate(file, filters.minCreationDate, filters.maxCreationDate)
      );
    };

    const filesMatched = files.filter(isMatching);
    const res: Record<FileSize, number> = {
      "<1": 0,
      "1-5": 0,
      "5-25": 0,
      "25-100": 0,
      "100-500": 0,
      ">500": 0,
    };
    for (const file of filesMatched) {
      Object.entries(sizeFilter).forEach(([keySize, func]) => {
        const key = keySize as FileSize;
        if (func(file.size)) res[key] += 1;
      });
    }

    return res;
  }
