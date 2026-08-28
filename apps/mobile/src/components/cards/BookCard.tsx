/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import type { BookMediaFile } from "../../db/schema";
import { formatDate } from "../../../../../packages/core/utils/formatDate";
import { formatSize } from "../../../../../packages/core/utils/formatSize";
import { MediaMenuButton } from "../buttons/MediaMenuButton";
import { Pressable } from "react-native";
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
