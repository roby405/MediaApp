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
import { useState } from "react";
import { View } from "react-native";
import { MediaScreen } from "./screens/MediaScreen";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { useVideoEngine } from "./hooks/useVideoEngine";

function App() {
  const activeScreen = useNavStore((state) => state.activeScreen);
  const activeMedia = useNavStore((state) => state.activeMedia);
  const deferred = useNavStore((state) => state.deferred);

  const isExpanded = useVideoPlayerStore((state) => state.isExpanded);
  
  
  const [screen, setScreen] = useState<Screen>(activeScreen);
  
  if (activeScreen !== screen && deferred === false) setScreen(activeScreen);

  const renderScreen = () => {
    if (isMediaScreen(screen))
      return <MediaScreen type={screen} />
    const ScreenComponent = SCREEN_MAP[screen];
    return <ScreenComponent />
  }


  const ComponentScreen = renderScreen();
  
  useAudioEngine();
  useVideoEngine();
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .register("/mediaStreamer.js")
  //       .then((reg) => console.log(`OPFS worker registered: ${reg}`))
  //       .catch((err) => console.error(`Registration failed: ${err}`));
  //   }
  // }, []);

  return (
    <View className="flex-1 w-full h-full flex flex-col bg-primary text-white">
      <PageContent>
        {ComponentScreen}
      </PageContent>
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
            <FloatingResizableComponent lockAspectRatio={true}>
              <MiniVideoPlayer />
            </FloatingResizableComponent>
          )}
        </>
      )}
      <MobileBottomBar />
    </View>
  );
}

// export function InstallPWAButton() {
//   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
//   const [isInstallable, setIsInstallable] = useState(false);

//   useEffect(() => {
//     const handleBeforeInstallPrompt = (e: Event) => {
//       // Prevent the mini-infobar from appearing on mobile
//       e.preventDefault();
//       // Stash the event so it can be triggered later.
//       setDeferredPrompt(e);
//       // Update UI notify the user they can install the PWA
//       setIsInstallable(true);
//     };

//     window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

//     return () => {
//       window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
//     };
//   }, []);

//   const handleInstallClick = async () => {
//     if (!deferredPrompt) return;

//     // Show the native install prompt
//     deferredPrompt.prompt();

//     // Wait for the user to respond to the prompt
//     const { outcome } = await deferredPrompt.userChoice;

//     if (outcome === 'accepted') {
//       console.log('User accepted the install prompt');
//     }

//     // We've used the prompt, and can't use it again, throw it away
//     setDeferredPrompt(null);
//     setIsInstallable(false);
//   };

//   if (!isInstallable) return null;

//   return (
//     <button
//       onClick={handleInstallClick}
//       className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors"
//     >
//       <Download className="w-4 h-4" />
//       Install App
//     </button>
//   );
// }

export default App;
