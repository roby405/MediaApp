import type { MediaFile } from "../../db/schema";
import type { PromptProps } from "../Prompt";
import Prompt from "../Prompt";

type DeleteFileProps = PromptProps & { file: MediaFile };

export default function DeleteFile({
  isOpen,
  onClose,
  onConfirm,
  file,
}: DeleteFileProps) {
  return (
    <Prompt
      onConfirm={onConfirm}
      promptMessage={`Are you sure you want to delete <b>${file.name}</b>? This operation is not reversable.`}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
