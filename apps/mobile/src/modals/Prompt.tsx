import { Pressable, Text, View } from "react-native";
import { Modal, type BasicModalProps } from "./Modal";

export interface PromptProps extends BasicModalProps {
  onConfirm: () => void;
  promptMessage?: string;
  confirmMessage?: string;
  rejectMessage?: string;
}

export default function Prompt({
  isOpen,
  onClose,
  onConfirm,
  promptMessage = "",
  confirmMessage = "Confirm",
  rejectMessage = "Cancel",
}: PromptProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isPopup={false}>
      <Pressable
        className="bg-gray-500 border-gray-400 border flex flex-col rounded-xl p-2 gap-2 pointer-events-auto min-w-[40%] min-h-[30%] text-text"
        onPress={(e) => e.stopPropagation()}
      >
        <Text className="text-lg">
          {promptMessage}
        </Text>
        <View className="flex flex-row px-10 gap-8">
          <Pressable className="flex-1 items-center border-gray-400 border rounded-lg px-3 py-1" onPress={onConfirm}>
            {confirmMessage}
          </Pressable>
          <Pressable className="flex-1 items-center border-gray-400 border rounded-lg" onPress={onClose}>
            {rejectMessage}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
