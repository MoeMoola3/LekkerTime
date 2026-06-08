import { useState } from "react";
import {
  Search,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  Timer,
  CalendarOff,
} from "lucide-react";
import { fetchAttendanceRecords } from "../api/queries/attendance";
import { useQuery } from "@tanstack/react-query";
import { formatDailyTotal, formatTimeDiff } from "../utils/formatters/time";
import { formatRosterDate } from "../utils/formatters/date";

// Mock Data
const kpiData = [
  {
    id: 1,
    label: "Employees Clocked In",
    value: "12/25",
    icon: Users,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    id: 2,
    label: "Late Arrivals",
    value: "3",
    icon: Clock,
    color: "text-red-600",
    bg: "bg-red-100",
  },
  {
    id: 3,
    label: "Total Hours Worked",
    value: "864h",
    icon: Timer,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    id: 4,
    label: "Employees Off Today",
    value: "4",
    icon: CalendarOff,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
];

export function AttendanceRosterPage() {
  const {
    data: rows = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["attendance-records"],
    queryFn: fetchAttendanceRecords,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const [searchTerm, setSearchTerm] = useState("");

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-[#1B2B42] tracking-tight">
          Attendance Roster
        </h1>
        <p className="text-[#5A6B7F] mt-2 text-base font-medium tracking-wide">
          Monitor employee attendance and shift activity
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <div
            key={kpi.id}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <span className="text-[#5A6B7F] text-sm font-medium">
                {kpi.label}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${kpi.bg}`}
              >
                <kpi.icon size={16} className={kpi.color} />
              </div>
            </div>
            <div
              className={`mt-4 text-3xl font-bold tracking-tight ${index === 0 ? "text-[#1B2B42]" : "text-[#1B2B42]"}`}
            >
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1B2B42]">
              Attendance Records
            </h2>
            <p className="text-xs text-[#5A6B7F] mt-0.5">
              Showing 10 of 124 records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <select className="appearance-none bg-white border border-gray-200 text-[#1B2B42] text-sm rounded-lg pl-4 pr-10 py-2 outline-none focus:ring-2 focus:ring-[#E8A317] focus:border-transparent transition-shadow cursor-pointer font-medium hover:bg-gray-50">
                <option>Sales</option>
                <option>Management</option>
                <option>Accounting</option>
                <option>Admin</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative group">
              <select className="appearance-none bg-white border border-gray-200 text-[#1B2B42] text-sm rounded-lg pl-4 pr-10 py-2 outline-none focus:ring-2 focus:ring-[#E8A317] focus:border-transparent transition-shadow cursor-pointer font-medium hover:bg-gray-50">
                <option>Today</option>
                {/* <option>Last 7 Days</option> */}
                <option>Last 30 Days</option>
                <option>This Month</option>
                <option>Previous Month</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-48 focus:w-64 transition-all duration-300 outline-none focus:ring-2 focus:ring-[#E8A317] focus:border-transparent placeholder:text-gray-400 text-[#1B2B42]"
              />
            </div>

            {/* Export Button */}
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-[#1B2B42] hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8A317] focus:border-transparent">
              <Download size={16} className="text-gray-500" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Name
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Department
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Clock-In
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Clock-Out
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Daily Total
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap">
                  Scheduled
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap text-right">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-100/80 transition-colors ${index % 2 === 0 ? "bg-gray-300/50" : "bg-white"}`}
                >
                  <td className="py-3 px-5 text-sm text-[#5A6B7F] whitespace-nowrap">
                    {formatRosterDate(row.date)}
                  </td>
                  <td className="py-3 px-5 text-sm font-medium text-[#1B2B42] whitespace-nowrap">
                    {row.name}
                  </td>
                  <td className="py-3 px-5 text-sm text-[#5A6B7F] whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                      {row.department}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-sm text-[#1B2B42] whitespace-nowrap">
                    {new Date(row.clockIn).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-5 text-sm text-[#1B2B42] whitespace-nowrap">
                    {new Date(row.clockOut).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-5 text-sm font-medium text-[#1B2B42] whitespace-nowrap">
                    {formatDailyTotal(row.dailyTotal)}
                  </td>
                  <td className="py-3 px-5 text-sm text-[#5A6B7F] whitespace-nowrap">
                    {row.scheduled.slice(0, 5)}
                  </td>
                  <td
                    className={`py-3 px-5 text-sm font-medium text-right whitespace-nowrap ${
                      row.diffType === "positive"
                        ? "text-emerald-600"
                        : row.diffType === "negative"
                          ? "text-red-600"
                          : "text-slate-500"
                    }`}
                  >
                    {formatTimeDiff(row.diff)}
                  </td>
                </tr>
              ))}
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

            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium bg-[#E8A317] text-[#1B2B42] shadow-[0_2px_8px_rgba(232,163,23,0.25)] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#E8A317]">
              1
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium text-[#5A6B7F] hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8A317]">
              2
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium text-[#5A6B7F] hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8A317]">
              3
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-sm text-gray-400">
              ...
            </span>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium text-[#5A6B7F] hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8A317]">
              12
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
