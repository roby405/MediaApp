import "./global.css";
import { registerRootComponent } from "expo";
import App from "./src/App";
import { initDB } from "src/db";
import { Registry } from "@media-app/core/interfaces/Registry";
import { saveFile, getFile, getFileContent, deleteFile, updateFile, renameFile, getFilesByCategory } from "src/db/operations";
import TrackPlayer from "react-native-track-player";
import { useMediaStore } from "@media-app/core/stores/useMediaStore";
import { Cover } from "@media-app/core/interfaces/CoverRegistry";
import { MobileCoverCompressor } from "src/utils/MobileCoverCompressor";

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

Cover.registerCoverCompressor(new MobileCoverCompressor());

useMediaStore.getState().loadAll();

TrackPlayer.registerPlaybackService(() => async () => {});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
