import type { VideoMediaFile } from "../../db/schema";
import { formatSize } from "../../../../../packages/core/utils/formatSize";
import Card, { BasicCardProps } from "./Card";
import { formatLength } from "@media-app/core/utils/formatLength";

type VideoCardProps = BasicCardProps & {
  file: VideoMediaFile
}

function VideoCard({ file, viewMode, onPress }: VideoCardProps) {
  return (
    <Card file={file} viewMode={viewMode} onPress={onPress} type="video" title={file.name} bottomRow={formatLength(file.metadata.duration)} extra={formatSize(file.size)} />
  );
}

export default VideoCard;
