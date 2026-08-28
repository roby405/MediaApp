import type { AudioMediaFile } from "../../db/schema";
import { formatLength } from "@media-app/core/utils/formatLength";
import Card, { BasicCardProps } from "./Card";

type AudioCardProps = BasicCardProps & {
  file: AudioMediaFile
}

function AudioCard({ file, viewMode, onPress }: AudioCardProps) {
  return (
    <Card file={file} viewMode={viewMode} onPress={onPress} type={"audio"} title={file.metadata.title || file.name} bottomRow={file.metadata.artist || ""} extra={formatLength(file.metadata.duration)} />
  );
}

export default AudioCard;
