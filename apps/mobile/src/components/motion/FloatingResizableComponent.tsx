import { useRef, type ReactNode } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useWindowDimensions, View } from "react-native";

interface FloatingComponentProps {
  children: ReactNode;
  className?: string;
}

export function FloatingResizableComponent({
  children,
  className = "",
}: FloatingComponentProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const xTranslate = useSharedValue(0);
  const yTranslate = useSharedValue(0);
  const xStart = useSharedValue(0);
  const yStart = useSharedValue(0);

    const panGesture = Gesture.Pan()
    .onStart(() => {
      xStart.value = xTranslate.value;
      yStart.value = yTranslate.value;
    })
    .onUpdate((e) => {
      xTranslate.value = xStart.value + e.translationX;
      yTranslate.value = yStart.value + e.translationY;
    })
    .onEnd(() => {
      const boundX = screenWidth * 0.4;
      const boundY = screenHeight * 0.4;
      if (Math.abs(xTranslate.value) > boundX)
        xTranslate.value = withSpring(Math.sign(xTranslate.value) * boundX);
      if (Math.abs(yTranslate.value) > boundY)
        yTranslate.value = withSpring(Math.sign(yTranslate.value) * boundY);
    });

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
          className={`w-[90%] max-w-lg max-h-[90%] p-2 rounded-xl rounded-tr-3xl bg-white/20 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden ${className}`}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
