// whyyy mobile browsers I WWORKED HARD FOR THIS WHY DONT YOU DETECT INPUT

// import type { ComponentProps } from "react";

// type SliderProps = Omit<ComponentProps<"input">, "type"> & {
//   orientation?: "h" | "v";
//   length?: string;
//   reverse?: boolean;
//   value: number;
//   min?: number;
//   max?: number;
// };

// export function Slider({
//   value,
//   orientation = "h",
//   reverse = false,
//   min = 0,
//   max = 1,
//   className = "",
//   length = "full",
//   ...props
// }: SliderProps) {
//   const isH = orientation === "h";
//   const hClass = reverse ? "rotate-180" : "";
//   const vClass = reverse ? "rotate-90" : "-rotate-90";

//   const percentage = Math.floor(((value - min) + 2) / (max - min) * 100); // so its slightly more up

//   return (
//     <div
//       className={`relative ${isH ? "w-full h-6" : "h-full w-6"} flex items-center justify-center ${className}`}
//     >
//       <input
//         type="range"
//         value={value}
//         min={min}
//         max={max}
//         className={`
//           absolute
//           h-5 w-${length}
//           appearance-none cursor-pointer
//           rounded-full
//           ${isH ? hClass : vClass} 

//           [&::-webkit-slider-thumb]:appearance-none
//           [&::-webkit-slider-thumb]:w-5
//           [&::-webkit-slider-thumb]:h-5
//           [&::-webkit-slider-thumb]:rounded-full
//           [&::-webkit-slider-thumb]:bg-white
//           [&::-webkit-slider-thumb]:shadow-md
//           [&::-webkit-slider-thumb]:hover:scale-110
//           [&::-webkit-slider-thumb]:transition-transform
//           [&::-webkit-slider-thumb]:mr-2

//           [&::-moz-range-thumb]:appearance-none
//           [&::-moz-range-thumb]:border-none
//           [&::-moz-range-thumb]:w-4
//           [&::-moz-range-thumb]:h-4
//           [&::-moz-range-thumb]:rounded-full
//           [&::-moz-range-thumb]:bg-white
//           [&::-moz-range-thumb]:shadow-md
//           [&::-moz-range-thumb]:hover:scale-110
//           [&::-moz-range-thumb]:transition-transform

//           `}
//         style={{
//           background: `linear-gradient(to right, white ${percentage}%, #4b5563 ${percentage}%)`
//         }}
//         {...props}
//       />
//     </div>
//   );
// }


// literally ai btw

import React from "react";
import NativeSlider from "@react-native-community/slider";
import { View, DimensionValue } from "react-native";

export interface SliderProps {
  value: number;
  orientation?: "h" | "v";
  reverse?: boolean;
  min?: number;
  max?: number;
  step?: number;
  length?: string | number;
  className?: string;
  onChange: (value: number) => void;
}

// Convert length props ("full", "40", 160, etc.) to React Native Dimension
function parseLength(len?: string | number, isVertical = false): DimensionValue {
  if (!len || len === "full") return "100%";
  if (typeof len === "number") return len;
  
  const num = parseFloat(len);
  if (isNaN(num)) return len as DimensionValue;
  
  // Tailwind-style spacing units (e.g., length="40" -> 160px)
  if (num <= 96 && !len.includes("%") && !len.includes("px")) {
    return num * 4;
  }
  return num;
}

export function Slider({
  value,
  orientation = "h",
  reverse = false,
  min = 0,
  max = 100,
  step = 1,
  length = "full",
  className = "",
  onChange,
}: SliderProps) {
  const isV = orientation === "v";
  const dimensionLength = parseLength(length, isV);

  // Default rotation for vertical: -90deg (bottom = 0, top = max)
  const rotation = isV ? (reverse ? "90deg" : "-90deg") : (reverse ? "180deg" : "0deg");

  return (
    <View
      className={`relative flex items-center justify-center ${className}`}
      style={
        isV
          ? { height: dimensionLength, width: 40 }
          : { width: dimensionLength, height: 40 }
      }
    >
      <NativeSlider
        style={{
          width: isV ? (typeof dimensionLength === "number" ? dimensionLength : 140) : "100%",
          height: 40,
          transform: [{ rotate: rotation }],
        }}
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={onChange}
        // Custom styling matching your dark theme
        minimumTrackTintColor="#FFFFFF" // Filled track
        maximumTrackTintColor="#4B5563" // Unfilled track
        thumbTintColor="#FFFFFF"        // Circle thumb
      />
    </View>
  );
}