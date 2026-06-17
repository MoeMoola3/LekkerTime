import { AlertTriangle, Download } from "lucide-react";
import { SearchInput } from "./ui/SearchInput";
import { Th } from "./ui/Th";
import { formatCurrency } from "../../utils/payroll";
import type {
  PayrollEmployee,
  PayCalculationMap,
  VarianceAlert,
} from "../../types/payroll";

// ── Variance Alerts ───────────────────────────────────────────────────────────

interface VarianceAlertsProps {
  alerts: VarianceAlert[];
}

function VarianceAlerts({ alerts }: VarianceAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="text-[#B07A0C] flex-shrink-0 mt-0.5"
          size={18}
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#1B2B42]">
            {alerts.length} variance {alerts.length === 1 ? "alert" : "alerts"}{" "}
            this period
          </p>
          <p className="text-xs text-[#5A6B7F] mt-0.5">
            Employees whose pay differs from their average by 15% or more.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {alerts.map(({ employee, delta }) => (
              <span
                key={employee.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-200 text-xs"
              >
                <span className="font-medium text-[#1B2B42]">
                  {employee.name}
                </span>
                <span
                  className={delta >= 0 ? "text-green-700" : "text-red-700"}
                >
                  {delta >= 0 ? "+" : ""}
                  {delta.toFixed(1)}%
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Employee Pay Row ──────────────────────────────────────────────────────────

interface EmployeePayRowProps {
  employee: PayrollEmployee;
  calculation: PayCalculationMap[string];
  isEvenRow: boolean;
  payRunOpen: boolean;
}

function EmployeePayRow({
  employee,
  calculation,
  isEvenRow,
  payRunOpen,
}: EmployeePayRowProps) {
  const differentials =
    calculation.nightDiffPay +
    calculation.weekendDiffPay +
    calculation.holidayDiffPay;

  return (
    <tr
      className={`hover:bg-gray-50/80 transition-colors ${
        isEvenRow ? "bg-white" : "bg-gray-50/30"
      }`}
    >
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
        {formatCurrency(employee.hourlyRate)}/h
      </td>
      <td className="py-3 px-4 text-sm text-[#5A6B7F] text-right">
        {employee.actualHours}h
      </td>
      <td className="py-3 px-4 text-sm text-right">
        {calculation.overtimeHours > 0 ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs">
            {calculation.overtimeHours.toFixed(1)}h
          </span>
        ) : (
          <span className="text-[#5A6B7F]">—</span>
        )}
      </td>
      <td className="py-3 px-4 text-sm text-[#5A6B7F] text-right">
        {differentials > 0 ? formatCurrency(differentials) : "—"}
      </td>
      <td className="py-3 px-4 text-sm font-semibold text-[#1B2B42] text-right">
        {formatCurrency(calculation.gross)}
      </td>
      <td className="py-3 px-4 text-sm text-red-700 text-right">
        −{formatCurrency(calculation.deductionTotal)}
      </td>
      <td className="py-3 px-4 text-sm font-bold text-[#1B2B42] text-right">
        {formatCurrency(calculation.net)}
      </td>
      <td className="py-3 px-4 text-right">
        <button
          disabled={!payRunOpen}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[#1B2B42] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={13} />
          Payslip
        </button>
      </td>
    </tr>
  );
}

// ── Pay Run Tab ───────────────────────────────────────────────────────────────

interface PayRunTabProps {
  employees: PayrollEmployee[];
  calculations: PayCalculationMap;
  search: string;
  onSearchChange: (value: string) => void;
  variances: VarianceAlert[];
  payRunOpen: boolean;
}

export function PayRunTab({
  employees,
  calculations,
  search,
  onSearchChange,
  variances,
  payRunOpen,
}: PayRunTabProps) {
  return (
    <div className="space-y-6">
      <VarianceAlerts alerts={variances} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#1B2B42]">
            Employee Pay Breakdown
          </h3>
          <p className="text-xs text-[#5A6B7F] mt-0.5">
            {employees.length} employees in this pay run
          </p>
        </div>
        <SearchInput value={search} onChange={onSearchChange} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100">
              <Th>Employee</Th>
              <Th>Department</Th>
              <Th className="text-right">Rate</Th>
              <Th className="text-right">Hours</Th>
              <Th className="text-right">OT</Th>
              <Th className="text-right">Differentials</Th>
              <Th className="text-right">Gross</Th>
              <Th className="text-right">Deductions</Th>
              <Th className="text-right">Net</Th>
              <Th className="text-right">Payslip</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="py-12 text-center text-sm text-[#5A6B7F]"
                >
                  No employees match your search.
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <EmployeePayRow
                  key={employee.id}
                  employee={employee}
                  calculation={calculations[employee.id]}
                  isEvenRow={index % 2 === 0}
                  payRunOpen={payRunOpen}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
