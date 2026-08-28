// import { useEffect, useRef } from "react";
// import { clamp, useSpring } from "framer-motion";
// import { useGesture } from "@use-gesture/react";
// import { useActiveMedia } from "../../../../packages/core/hooks/useActiveMedia";
// import { useNavStore } from "../../../../packages/core/stores/useNavStore";
// import { SlidingImage } from "./image/SlidingImage";

// // interface ImagePlayerProps {
// //   file: MediaFile | null;
// // }

// export function ImagePlayer() {
//   // const currentImage = useImagePlayerStore((state) => state.currentImage);
//   // const imageData = useImagePlayerStore((state) => state.imageData);
//   // const initializeImage = useImagePlayerStore((state) => state.initializeImage);
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const { file, index } = useActiveMedia();
//   const setActiveMedia = useNavStore((state) => state.setActiveMedia);
//   const x = useSpring(0, { stiffness: 800, damping: 50, mass: 0.03 });
//   const y = useSpring(0, { stiffness: 800, damping: 50, mass: 0.03 });
//   const scale = useSpring(1, { stiffness: 800, damping: 50, mass: 0.03 });
//   const rotate = useSpring(0, { stiffness: 800, damping: 50, mass: 0.03 });
//   const p = useSpring(index, { stiffness: 300, damping: 35, mass: 0.03 });

//   const playQueue = useNavStore((state) => state.playQueue);

//   const getClampedOffsets = (targetX: number, targetY: number, s: number) => {
//     if (s <= 1 || !wrapperRef.current) {
//       return { clampedX: 0, clampedY: 0 };
//     }
//     const { width, height } = wrapperRef.current.getBoundingClientRect();
//     const maxX = (width * (s - 1)) / 2;
//     const maxY = (height * (s - 1)) / 2;

//     return {
//       clampedX: clamp(-maxX, maxX, targetX),
//       clampedY: clamp(-maxY, maxY, targetY),
//     };
//   };

//   const imageList = [];
//   const prevId = index - 1 >= 0 ? playQueue[index - 1] : null;
//   if (prevId) imageList.push({ id: prevId, index: index - 1 });
//   imageList.push({ id: playQueue[index], index: index });
//   const nextId = index + 1 < playQueue.length ? playQueue[index + 1] : null;
//   if (nextId) imageList.push({ id: nextId, index: index + 1 });

//   useEffect(() => {
//     p.set(index)
//     scale.set(1);
//     x.set(0);
//     y.set(0);
//     rotate.set(0);
//   }, [index, p, scale, x, y, rotate]);

//   useGesture(
//     {
//       onDrag: ({
//         offset: [dx, dy],
//         pinching,
//         cancel,
//         active,
//         movement: [mx],
//         velocity: [vx],
//       }) => {
//         if (pinching) return cancel();

//         const currentScale = scale.get();
//         if (currentScale > 1) {
//           // Pass drag offsets through your clamping function
//           const { clampedX, clampedY } = getClampedOffsets(
//             dx,
//             dy,
//             currentScale,
//           );
//           x.set(clampedX);
//           y.set(clampedY);
//         } else {
//           const width = wrapperRef.current?.offsetWidth || 500;
//           if (!active) {
//             // stop the drag and calc if it should go to next pic
//             if (index - 1 >= 0 && (mx / width > 0.34 || (mx > 0 && vx > 0.3))) {
//               setActiveMedia({
//                 id: playQueue[index - 1],
//                 category: "image",
//               });
//             }
//             else if (index + 1 < playQueue.length && (mx / width < -0.34 || (mx < 0 && vx > 0.3))) {
//               setActiveMedia({
//                 id: playQueue[index + 1],
//                 category: "image",
//               });
//             } else {
//               p.set(index);
//             }
            
//           } else {
//             // currently dragging, should change p gradually

//             p.set(index - mx / width);
//           }
//         }
//       },

//       onWheel: ({ event, delta: [, dy] }) => {
//         event.preventDefault();

//         if (event.shiftKey) {
//           const angle = clamp(-30, 30, dy);
//           rotate.set(rotate.get() + angle);
//           return;
//         }
//         const currentScale = scale.get();
//         let zooming = 1;
//         if (dy > 0) zooming = 0.6;
//         if (dy < 0) zooming = 1.4;
//         const newZoom = Math.min(Math.max(1, currentScale * zooming), 10);
//         const zoomzoom = newZoom / currentScale;
//         const tx = event.clientX;
//         const ty = event.clientY;

//         const bounds = wrapperRef.current?.getBoundingClientRect();
//         if (bounds) {
//           const originX = tx - (bounds.left + bounds.width / 2);
//           const originY = ty - (bounds.top + bounds.height / 2);

//           const targetX = originX + (x.get() - originX) * zoomzoom;
//           const targetY = originY + (y.get() - originY) * zoomzoom;

//           const { clampedX, clampedY } = getClampedOffsets(
//             targetX,
//             targetY,
//             newZoom,
//           );

//           x.set(clampedX);
//           y.set(clampedY);
//           scale.set(newZoom);
//         }
//       },

//       onPinch: ({ origin: [tx, ty], offset: [s, angle], memo, event }) => {
//         event.preventDefault();
//         rotate.set(angle);
//         if (!memo) {
//           const bounds = wrapperRef.current?.getBoundingClientRect();
//           if (bounds) {
//             memo = {
//               originX: tx - (bounds.left + bounds.width / 2),
//               originY: ty - (bounds.top + bounds.height / 2),
//               initialX: x.get(),
//               initialY: y.get(),
//               initialScale: scale.get(),
//             };
//           }
//         }

//         const ratio = s / memo.initialScale;
//         const targetX = memo.originX + (memo.initialX - memo.originX) * ratio;
//         const targetY = memo.originY + (memo.initialY - memo.originY) * ratio;

//         const { clampedX, clampedY } = getClampedOffsets(targetX, targetY, s);
//         x.set(clampedX);
//         y.set(clampedY);
//         scale.set(s);

//         return memo;
//       },
//       onPinchEnd: () => {
//         if (scale.get() <= 1) {
//           scale.set(1);
//           x.set(0);
//           y.set(0);
//         }
//       },
//     },

//     {
//       target: wrapperRef,
//       eventOptions: { passive: false },
//       drag: {
//         from: () => [x.get(), y.get()],
//       },
//       pinch: {
//         from: () => [scale.get(), rotate.get()],
//         scaleBounds: { min: 1, max: 10 },
//         rubberband: true,
//       },
//     },
//   );

//   if (!file || file.category !== "image") return null;


//   return (
//     <div
//       ref={wrapperRef}
//       className="w-full h-full flex items-center justify-center relative touch-none select-none overflow-hidden bg-black"
//     >
//       {imageList.map(({ id, index: idx }) => (
//         <SlidingImage
//           key={id}
//           x={x}
//           y={y}
//           scale={scale}
//           rotate={rotate}
//           id={id}
//           index={idx}
//           page={p}
//           isCurrent={index === idx}
//         />
//       ))}
//     </div>
//   );
// }
