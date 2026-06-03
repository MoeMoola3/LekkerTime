export interface EmployeesRecordRaw {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  employment_type: string;
  status: string;
  hire_date: string;
  department: {
    name: string;
  };
  position: {
    title: string;
  };
  manager: {
    first_name: string;
    last_name: string;
  } | null;
}

export interface EmployeesRecord {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  employment_type: string;
  status: string;
  hire_date: string;
  department: string;
  position: string;
  manager: string;
}
