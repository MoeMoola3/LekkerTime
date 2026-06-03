import { EmployeesRecord, EmployeesRecordRaw } from "../../types/employees";

export function mapEmployeesRecord(raw: EmployeesRecordRaw): EmployeesRecord {
  return {
    id: raw.id,
    employee_number: raw.employee_number,
    first_name: raw.first_name,
    last_name: raw.last_name,
    email: raw.email,
    phone: raw.phone,
    employment_type: raw.employment_type,
    department: raw.department.name,
    position: raw.position.title,
    manager: raw.manager
      ? `${raw.manager?.first_name} ${raw.manager?.last_name}`
      : "-",
    status: raw.status,
    hire_date: raw.hire_date,
  };
}
