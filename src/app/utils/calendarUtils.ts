// ─── Constants ────────────────────────────────────────────────────────────────

import { DayCell, ShiftFormData, ViewMode } from "../types/shifts";

export const TODAY = new Date();

export const DAYS_OF_WEEK = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const EMPTY_FORM: ShiftFormData = {
  departmentId: "",
  employeeId: "",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  status: "draft",
};

export const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const TODAY_STRING = formatDateString(TODAY);

export const getWeekStart = (date: Date): Date => {
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diff);
  return monday;
};

export const getDaysForView = (
  view: ViewMode,
  currentDate: Date,
): DayCell[] => {
  if (view === "daily") {
    return [
      {
        day: DAYS_OF_WEEK[currentDate.getDay()],
        date: currentDate.getDate().toString(),
        fullDate: formatDateString(currentDate),
      },
    ];
  }

  if (view === "weekly") {
    const weekStart = getWeekStart(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return {
        day: DAYS_OF_WEEK[d.getDay()],
        date: d.getDate().toString(),
        fullDate: formatDateString(d),
      };
    });
  }

  return []; // monthly view is handled by MonthlyCalendarView directly
};

export const getDateRangeText = (view: ViewMode, currentDate: Date): string => {
  if (view === "daily") {
    const month = MONTH_NAMES[currentDate.getMonth()].slice(0, 3);
    return `${month} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
  }

  if (view === "weekly") {
    const weekStart = getWeekStart(currentDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const startMonth = MONTH_NAMES[weekStart.getMonth()].slice(0, 3);
    const endMonth = MONTH_NAMES[weekEnd.getMonth()].slice(0, 3);
    const year = weekStart.getFullYear();

    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${startMonth} ${weekStart.getDate()} – ${weekEnd.getDate()}, ${year}`;
    }
    return `${startMonth} ${weekStart.getDate()} – ${endMonth} ${weekEnd.getDate()}, ${year}`;
  }

  return `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
};

export const formatDisplayDate = (dateStr: string): string => {
  const [y, m, d] = dateStr.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "short",
      day: "numeric",
    },
  );
};

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");
