/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import type { AudioMediaFile } from "../../db/schema";
import { formatLength } from "@media-app/core/utils/formatLength";
import { MediaMenuButton } from "../buttons/MediaMenuButton";
import { Image, Pressable, View } from "react-native";
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
