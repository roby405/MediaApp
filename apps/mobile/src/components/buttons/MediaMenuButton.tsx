import MediaMenu from "../../modals/MediaMenu";
import { EllipsisVerticalIcon } from "lucide-react-native";
import { IconButton } from "./IconButton";
import { useState } from "react";
import { MediaFile } from "@media-app/core/types/db";

type MediaMenuButtonProps = {
  file: MediaFile;
  type: "grid" | "line";
};

export function MediaMenuButton({ file, type }: MediaMenuButtonProps) {
  const [menuActive, setMenuActive] = useState<boolean>(false);

  return (
    <>
      <IconButton
        Icon={EllipsisVerticalIcon}
        iconProps={{ strokeWidth: 1.5, className: "w-7 h-7" }}
        className={`${type === "grid" ? "absolute right-2 top-2 bg-gray-500/50 rounded-xl" : ""} w-7 h-8 pointer-events-auto`}
        onPress={(e) => {
          e.stopPropagation();
          setMenuActive(!menuActive);
        }}
      />

      <MediaMenu
        isOpen={menuActive}
        onClose={() => setMenuActive(false)}
        file={file}
      />
    </>
  );
}
