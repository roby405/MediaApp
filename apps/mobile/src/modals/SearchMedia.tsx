import { useRef } from "react";
import { Modal, type BasicModalProps } from "./Modal";
import type { MediaType } from "../../../../packages/core/types/global";
import { useFilterStore } from "../../../../packages/core/stores/useFilterStore";
import { Text, TextInput, View } from "react-native";

interface SearchProps extends BasicModalProps {
  category: MediaType;
  // onSearch: (name: string) => void;
}

export default function SearchMedia({
  isOpen,
  onClose,
  category,
}: SearchProps) {
  const name = useFilterStore((state) => state.searchQuery);
  const setName = useFilterStore((state) => state.setSearchQuery);
  const inputRef = useRef<TextInput>(null);
  // const mediaFiles = useMediaStore((state) => state.mediaFiles[category]);
  // const setMediaFiles = useMediaStore((state) => state.setFiles);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isPopup={true}>
      <View className="bg-gray-500 border-gray-400 border rounded-xl min-w-[90%] min-h-[15%] flex flex-col items-center justify-center gap-3 p-3 top-13 absolute left-0 right-0 mx-8">
        <Text className="text-lg w-full">Search for a file:</Text>
        <TextInput
          ref={inputRef}
          value={name}
          onChangeText={setName
            // setMediaFiles(
            //   category,
            //   mediaFiles.filter((file) =>
            //     file.name.toLowerCase().includes(e.target.value.toLowerCase()),
            //   ),
            // );
          }
          className="w-full border border-gray-400 px-1"
        />
      </View>
    </Modal>
  );
}
