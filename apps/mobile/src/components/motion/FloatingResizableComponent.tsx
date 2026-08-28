import { motion } from "framer-motion";
import { Resizable } from "re-resizable";
import { useRef, type ReactNode } from "react";

export interface FloatingResizableComponentProps {
  children: ReactNode;
  className?: string;
  lockAspectRatio?: boolean;
}

export function FloatingResizableComponent({
  className = "",
  children,
  lockAspectRatio = false,
}: FloatingResizableComponentProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={constraintsRef}
      className="fixed pb-24 flex justify-center items-end w-full inset-0 pointer-events-none z-40"
    >
      <motion.div
        drag
        dragMomentum={true}
        dragTransition={{
          power: 0.05,
          timeConstant: 200,
          bounceStiffness: 300,
          bounceDamping: 20,
        }}
        dragConstraints={constraintsRef}
        className="w-fit h-fit pointer-events-auto touch-none"
      >
        <Resizable
          defaultSize={{width:400, height: "auto"}}
          minWidth={200}
          maxWidth={1000}
          lockAspectRatio={lockAspectRatio}
          onResizeStart={(e) => e.stopPropagation()}
          className={`w-[90%] max-w-lg flex items-center justify-center p-2 rounded-xl rounded-tr-3xl bg-white/20 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto touch-none active:cursor-grabbing cursor-grab overflow-hidden ${className}`}
        >
          <div className="w-full h-full pointer-events-none">{children}</div>
        </Resizable>
      </motion.div>
    </div>
  );
}
