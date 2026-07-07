import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { AttendanceRosterPage } from "./pages/AttendanceRosterPage";
import { EmployeesPage } from "./pages/ EmployeesPage";
import { ShiftManagementPage } from "./pages/ShiftManagementPage";
import PayrollManagementPage from "./pages/PayrollManagementPage";
import DashboardPage from "./pages/DashboardPage";

// Placeholder component for other routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 flex items-center justify-center h-full">
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-[#1B2B42]">{title} Page</h2>
      <p className="text-[#5A6B7F]">
        This module is currently under construction.
      </p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "attendance", Component: AttendanceRosterPage },
      { path: "payroll", Component: PayrollManagementPage },
      { path: "shifts", Component: ShiftManagementPage },
      { path: "leave", element: <Placeholder title="Leave Management" /> },
      { path: "employees", Component: EmployeesPage },
      { path: "*", element: <Placeholder title="Not Found" /> },
    ],
  },
]);
