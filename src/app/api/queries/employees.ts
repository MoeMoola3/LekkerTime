import { EmployeesRecordRaw } from "../../types/employees";
import { mapEmployeesRecord } from "../../utils/mappers/employees.mapper";
import { supabase } from "../supabaseClient";

export async function fetchEmployeesRecords() {
  const { data, error } = (await supabase.from("employees").select(`
  id,
  employee_number,
  first_name,
  last_name,
  email,
  phone,
  department:department_id (
    name
  ),
  position:position_id (
    title
  ),
  manager:manager_id (
    first_name,
    last_name
  ),
  employment_type,
  status,
  hire_date
`)) as { data: EmployeesRecordRaw[]; error: any };

  if (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }
  console.log(data.map(mapEmployeesRecord));
  return data.map(mapEmployeesRecord);
}
