import { useEffect, type ReactNode } from "react";
import { BackHandler, Pressable, View, Modal as RNModal } from "react-native";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPopup: boolean;
  children: ReactNode;
}

export interface BasicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Modal({
  isOpen,
  onClose,
  isPopup = false,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onBackPress = () => {
      onClose();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => backHandler.remove();
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return isPopup ? (
    <>
      <Pressable
        className="fixed inset-0 z-40 bg-transparent pointer-events-auto"
        onPress={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      <Pressable
        className="z-50 absolute inset-0 pointer-events-none"
        onPress={(e) => e.stopPropagation()}
      >
        <View className="pointer-events-auto">{children}</View>
      </Pressable>
    </>
  ) : (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        onPress={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <Pressable
          className="relative max-w-lg w-full text-text"
          onPress={(e) => e.stopPropagation()}
        >
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
