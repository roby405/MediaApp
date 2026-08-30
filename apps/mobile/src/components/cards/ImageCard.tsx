import Card, { BasicCardProps } from "./Card";
import { formatSize } from "@media-app/core/utils/formatSize";
import { formatDate } from "@media-app/core/utils/formatDate";
import { ImageMediaFile } from "@media-app/core/types/db";

type ImageCardProps = BasicCardProps & {
  file: ImageMediaFile
}

function ImageCard({ file, viewMode, onPress }: ImageCardProps) {
  return (
    <Card file={file} viewMode={viewMode} onPress={onPress} type="image" title={file.name} bottomRow={formatSize(file.size)} extra={formatDate(file.created_at)} />
  );
}

export default ImageCard;
