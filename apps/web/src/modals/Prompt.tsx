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
      <div
        className="bg-gray-500 border-gray-400 border flex flex-col rounded-xl p-2 gap-2 pointer-events-auto min-w-[40%] min-h-[30%] text-text"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-lg">
          {promptMessage}
        </span>
        <div className="flex flex-row px-10 gap-8">
          <button className="flex-1 items-center border-gray-400 border rounded-lg px-3 py-1" onClick={onConfirm}>
            {confirmMessage}
          </button>
          <button className="flex-1 items-center border-gray-400 border rounded-lg" onClick={onClose}>
            {rejectMessage}
          </button>
        </div>
      </div>
    </Modal>
  );
}
