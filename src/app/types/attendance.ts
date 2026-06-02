export interface AttendanceRecordRaw {
  id: string;
  employee_id: string;
  clock_in_time: string;
  clock_out_time: string;
  clock_in_method: string;
  clock_in_location: string;
  clock_out_location: string | null;
  total_hours: number;
  created_at: string;
  updated_at: string;
  date: string;
  name: string;
  scheduled_time: string;
  time_difference: string;
  employees: {
    id: string;
    first_name: string;
    last_name: string;
    departments: {
      id: string;
      name: string;
    };
  };
}

export interface AttendanceRecord {
  id: string;
  date: string;
  name: string;
  clockIn: string;
  clockOut: string;
  department: string;
  dailyTotal: number;
  scheduled: string;
  diff: string;
  diffType: "positive" | "negative" | "neutral";
}
