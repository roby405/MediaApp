import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

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

export function Modal({ isOpen, onClose, isPopup, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key == "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return isPopup ? (
    <>
      <div
        className="fixed inset-0 z-40 bg-transparent pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      <div
        className="z-50 absolute inset-0 pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-auto">{children}</div>
      </div>
    </>
  ) : (
    createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <div
          className="relative max-w-lg w-full text-text"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>,
      document.body,
    )
  );
}
