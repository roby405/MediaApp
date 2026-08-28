import type { BookMediaFile } from "../../db/schema";
import { formatSize } from "../../../../../packages/core/utils/formatSize";
import Card, { BasicCardProps } from "./Card";

type BookCardProps = BasicCardProps & {
  file: BookMediaFile
}

function BookCard({ file, viewMode, onPress }: BookCardProps) {
  return (
    <Card file={file} viewMode={viewMode} onPress={onPress} type="book" title={file.metadata.title || file.name} bottomRow={file.metadata.author || ""} extra={formatSize(file.size)} />
  );
}

export default BookCard;
