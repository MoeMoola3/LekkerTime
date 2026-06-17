// ─────────────────────────────────────────────────────────────────────────────
// Payroll — Reports Tab
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Building2, Users, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "../../utils/payroll";
import type {
  PayrollEmployee,
  PayCalculationMap,
  DepartmentCost,
} from "../../types/payroll";

// ── Department Cost Bar ───────────────────────────────────────────────────────

interface DepartmentCostBarProps {
  department: DepartmentCost;
  totalGross: number;
  maxGross: number;
}

function DepartmentCostBar({
  department,
  totalGross,
  maxGross,
}: DepartmentCostBarProps) {
  const percentageOfTotal = (department.gross / totalGross) * 100;
  const barWidth = (department.gross / maxGross) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#1B2B42]">
            {department.department}
          </span>
          <span className="text-xs text-[#5A6B7F]">
            · {department.employeeCount}{" "}
            {department.employeeCount === 1 ? "employee" : "employees"}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-[#1B2B42]">
            {formatCurrency(department.gross)}
          </p>
          <p className="text-xs text-[#5A6B7F]">
            {percentageOfTotal.toFixed(1)}%
          </p>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#E8A317] rounded-full transition-all"
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
}

// ── Department Cost Card ──────────────────────────────────────────────────────

interface DepartmentCostCardProps {
  departments: DepartmentCost[];
  totalGross: number;
}

function DepartmentCostCard({
  departments,
  totalGross,
}: DepartmentCostCardProps) {
  const maxGross = Math.max(...departments.map((d) => d.gross), 1);

  return (
    <div className="rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-1">
        <Building2 size={16} className="text-[#5A6B7F]" />
        <h3 className="text-base font-semibold text-[#1B2B42]">
          Department Cost Breakdown
        </h3>
      </div>
      <p className="text-xs text-[#5A6B7F] mb-5">
        Total payroll spend grouped by department.
      </p>

      <div className="space-y-4">
        {departments.map((department) => (
          <DepartmentCostBar
            key={department.department}
            department={department}
            totalGross={totalGross}
            maxGross={maxGross}
          />
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-medium text-[#5A6B7F]">
          Total payroll spend
        </span>
        <span className="text-lg font-bold text-[#1B2B42]">
          {formatCurrency(totalGross)}
        </span>
      </div>
    </div>
  );
}

// ── Pending Processing Card ───────────────────────────────────────────────────

interface PendingProcessingCardProps {
  unprocessedEmployees: PayrollEmployee[];
  calculations: PayCalculationMap;
}

function PendingProcessingCard({
  unprocessedEmployees,
  calculations,
}: PendingProcessingCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-1">
        <Users size={16} className="text-[#5A6B7F]" />
        <h3 className="text-base font-semibold text-[#1B2B42]">
          Pending Processing
        </h3>
      </div>
      <p className="text-xs text-[#5A6B7F] mb-5">
        Employees with attendance logged but not yet processed for this pay
        period.
      </p>

      {unprocessedEmployees.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="mx-auto text-green-600 mb-2" size={28} />
          <p className="text-sm font-medium text-[#1B2B42]">All caught up</p>
          <p className="text-xs text-[#5A6B7F] mt-1">
            No employees pending processing.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {unprocessedEmployees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50/60 border border-gray-100"
            >
              <div>
                <p className="text-sm font-medium text-[#1B2B42]">
                  {employee.name}
                </p>
                <p className="text-xs text-[#5A6B7F]">
                  {employee.department} · {employee.actualHours}h logged
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1B2B42]">
                  {formatCurrency(calculations[employee.id].gross)}
                </span>
                <button className="px-3 py-1.5 rounded-lg bg-[#E8A317] hover:bg-[#D6960E] text-[#1B2B42] text-xs font-medium transition-colors">
                  Process
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Reports Tab ───────────────────────────────────────────────────────────────

interface ReportsTabProps {
  departments: DepartmentCost[];
  totalGross: number;
  unprocessedEmployees: PayrollEmployee[];
  calculations: PayCalculationMap;
}

export function ReportsTab({
  departments,
  totalGross,
  unprocessedEmployees,
  calculations,
}: ReportsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DepartmentCostCard departments={departments} totalGross={totalGross} />
      <PendingProcessingCard
        unprocessedEmployees={unprocessedEmployees}
        calculations={calculations}
      />
    </div>
  );
}
