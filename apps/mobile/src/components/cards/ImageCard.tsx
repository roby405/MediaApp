import { formatDate } from "../../../../../packages/core/utils/formatDate";
import { formatSize } from "../../../../../packages/core/utils/formatSize";
import Card, { BasicCardProps } from "./Card";
import { ImageMediaFile } from "../../db/schema";

type ImageCardProps = BasicCardProps & {
  file: ImageMediaFile
}

function ImageCard({ file, viewMode, onPress }: ImageCardProps) {
  return (
    <Card file={file} viewMode={viewMode} onPress={onPress} type="image" title={file.name} bottomRow={formatSize(file.size)} extra={formatDate(file.created_at)} />
  );
}

export default ImageCard;
