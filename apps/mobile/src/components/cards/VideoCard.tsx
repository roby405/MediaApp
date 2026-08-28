/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import type { VideoMediaFile } from "../../db/schema";
import { formatDate } from "../../../../../packages/core/utils/formatDate";
import { formatSize } from "../../../../../packages/core/utils/formatSize";
import { MediaMenuButton } from "../buttons/MediaMenuButton";
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
