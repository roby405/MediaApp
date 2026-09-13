import { useMemo, type ReactNode } from "react";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Platform, useWindowDimensions, View } from "react-native";

interface FloatingComponentProps {
  children: ReactNode;
  className?: string;
}

const supportsRealBlur =
  Platform.OS === "ios" ||
  (Platform.OS === "android" && Platform.Version >= 31);

export function FloatingComponent({
  children,
  className = "",
}: FloatingComponentProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const xTranslate = useSharedValue(0);
  const yTranslate = useSharedValue(0);
  const xStart = useSharedValue(0);
  const yStart = useSharedValue(0);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          "worklet";
          xStart.value = xTranslate.value;
          yStart.value = yTranslate.value;
        })
        .onUpdate((e) => {
          "worklet";
          xTranslate.value = xStart.value + e.translationX;
          yTranslate.value = yStart.value + e.translationY;
        })
        .onEnd(() => {
          "worklet";
          const boundX = screenWidth * 0.4;
          const boundY = screenHeight * 0.4;
          if (Math.abs(xTranslate.value) > boundX)
            xTranslate.value = withSpring(Math.sign(xTranslate.value) * boundX);
          if (Math.abs(yTranslate.value) > boundY)
            yTranslate.value = withSpring(Math.sign(yTranslate.value) * boundY);
        }),
    [screenWidth, screenHeight, xStart, yStart, xTranslate, yTranslate]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: xTranslate.value },
      { translateY: yTranslate.value },
    ],
  }));

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-0 pb-24 items-center justify-end z-40"
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={animatedStyle}
          className={`w-[90%] max-w-xl max-h-[100%] shadow-2xl ${className}`}
        >
          <View className="rounded-xl rounded-tr-3xl overflow-hidden border border-white/20 bg-white/[0.08]">
            {supportsRealBlur ? (
              <BlurView
                intensity={60}
                tint="dark"
                experimentalBlurMethod="dimezisBlurView"
                className="absolute inset-0"
              />
            ) : (
              <LinearGradient
                colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.05)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
              />
            )}

            <View className="p-2">{children}</View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
