import { mapAttendanceRecord } from "../../utils/mappers/attendance.mapper";
import { supabase } from "../supabaseClient";

export async function fetchAttendanceRecords() {
  const { data, error } = await supabase.from("attendance_records").select(`
    *,
    employees (
      id,
      departments!employees_department_id_fkey (
        id,
        name
      )
    )
  `);

  if (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }

  return data.map(mapAttendanceRecord);
}
