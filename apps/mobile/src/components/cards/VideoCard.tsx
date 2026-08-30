
import { VideoMediaFile } from "@media-app/core/types/db";
import Card, { BasicCardProps } from "./Card";
import { formatLength } from "@media-app/core/utils/formatLength";
import { formatSize } from "@media-app/core/utils/formatSize";

type VideoCardProps = BasicCardProps & {
  file: VideoMediaFile
}

function VideoCard({ file, viewMode, onPress }: VideoCardProps) {
  return (
    <Card file={file} viewMode={viewMode} onPress={onPress} type="video" title={file.name} bottomRow={formatLength(file.metadata.duration)} extra={formatSize(file.size)} />
  );
}

export default VideoCard;
