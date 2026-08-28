// export const toggleFullscreen = async (elementId: string) => {
//   try {
//     if (!document.fullscreenElement) {
//       const container = document.getElementById(elementId);
//       if (container && container.requestFullscreen) {
//         await container.requestFullscreen();
//       }
//     } else {
//       if (document.exitFullscreen) {
//         await document.exitFullscreen();
//       }
//     }
//   } catch (error) {
//     console.error("Error attempting to toggle full screen:", error);
//   }
// };