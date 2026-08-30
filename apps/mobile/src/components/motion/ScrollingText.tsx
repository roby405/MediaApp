import { useRef, useState, useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
interface ScrollingTextProps {
  text: string;
  className?: string;
}

export function ScrollingText({ text, className = "" }: ScrollingTextProps) {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [textWidth, setTextWidth] = useState<number>(0);

  const xTranslate = useSharedValue(0);

  const shouldScroll = textWidth > containerWidth && containerWidth > 0;
  const shiftDistance = textWidth + 32;

  useEffect(() => {
    cancelAnimation(xTranslate);
    xTranslate.value = 0;

    if (shouldScroll) {
      const duration = shiftDistance * 20;

      xTranslate.value = withRepeat(
        withTiming(-1 * shiftDistance, {
          duration,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    }
  }, [shouldScroll, shiftDistance, text]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: xTranslate.value }],
  }));

  return (
    <View
      className={`overflow-hidden whitespace-nowrap w-full ${className}`}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Animated.View style={[{ flexDirection: "row" }, animatedStyle]}>
        {/* The Original Text */}
        <AppText
          className={shouldScroll ? "pr-8" : ""}
          numberOfLines={1}
          onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
        >
          {text}
        </AppText>

        {/* The Duplicate Text (Only renders if scrolling is needed) */}
        {shouldScroll && <AppText className="pr-8">{text}</AppText>}
      </Animated.View>
    </View>
  );
}
