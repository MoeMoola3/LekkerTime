export interface DayCell {
  day: string;
  date: string;
  fullDate: string;
}

export type ShiftStatus = "published" | "draft";
export type ViewMode = "daily" | "weekly" | "monthly";

export interface Shift {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  status: ShiftStatus;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  departmentId: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface ShiftFormData {
  departmentId: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: ShiftStatus;
}

export interface ContextMenuState {
  x: number;
  y: number;
  shift: Shift;
}
