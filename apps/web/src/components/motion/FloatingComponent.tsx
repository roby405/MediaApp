import { useRef, type ReactNode } from "react";
import { motion, useDragControls } from "framer-motion";

interface FloatingComponentProps {
  children: ReactNode;
  className?: string;
}

export function FloatingComponent({
  children,
  className = "",
}: FloatingComponentProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  return (
    <div
      ref={constraintsRef}
      className="fixed pb-24 flex justify-center items-end w-full inset-0 pointer-events-none z-40"
    >
      <motion.div
        drag
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={true}
        dragTransition={{
          power: 0.05,
          timeConstant: 200,
          bounceStiffness: 300,
          bounceDamping: 20,
        }}
        dragConstraints={constraintsRef}
        onPointerDown={(e) => {
          const target = e.target as Element;
          if (target.closest(".no-drag"))
            return;

          dragControls.start(e);
        }}
        className={`w-[90%] max-w-lg max-h-[90%] flex items-center justify-center p-2 rounded-xl rounded-tr-3xl bg-white/20 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto touch-none active:cursor-grabbing cursor-grab overflow-hidden ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
