import { PencilIcon, Trash2Icon } from "lucide-react";
import { Modal, type BasicModalProps } from "./Modal";
import type { MediaFile } from "../db/schema";
import { useState } from "react";
import { deleteFile, renameFile } from "../db/operations";
import Rename from "./Rename";
import DeleteFile from "./prompts/DeleteFile";

interface MediaMenuProps extends BasicModalProps {
  file: MediaFile;
}

export default function MediaMenu({ isOpen, onClose, file }: MediaMenuProps) {
  const [renameModalOpen, setRenameModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const handleRename = (name: string) => {
    renameFile(file.id, `${name}.${file.extension}`).then(
      () => {
        console.log("succeeded");
      },
      () => {
        console.log("failed");
      },
    );
    setRenameModalOpen(false);
    onClose();
  };

  const handleDelete = () => {
    deleteFile(file.id).then(
      () => {
        console.log("succeeded");
      },
      () => {
        console.log("failed");
      },
    );
    setDeleteModalOpen(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isPopup={true}>
      <div
        className="absolute right-13 top-3 bg-gray-700 border-gray-400 border flex flex-col rounded-xl p-2 gap-2 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="flex flex-row gap-2 items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            // onClose();
            setRenameModalOpen(true);
          }}
        >
          <PencilIcon className="w-5 h-5" strokeWidth={1.7} />
          <span className="text-lg">Rename File</span>
        </button>
        {renameModalOpen && (
          <Rename
            isOpen={renameModalOpen}
            onClose={() => setRenameModalOpen(false)}
            originalName={file.name.split(".").slice(0, -1).join(".")}
            onRename={handleRename}
          />
        )}
        <div className="h-px bg-gray-400/50"> </div>
        <button
          className="flex flex-row gap-2 text-red-500 items-center justify-start"
          onClick={(e) => {
            e.stopPropagation();
            // onClose();
            setDeleteModalOpen(true);
          }}
        >
          <Trash2Icon className="w-5 h-5" strokeWidth={1.7} />
          <span className="text-lg">Delete File</span>
        </button>

        {deleteModalOpen && (
          <DeleteFile
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDelete}
            file={file}
          />
        )}
      </div>
    </Modal>
  );
}
