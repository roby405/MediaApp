import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ScrollingTextProps {
  text: string;
  className?: string;
}

export function ScrollingText({ text, className = "" }: ScrollingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  
  const [shouldScroll, setShouldScroll] = useState(false);
  const [shiftWidth, setShiftWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      // Measure the exact width of the text itself
      const textWidth = textRef.current.offsetWidth;

      if (textWidth > containerWidth) {
        setShouldScroll(true);
        // We add 32px to account for the 'pr-8' (padding-right: 2rem) gap we add below
        setShiftWidth(textWidth + 32); 
      } else {
        setShouldScroll(false);
        setShiftWidth(0);
      }
    }
  }, [text]);

  return (
    <div 
      ref={containerRef} 
      className={`overflow-hidden whitespace-nowrap w-full ${className}`}
    >
      <motion.div
        className="flex w-max"
        animate={{ 
          x: shouldScroll ? [0, -shiftWidth] : 0 
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop", // Changed from 'reverse' to 'loop'
          ease: "linear",
          duration: shouldScroll ? shiftWidth * 0.015 : 0, // Adjusted speed multiplier for continuous motion
        }}
      >
        {/* The Original Text */}
        <span ref={textRef} className={shouldScroll ? "pr-8" : ""}>
          {text}
        </span>

        {/* The Duplicate Text (Only renders if scrolling is needed) */}
        {shouldScroll && (
          <span className="pr-8">
            {text}
          </span>
        )}
      </motion.div>
    </div>
  );
}