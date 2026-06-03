import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEmployeesRecords } from "../api/queries/employees";

export function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const {
    data: rows = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["employees-records"],
    queryFn: fetchEmployeesRecords,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const departments = [
    "All",
    ...Array.from(new Set(rows.map((emp) => emp.department))),
  ];

  const filteredEmployees = rows.filter((emp) => {
    const matchesSearch =
      emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "All" || emp.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1B2B42] tracking-tight">
            Employee Directory
          </h1>
          <p className="text-[#5A6B7F] mt-2 text-base font-medium tracking-wide">
            Manage your team members and their information
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#1B2B42] hover:bg-[#2A4266] text-white px-4 py-2 rounded-lg transition-colors">
          <UserPlus size={18} />
          Add Employee
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1B2B42]">
              All Employees
            </h2>
            <p className="text-xs text-[#5A6B7F] mt-0.5">
              Showing {filteredEmployees.length} of {rows.length} employees
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Department Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={15}
              />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-[#1B2B42] text-sm rounded-lg pl-9 pr-9 py-2 outline-none focus:ring-2 focus:ring-[#E8A317] focus:border-transparent transition-shadow cursor-pointer hover:bg-gray-50"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "All" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-56 focus:w-72 transition-all duration-300 outline-none focus:ring-2 focus:ring-[#E8A317] focus:border-transparent placeholder:text-gray-400 text-[#1B2B42]"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Emp. Number
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  First Name
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Last Name
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Phone
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Department
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Position
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Manager
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Employment
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Hire Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="py-12 text-center text-sm text-[#5A6B7F]"
                  >
                    No employees found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, index) => (
                  <tr
                    key={emp.id}
                    className={`hover:bg-gray-50/80 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                  >
                    <td className="py-3 px-5 text-sm text-[#5A6B7F] whitespace-nowrap font-mono">
                      {emp.employee_number}
                    </td>
                    <td className="py-3 px-5 text-sm text-[#5A6B7F] whitespace-nowrap">
                      {emp.first_name}
                    </td>
                    <td className="py-3 px-5 text-sm text-[#5A6B7F] whitespace-nowrap">
                      {emp.last_name}
                    </td>
                    <td className="py-3 px-5 text-sm text-[#5A6B7F] whitespace-nowrap">
                      {emp.email}
                    </td>
                    <td className="py-3 px-5 text-sm text-[#5A6B7F] whitespace-nowrap">
                      {emp.phone}
                    </td>
                    <td className="py-3 px-5 text-sm text-[#5A6B7F] whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                        {emp.department}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-sm text-[#5A6B7F] whitespace-nowrap">
                      {emp.position}
                    </td>
                    <td className="py-3 px-5 text-sm text-[#5A6B7F] whitespace-nowrap">
                      {emp.manager}
                    </td>
                    <td className="py-3 px-5 text-sm text-[#5A6B7F] whitespace-nowrap">
                      {emp.employment_type}
                    </td>
                    <td className="py-3 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${
                          emp.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : emp.status === "On Leave"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-sm text-[#5A6B7F] whitespace-nowrap">
                      {new Date(emp.hire_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-end">
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8A317]"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-[#E8A317] text-[#1B2B42] shadow-[0_2px_8px_rgba(232,163,23,0.25)] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#E8A317]">
              1
            </button>
            <button
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8A317]"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
