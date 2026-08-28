// import { motion, MotionValue, useTransform } from "framer-motion";
// import { getMediaUrl } from "../../utils/getMediaUrl";

// interface SlidingImageProps {
//   id: string;
//   page: MotionValue<number>;
//   index: number;
//   x: MotionValue<number>;
//   y: MotionValue<number>;
//   scale: MotionValue<number>;
//   rotate: MotionValue<number>;
//   isCurrent: boolean;
// }

// export function SlidingImage({
//   id,
//   page,
//   index,
//   x,
//   y,
//   scale,
//   rotate,
//   isCurrent,
// }: SlidingImageProps) {
//   const transformX = useTransform(page, (p) => `${(index - p) * 100}%`);

//   return (
//     <motion.div
//       style={{ x: transformX }}
//       className="absolute inset-0 flex items-center justify-center pointer-events-none"
//     >
//       <motion.img
//         src={getMediaUrl(id)}
//         draggable={false}
//         style={isCurrent ? { x, y, scale, rotate } : {}}
//         className={`w-full h-full object-contain ${isCurrent ? "cursor-grab active:cursor-grabbing" : ""}`}
//       />
//     </motion.div>
//   );
// }
