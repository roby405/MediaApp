// import { useEffect, useRef, useState } from "react";
// import { useBookPlayerStore } from "../stores/useBookPlayerStore";
// import type { BookMediaFile } from "../db/schema";
// import { Pressable, View } from "react-native";

// interface BookPlayerProps {
//   file: BookMediaFile;
// }

// export function BookPlayer({ file }: BookPlayerProps) {
//   const [currentChapterHtml, setCurrentChapterHtml] = useState<string>("");

//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
//   const initializeBook = useBookPlayerStore((state) => state.initializeBook);
//   const getEpubChapterHtml = useBookPlayerStore((state) => state.getEpubChapterHtml);
//   const epubData = useBookPlayerStore((state) => state.epubData);
//   const pdfDoc = useBookPlayerStore((state) => state.pdfDoc);
//   const cbzData = useBookPlayerStore((state) => state.cbzData);

//   const currentPage = useBookPlayerStore((state) => state.currentPage);
//   const increasePage = useBookPlayerStore((state) => state.increasePage);
//   const decreasePage = useBookPlayerStore((state) => state.decreasePage);

//   const renderPdfToCanvas = useBookPlayerStore((state) => state.renderPdfToCanvas);


//   useEffect(() => {
//     initializeBook(file);
//   }, [file, initializeBook]);

//   useEffect(() => {
//     if (!epubData) return;

//     let isMounted = true;
//     getEpubChapterHtml().then((html) => {
//       if (isMounted) {
//         setCurrentChapterHtml(html);
//       }
//     });

//     return () => {
//       isMounted = false;
//     };
//   }, [epubData, currentPage, getEpubChapterHtml]);

//   useEffect(() => {
//     if (!pdfDoc) return;

//     if (!canvasRef.current)
//         return;

//     let isCancelled = false;

//     renderPdfToCanvas(canvasRef.current).catch((err) => {
//         if (!isCancelled)
//             console.error("Couldnt render page of pdf: " + err);
//     });

//     return () => {
//         isCancelled = true;
//     }

//   }, [pdfDoc, currentPage, renderPdfToCanvas])

//   const handlePreviousPage = () => decreasePage();

//   const handleNextPage = () => increasePage();

//   return (
//     <View className="w-full h-full flex flex-col">
//       <View className="flex-1 w-full h-full bg-white">
//         {
//             file.extension === "epub" &&
//                     <iframe
//           key={currentPage}
//           srcDoc={currentChapterHtml}
//           title="Book Page"
//           sandbox="allow-same-origin"
//           className="w-full h-full border-none block"
//         />
//         }

//         {
//             file.extension === "pdf" &&
//             <canvas key={currentPage} ref={canvasRef} className="w-full h-full border-none block" />
//         }

//         {
//             file.extension === "cbz" &&
//             <img key={currentPage} src={cbzData?.images[currentPage]} className="h-full border-none" />
//         }

//       </View>
//       <View className="flex flex-row justify-between">
//         <Pressable onPress={handlePreviousPage} className="bg-amber-400">
//           Previous
//         </Pressable>
//         <Pressable onPress={handleNextPage} className="bg-amber-400">
//           Next
//         </Pressable>
//       </View>
//     </View>
//   );
// }