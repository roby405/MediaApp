export function formatDate(timestamp: number): string {
    const date = new Date(Number(timestamp));

    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`
}

export const toDateInputValue = (timestamp: number): string => {
  if (timestamp <= 0 || timestamp === Infinity) return "";
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0];
};