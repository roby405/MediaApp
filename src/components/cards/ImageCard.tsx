/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import type { MediaFile } from "../../db/schema";
import { formatDate } from "../../utils/formatDate";
import { formatSize } from "../../utils/formatSize";
import { MediaMenuButton } from "../buttons/MediaMenuButton";

interface ImageCardProps {
  file: MediaFile;
  viewMode: "grid" | "line";
  onClick?: () => void;
}

function ImageCard({ file, viewMode, onClick }: ImageCardProps) {
  const cover = file.cover;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!cover) {
      setImageUrl(null);
      return;
    }

    const url = "/db/cover/" + file.id;
    setImageUrl(url);
  }, [cover, file.id]);
  return (
    <>
      {viewMode === "grid" && (
        <div
          onClick={onClick}
          className="relative shadow-md group w-full aspect-square rounded-xl bg-secondary select-none"
        >
          {imageUrl ? (
            <div className="w-full h-full overflow-hidden rounded-xl">
              <img
                src={imageUrl}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground pointer-events-none">
              No Image
            </div>
          )}

          <MediaMenuButton type="grid" file={file} />

          {/* <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/70 pointer-events-none"></div> */}

          {/* <div className="pointer-events-none absolute left-0 bottom-0 right-0 p-3">
            <div className="truncate text-md drop-shadow-sm">{file.name}</div>
            <div className="text-gray-400">{formatDate(file.created_at)}</div>
          </div> */}
        </div>
      )}
      {viewMode === "line" && (
        <div
          onClick={onClick}
          className="bg-secondary h-16 w-full rounded-xl border-2 border-gray-600 bg-linear-to-b from-secondary to-black/20 select-none"
        >
          <div className="flex flex-row w-full h-full pointer-events-none">
            {imageUrl ? (
              <img
                src={imageUrl}
                className="aspect-square object-cover rounded-md border border-gray-600"
              />
            ) : (
              <div className="flex h-full aspect-square shrink-0 border border-gray-600 rounded-md items-center justify-center p-1 text-center text-muted-foreground">
                No Image
              </div>
            )}
            <div className="flex-1 min-w-0 pt-1 pl-1 pr-2 h-full flex flex-col">
              <div className="flex flex-row relative">
                <div className="truncate text-lg flex-1">{file.name}</div>
                <MediaMenuButton type="line" file={file} />
              </div>
              <div className="flex-1 pb-2 pr-8 flex flex-row justify-between text-xs items-end">
                <div className="truncate text-left">{`${formatSize(file.size)}`}</div>
                <div className="truncate text-right">{`${formatDate(file.created_at)}`}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ImageCard;
