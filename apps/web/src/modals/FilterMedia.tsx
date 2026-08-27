import { useFilterStore, type FilterParams } from "../../../../packages/core/stores/useFilterStore";
import { MB, type MediaType } from "../../../../packages/core/types/global";
import { Modal, type BasicModalProps } from "./Modal";
import type { FileSize } from "../../../../packages/core/types/filter";
import { useMediaStore } from "../../../../packages/core/stores/useMediaStore";
import { toDateInputValue } from "../../../../packages/core/utils/formatDate";
import { useState } from "react";

interface FilterProps extends BasicModalProps {
  category: MediaType;
}

export default function FilterMedia({
  isOpen,
  onClose,
  category,
}: FilterProps) {
  const mediaFiles = useMediaStore((state) => state.mediaFiles[category]);
  const filterParams = useFilterStore((state) => state.filterParams);
  const applyFilters = useFilterStore((state) => state.applyFilters);
  const [draftFilter, setDraftFilter] = useState<FilterParams>(filterParams);

  const getExtensionCounts = useFilterStore(
    (state) => state.getExtensionCounts,
  );
  const getFileSizeCounts = useFilterStore((state) => state.getFileSizeCounts);

  const extensionCount = getExtensionCounts(mediaFiles, draftFilter);
  const fileSizeCount = getFileSizeCounts(mediaFiles, draftFilter);

  const toggleExtension = (ext: string) => {
    setDraftFilter((prev) => ({
      ...prev,
      selectedExtensions: prev.selectedExtensions.includes(ext)
        ? prev.selectedExtensions.filter((e) => e !== ext)
        : [...prev.selectedExtensions, ext],
    }));
  };

  const toggleFileSize = (fileSize: FileSize) => {
    setDraftFilter((prev) => ({
      ...prev,
      selectedFileSizes: prev.selectedFileSizes.includes(fileSize)
        ? prev.selectedFileSizes.filter((s) => s !== fileSize)
        : [...prev.selectedFileSizes, fileSize],
    }));
  };

  const setMinFileSize = (size: number) => {
    setDraftFilter((prev) => ({ ...prev, minFileSize: size }));
  };

  const setMaxFileSize = (size: number) => {
    setDraftFilter((prev) => ({ ...prev, maxFileSize: size }));
  };

  const setMinCreationDate = (date: number) => {
    setDraftFilter((prev) => ({ ...prev, minCreationDate: date }));
  };

  const setMaxCreationDate = (date: number) => {
    setDraftFilter((prev) => ({ ...prev, maxCreationDate: date }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isPopup={true}>
      <div className="absolute bg-gray-500 top-13 left-0 right-0 min-w-[80%] min-h-[30%] mx-5 rounded-xl border border-gray-400 flex flex-col">
        <div className="flex-1 flex flex-row">
          <div className="flex flex-col flex-1 h-full">
            <span>Extensions</span>
            <div className="flex flex-col overflow-y-auto">
              {Object.entries(extensionCount).map(([key, val]) => (
                <div className="flex flex-row" key={key}>
                  <input
                    type="checkbox"
                    checked={draftFilter.selectedExtensions.includes(key)}
                    onChange={() => toggleExtension(key)}
                  />
                  <span>{key}</span>
                  <span>{`(${val})`}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flx flex-col flex-1 h-full justify-between">
            <div className="flex flex-col">
              <span>File Size </span>
              <div className="flex flex-col">
                {Object.entries(fileSizeCount).map(([key, val]) => (
                  <div className="flex flex-row" key={key}>
                    <input
                      type="checkbox"
                      checked={draftFilter.selectedFileSizes.includes(key as FileSize)}
                      onChange={() => toggleFileSize(key as FileSize)}
                    />
                    <span>{key}</span>
                    <span>{`(${val})`}</span>
                  </div>
                ))}
              </div>
              <span>Size Range</span>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  placeholder="Min MB"
                  value={draftFilter.minFileSize === 0 ? "" : draftFilter.minFileSize / MB}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMinFileSize(
                      val === "" ? 0 : Math.max(0, Number(val) * MB),
                    );
                  }}
                  className="w-full rounded border px-2 py-1 text-sm text-black bg-white"
                />
                <span>-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max MB"
                  value={draftFilter.maxFileSize === Infinity ? "" : draftFilter.maxFileSize / MB}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMaxFileSize(
                      val === "" ? Infinity : Math.max(0, Number(val) * MB),
                    );
                  }}
                  className="w-full rounded border px-2 py-1 text-sm text-black bg-white"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold">Time Range</span>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={toDateInputValue(draftFilter.minCreationDate)}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Start of selected day (00:00:00 local time)
                    setMinCreationDate(
                      val ? new Date(`${val}T00:00:00`).getTime() : 0,
                    );
                  }}
                  className="w-full rounded border px-2 py-1 text-sm text-black bg-white"
                />
                <span>-</span>
                <input
                  type="date"
                  value={toDateInputValue(draftFilter.maxCreationDate)}
                  onChange={(e) => {
                    const val = e.target.value;
                    // End of selected day (23:59:59 local time)
                    setMaxCreationDate(
                      val
                        ? new Date(`${val}T23:59:59.999`).getTime()
                        : Infinity,
                    );
                  }}
                  className="w-full rounded border px-2 py-1 text-sm text-black bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row w-full">
          <button
            className="rounded-xl border border-gray-400"
            onClick={() => {applyFilters(draftFilter); onClose();}}
          >
            Apply Filters
          </button>
          <button
            className="rounded-xl border border-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
