import { useFilterStore } from "../../../../packages/core/stores/useFilterStore";
import { MB, type MediaType } from "../../../../packages/core/types/global";
import { Modal, type BasicModalProps } from "./Modal";
import type { FileSize } from "../../../../packages/core/types/filter";
import { useMediaStore } from "../../../../packages/core/stores/useMediaStore";
import { toDateInputValue } from "../../../../packages/core/utils/formatDate";
import { useState } from "react";
import {
  FilterParams,
  getExtensionCounts,
  getFileSizeCounts,
} from "@media-app/core/utils/filterFiles";
import { Pressable, Switch, Text, TextInput, View } from "react-native";

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
      <View className="absolute bg-gray-500 top-13 left-0 right-0 min-w-[80%] min-h-[30%] mx-5 rounded-xl border border-gray-400 flex flex-col">
        <View className="flex-1 flex flex-row">
          <View className="flex flex-col flex-1 h-full">
            <Text>Extensions</Text>
            <View className="flex flex-col overflow-y-auto">
              {Object.entries(extensionCount).map(([key, val]) => (
                <View className="flex flex-row" key={key}>
                  <Switch
                    value={draftFilter.selectedExtensions.includes(key)}
                    onValueChange={() => toggleExtension(key)}
                  />
                  <Text>{key}</Text>
                  <Text>{`(${val})`}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className="flx flex-col flex-1 h-full justify-between">
            <View className="flex flex-col">
              <Text>File Size </Text>
              <View className="flex flex-col">
                {Object.entries(fileSizeCount).map(([key, val]) => (
                  <View className="flex flex-row" key={key}>
                    <Switch
                      value={draftFilter.selectedFileSizes.includes(
                        key as FileSize,
                      )}
                      onValueChange={() => toggleFileSize(key as FileSize)}
                    />
                    <Text>{key}</Text>
                    <Text>{`(${val})`}</Text>
                  </View>
                ))}
              </View>
              <Text>Size Range</Text>
              <View className="flex gap-2 items-center">
                <TextInput
                  placeholder="Min MB"
                  keyboardType="decimal-pad"
                  value={
                    draftFilter.minFileSize === 0
                      ? ""
                      : String(draftFilter.minFileSize / MB)
                  }
                  onChangeText={(text) => {
                    const val = Number(text);
                    setMinFileSize(
                      text === "" ? 0 : Math.max(0, Number(val) * MB),
                    );
                  }}
                  className="w-full rounded border px-2 py-1 text-sm text-black bg-white"
                />
                <Text>-</Text>
                <TextInput
                  placeholder="Min MB"
                  keyboardType="decimal-pad"
                  value={
                    draftFilter.maxFileSize === Infinity
                      ? ""
                      : String(draftFilter.maxFileSize / MB)
                  }
                  onChangeText={(text) => {
                    const val = Number(text);
                    setMaxFileSize(
                      text === "" ? Infinity : Math.max(0, Number(val) * MB),
                    );
                  }}
                  className="w-full rounded border px-2 py-1 text-sm text-black bg-white"
                />
              </View>
            </View>
            <View className="flex flex-col gap-1">
              <Text className="text-xs font-semibold">Time Range</Text>
              <View className="flex gap-2 items-center">
                {/* <input
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
                <Text>-</Text>
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
                /> */}
              </View>
            </View>
          </View>
        </View>

        <View className="flex flex-row w-full">
          <Pressable
            className="rounded-xl border border-gray-400"
            onPress={() => {
              applyFilters(draftFilter);
              onClose();
            }}
          >
            Apply Filters
          </Pressable>
          <Pressable
            className="rounded-xl border border-gray-400"
            onPress={onClose}
          >
            Cancel
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
