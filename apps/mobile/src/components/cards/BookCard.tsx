
import { BookMediaFile } from "@media-app/core/types/db";
import Card, { BasicCardProps } from "./Card";
import { formatSize } from "@media-app/core/utils/formatSize";

type BookCardProps = BasicCardProps & {
  file: BookMediaFile
}

function BookCard({ file, viewMode, onPress }: BookCardProps) {
  return (
    <Card file={file} viewMode={viewMode} onPress={onPress} type="book" title={file.metadata.title || file.name} bottomRow={file.metadata.author || ""} extra={formatSize(file.size)} />
  );
}

export default BookCard;
