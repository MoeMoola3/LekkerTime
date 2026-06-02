export function formatRosterDate(dateString: string) {
  const date = new Date(dateString);

  // Short weekday name (Mon, Tue, etc.)
  const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });

  // Day and month with leading zeros
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  return `${weekday} ${day}/${month}`;
}
