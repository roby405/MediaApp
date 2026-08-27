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


import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";

type SliderProps = {
  orientation?: "h" | "v";
  length?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
};

// literally ai btw
export function Slider({
  value,
  orientation = "h",
  min = 0,
  max = 100,
  step = 1,
  className = "",
  length = "40",
  onChange,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isH = orientation === "h";

  const updateValue = (clientX: number, clientY: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();

    // Fix 1: Adjust the math by 10px (half thumb) and 20px (full thumb)
    // so the pointer maps exactly to the visual boundaries.
    let percent = isH
      ? (clientX - rect.left - 10) / (rect.width - 20)
      : 1 - ((clientY - rect.top - 10) / (rect.height - 20));

    percent = Math.max(0, Math.min(1, percent));
    let newValue = min + percent * (max - min);

    if (step) {
      newValue = Math.round(newValue / step) * step;
    }

    onChange(newValue);
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateValue(e.clientX, e.clientY);
    e.stopPropagation();
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateValue(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    e.stopPropagation();
  };

  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));

  return (
    <div
      className={`relative flex items-center justify-center touch-none cursor-pointer ${
        isH ? `h-8` : `w-8`
      } ${className}`}
      style={isH? {width: length} : {height: length}}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={trackRef}
        className={`relative bg-gray-600 rounded-full ${
          isH ? "w-full h-2" : "h-full w-2"
        }`}
      >
        {/* Fix 2: The fill line travels perfectly up to the center of the bounded thumb (10px offset) */}
        <div
          className="absolute bg-white rounded-full pointer-events-none"
          style={
            isH
              ? { left: 0, top: 0, bottom: 0, width: `calc(${ratio} * (100% - 20px) + 10px)` }
              : { left: 0, right: 0, bottom: 0, height: `calc(${ratio} * (100% - 20px) + 10px)` }
          }
        />

        {/* Fix 3: The thumb is strictly positioned within the remaining track area (100% - 20px) */}
        <motion.div
          className="absolute w-5 h-5 bg-white rounded-full shadow-md pointer-events-none"
          style={
            isH
              ? { left: `calc(${ratio} * (100% - 20px))`, top: "50%" }
              : { bottom: `calc(${ratio} * (100% - 20px))`, left: "50%" }
          }
          initial={false}
          animate={{
            scale: isDragging ? 1.25 : 1,
            // Cross-axis centering only. We removed the primary-axis offset because 
            // the CSS calc() handles the visual boundaries perfectly now.
            x: isH ? 0 : "-50%",
            y: isH ? "-50%" : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      </div>
    </div>
  );
}