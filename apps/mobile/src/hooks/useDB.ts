import { Registry } from "@media-app/core/interfaces/Registry";
import { useEffect } from "react";
import { initDB } from "src/db";
import { saveFile, getFile, getFileContent, deleteFile, updateFile, renameFile, getFilesByCategory } from "src/db/operations";

export function useDB() {
  useEffect(() => {
    const setup = async () => {
      initDB();
    }

    Registry.registerDB({
      getFile,
      getFileContent,
      deleteFile,
      updateFile,
      renameFile,
      saveFile: async (file, source) => {
        if (source.kind === "uri")
          // TODO no cover url
          await saveFile(file, source.value);
      },
      getFilesByCategory
    })
  }, [])
}