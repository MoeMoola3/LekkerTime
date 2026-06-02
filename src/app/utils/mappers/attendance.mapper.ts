import { AttendanceRecord, AttendanceRecordRaw } from "../../types/attendance";

export function mapAttendanceRecord(
  raw: AttendanceRecordRaw,
): AttendanceRecord {
  return {
    id: raw.id,
    date: raw.date,
    name: `${raw.employees.first_name} ${raw.employees.last_name}`,
    clockIn: raw.clock_in_time,
    clockOut: raw.clock_out_time,
    department: raw.employees.departments.name,
    dailyTotal: raw.total_hours,
    scheduled: raw.scheduled_time,
    diff: raw.time_difference,
    diffType: getDiffType(raw.time_difference),
  };
}

function getDiffType(time_diff: string) {
  if (time_diff.startsWith("-")) {
    return "negative";
  } else if (time_diff === "00:00:00") {
    return "neutral";
  } else {
    return "positive";
  }
}
