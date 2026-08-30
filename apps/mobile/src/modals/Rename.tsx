import { useRef, useState } from "react";
import { Modal, type BasicModalProps } from "./Modal";
import { Pressable, Text, TextInput, View } from "react-native";

interface RenameProps extends BasicModalProps {
  originalName: string;
  onRename: (name: string) => void;
}

export default function Rename({
  isOpen,
  onClose,
  originalName,
  onRename,
}: RenameProps) {
  const [name, setName] = useState<string>(originalName);
  const inputRef = useRef<TextInput>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isPopup={false}>
      <View className="bg-gray-500 border-gray-400 border rounded-xl min-w-[40%] min-h-[30%] flex flex-col items-center justify-center gap-3 p-3">
        <AppText className="text-lg w-full">New Name:</AppText>
        <TextInput
          ref={inputRef}
          value={name}
          onChangeText={setName}
          className="w-full border border-gray-400 px-1"
        />
        <View className="flex flex-row w-full px-8 gap-8">
          <Pressable
            className="rounded-lg flex-1 border-gray-400 border"
            onPress={() => onRename(name)}
          >
            Confirm
          </Pressable>
          <Pressable
            className="rounded-lg flex-1 border-gray-400 border"
            onPress={onClose}
          >
            Cancel
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
