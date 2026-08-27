export function formatLength(duration: number): string {
  const days = Math.floor(Math.ceil(duration) / (3600 * 24));
  const hours = Math.floor(Math.ceil(duration) / 3600) % 24;
  const minutes = Math.floor(Math.ceil(duration) / 60) % 60;
  const seconds = Math.ceil(duration) % 60;

  return `${days ? `${days.toString().padStart(2, "0")}:` : ""}${days || hours ? `${hours.toString().padStart(2, "0")}:` : ""}${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}