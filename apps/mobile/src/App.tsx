// src/App.tsx

import PageContent from "./components/PageContent";
import MobileBottomBar from "./components/MobileBottomBar";
import { useNavStore } from "../../../packages/core/stores/useNavStore";
import { isMediaScreen, SCREEN_MAP } from "./screens";
import type { Screen } from "../../../packages/core/types/global";
import { AudioPlayer } from "./players/AudioPlayer";
import { FloatingComponent } from "./components/motion/FloatingComponent";
import { FloatingResizableComponent } from "./components/motion/FloatingResizableComponent";
import { ExpandedVideoPlayer, MiniVideoPlayer } from "./players/VideoPlayer";
import { useVideoPlayerStore } from "../../../packages/core/stores/useVideoPlayerStore";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { MediaScreen } from "./screens/MediaScreen";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { useVideoEngine } from "./hooks/useVideoEngine";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function App() {
  const activeScreen = useNavStore((state) => state.activeScreen);
  const activeMedia = useNavStore((state) => state.activeMedia);
  const deferred = useNavStore((state) => state.deferred);

  const isExpanded = useVideoPlayerStore((state) => state.isExpanded);

  const [screen, setScreen] = useState<Screen>(activeScreen);

  if (activeScreen !== screen && deferred === false) setScreen(activeScreen);

  const renderScreen = () => {
    if (isMediaScreen(screen)) return <MediaScreen type={screen} />;
    const ScreenComponent = SCREEN_MAP[screen];
    return <ScreenComponent />;
  };

  const ComponentScreen = renderScreen();

  useAudioEngine();
  useVideoEngine();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 w-full h-full flex flex-col bg-primary text-white">
        <PageContent>{ComponentScreen}</PageContent>
        {activeMedia && activeMedia.category === "audio" && (
          <>
            <FloatingComponent>
              <AudioPlayer />
            </FloatingComponent>
          </>
        )}
        {activeMedia && activeMedia.category === "video" && (
          <>
            {isExpanded ? (
              <ExpandedVideoPlayer />
            ) : (
              // make it fullscreen somehow
              <FloatingResizableComponent>
                <MiniVideoPlayer />
              </FloatingResizableComponent>
            )}
          </>
        )}
        <MobileBottomBar />
      </View>
    </GestureHandlerRootView>
  );
}

export default App;
