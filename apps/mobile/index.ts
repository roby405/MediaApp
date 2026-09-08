import "./global.css";
import { registerRootComponent } from "expo";
import App from "./src/App";
import { initDB } from "src/db";
import { Registry } from "@media-app/core/interfaces/Registry";
import { saveFile, getFile, getFileContent, deleteFile, updateFile, renameFile, getFilesByCategory } from "src/db/operations";

initDB();

Registry.registerDB({
  getFile,
  getFileContent,
  deleteFile,
  updateFile,
  renameFile,
  saveFile: async (file, source) => {
    await saveFile(file, source.path);
  },
  getFilesByCategory,
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
