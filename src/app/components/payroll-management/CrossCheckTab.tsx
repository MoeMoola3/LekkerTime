// ─────────────────────────────────────────────────────────────────────────────
// Payroll — Hours Cross-Check Tab
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  ChevronRight,
  AlertOctagon,
  CircleAlert,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { SearchInput } from "./ui/SearchInput";
import { Th } from "./ui/Th";
import type { PayrollEmployee, DailyRecord } from "../../types/payroll";

// ── Daily Breakdown ───────────────────────────────────────────────────────────

interface DailyBreakdownProps {
  records: DailyRecord[];
}

function DailyBreakdown({ records }: DailyBreakdownProps) {
  if (records.length === 0) {
    return (
      <p className="text-sm text-[#5A6B7F] italic">
        No daily records for this period.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100">
            <Th>Date</Th>
            <Th>Scheduled Shift</Th>
            <Th>Clock In</Th>
            <Th>Clock Out</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.map((record) => {
            const isNoShow = !record.clockIn && !!record.shiftStart;
            const isMissingClockOut = !!record.clockIn && !record.clockOut;

            return (
              <tr key={record.date} className="bg-white">
                <td className="py-2.5 px-4 text-sm text-[#1B2B42]">
                  {new Date(record.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="py-2.5 px-4 text-sm text-[#5A6B7F]">
                  {record.shiftStart && record.shiftEnd
                    ? `${record.shiftStart} – ${record.shiftEnd}`
                    : "—"}
                </td>
                <td className="py-2.5 px-4 text-sm text-[#5A6B7F]">
                  {record.clockIn ?? <span className="text-red-600">—</span>}
                </td>
                <td className="py-2.5 px-4 text-sm text-[#5A6B7F]">
                  {record.clockOut ?? <span className="text-amber-600">—</span>}
                </td>
                <td className="py-2.5 px-4">
                  {isNoShow ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs">
                      <XCircle size={11} /> No-show
                    </span>
                  ) : isMissingClockOut ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs">
                      <CircleAlert size={11} /> Unresolved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-green-700">
                      <CheckCircle2 size={11} /> OK
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Employee Attendance Row ───────────────────────────────────────────────────

interface AttendanceRowProps {
  employee: PayrollEmployee;
  isEvenRow: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function AttendanceRow({
  employee,
  isEvenRow,
  isExpanded,
  onToggleExpand,
}: AttendanceRowProps) {
  const delta = employee.actualHours - employee.scheduledHours;

  return (
    <React.Fragment>
      <tr
        className={`hover:bg-gray-50/80 transition-colors ${
          isEvenRow ? "bg-white" : "bg-gray-50/30"
        }`}
      >
        <td className="py-3 px-4 w-10">
          <button
            onClick={onToggleExpand}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <ChevronRight
              size={16}
              className={`text-[#5A6B7F] transition-transform ${isExpanded ? "rotate-90" : ""}`}
            />
          </button>
        </td>
        <td className="py-3 px-4">
          <p className="text-sm font-medium text-[#1B2B42]">{employee.name}</p>
          <p className="text-xs text-[#5A6B7F] font-mono">{employee.id}</p>
        </td>
        <td className="py-3 px-4">
          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
            {employee.department}
          </span>
        </td>
        <td className="py-3 px-4 text-sm text-[#5A6B7F] text-right">
          {employee.scheduledHours}h
        </td>
        <td className="py-3 px-4 text-sm text-[#5A6B7F] text-right">
          {employee.actualHours}h
        </td>
        <td className="py-3 px-4 text-sm text-right">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${
              delta === 0
                ? "bg-gray-50 text-gray-600 border-gray-200"
                : delta > 0
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {delta > 0 ? "+" : ""}
            {delta}h
          </span>
        </td>
        <td className="py-3 px-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {employee.awol && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs">
                <AlertOctagon size={11} /> AWOL
              </span>
            )}
            {employee.hasMissingClockOut && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs">
                <CircleAlert size={11} /> Missing clock-out
              </span>
            )}
            {!employee.awol && !employee.hasMissingClockOut && (
              <span className="inline-flex items-center gap-1 text-xs text-green-700">
                <CheckCircle2 size={12} /> Clean
              </span>
            )}
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-gray-50/40">
          <td colSpan={7} className="px-4 py-4">
            <DailyBreakdown records={employee.dailyRecords} />
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

// ── Cross-Check Tab ───────────────────────────────────────────────────────────

interface CrossCheckTabProps {
  employees: PayrollEmployee[];
  search: string;
  onSearchChange: (value: string) => void;
  expandedEmployeeId: string | null;
  onToggleExpand: (id: string | null) => void;
}

export function CrossCheckTab({
  employees,
  search,
  onSearchChange,
  expandedEmployeeId,
  onToggleExpand,
}: CrossCheckTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#1B2B42]">
            Scheduled vs Actual Hours
          </h3>
          <p className="text-xs text-[#5A6B7F] mt-0.5">
            Compare planned shifts to attendance records. Expand a row for a
            day-by-day view.
          </p>
        </div>
        <SearchInput value={search} onChange={onSearchChange} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100">
              <Th />
              <Th>Employee</Th>
              <Th>Department</Th>
              <Th className="text-right">Scheduled</Th>
              <Th className="text-right">Actual</Th>
              <Th className="text-right">Delta</Th>
              <Th>Flags</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map((employee, index) => (
              <AttendanceRow
                key={employee.id}
                employee={employee}
                isEvenRow={index % 2 === 0}
                isExpanded={expandedEmployeeId === employee.id}
                onToggleExpand={() =>
                  onToggleExpand(
                    expandedEmployeeId === employee.id ? null : employee.id,
                  )
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
