export function formatDailyTotal(decimalHours: number) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  const minuteFormatter = minutes == 0 ? "" : ` ${minutes}m`;
  return `${hours}h${minuteFormatter}`;
}

export function formatTimeDiff(time_diff: string) {
  const isNegative = time_diff.startsWith("-");
  const sign = isNegative ? "- " : "";

  // Remove sign and split into parts
  const parts = time_diff.replace(/^[-+]/, "").split(":").map(Number);
  const [hours, minutes, seconds] = parts;

  let result = [];

  if (hours > 0) result.push(`${hours}h`);
  if (minutes > 0) result.push(`${minutes}m`);

  if (result.length === 0) return "-"; // neutral

  return sign + result.join(" ");
}
