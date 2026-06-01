import { AttendanceRecord, AttendanceRecordRaw } from "../../types/attendance";

export function mapAttendanceRecord(
  raw: AttendanceRecordRaw,
): AttendanceRecord {
  console.log("Loaded");
  return {
    id: raw.id,
    date: raw.date,
    name: raw.name,
    clockIn: raw.clock_in_time,
    clockOut: raw.clock_out_time,
    department: raw.employees.departments.name,
    dailyTotal: raw.total_hours,
    scheduled: raw.scheduled_time,
    diff: raw.time_difference,
    diffType: "positive",
  };
}
