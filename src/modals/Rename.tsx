import { useRef, useState } from "react";
import { Modal, type BasicModalProps } from "./Modal";

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
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isPopup={false}>
      <div className="bg-gray-500 border-gray-400 border rounded-xl min-w-[40%] min-h-[30%] flex flex-col items-center justify-center gap-3 p-3">
        <span className="text-lg w-full">New Name:</span>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-400 px-1"
        />
        <div className="flex flex-row w-full px-8 gap-8">
          <button
            className="rounded-lg flex-1 border-gray-400 border"
            onClick={() => onRename(name)}
          >
            Confirm
          </button>
          <button
            className="rounded-lg flex-1 border-gray-400 border"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
