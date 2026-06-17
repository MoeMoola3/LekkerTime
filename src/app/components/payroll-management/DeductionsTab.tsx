// ─────────────────────────────────────────────────────────────────────────────
// Payroll — Deductions Tab
// ─────────────────────────────────────────────────────────────────────────────

import { Plus, Trash2 } from "lucide-react";
import { Th } from "./ui/Th";
import type {
  PayrollEmployee,
  Deduction,
  DeductionType,
} from "../../types/payroll";

const DEDUCTION_TYPES: DeductionType[] = [
  "Tax (PAYE)",
  "Pension",
  "Medical Aid",
  "UIF",
  "Other",
];

// ── Employee Selector ─────────────────────────────────────────────────────────

interface EmployeeSelectorProps {
  employees: PayrollEmployee[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function EmployeeSelector({
  employees,
  selectedId,
  onSelect,
}: EmployeeSelectorProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/40 overflow-hidden">
      <div className="p-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider">
          Employees
        </p>
      </div>
      <div className="max-h-[480px] overflow-y-auto">
        {employees.map((employee) => (
          <button
            key={employee.id}
            onClick={() => onSelect(employee.id)}
            className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors ${
              employee.id === selectedId
                ? "bg-white border-l-4 border-l-[#E8A317]"
                : "hover:bg-white"
            }`}
          >
            <p className="text-sm font-medium text-[#1B2B42]">
              {employee.name}
            </p>
            <p className="text-xs text-[#5A6B7F]">
              {employee.department} · {employee.deductions.length} deductions
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Deduction Row ─────────────────────────────────────────────────────────────

interface DeductionRowProps {
  deduction: Deduction;
  onUpdate: (patch: Partial<Deduction>) => void;
  onRemove: () => void;
}

function DeductionRow({ deduction, onUpdate, onRemove }: DeductionRowProps) {
  return (
    <tr className="bg-white">
      <td className="py-2.5 px-4">
        <select
          value={deduction.type}
          onChange={(e) => onUpdate({ type: e.target.value as DeductionType })}
          className="w-full bg-white border border-gray-200 text-[#1B2B42] text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#E8A317]"
        >
          {DEDUCTION_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </td>
      <td className="py-2.5 px-4 text-right">
        <div className="inline-flex items-center gap-1">
          <input
            type="number"
            step="0.01"
            value={deduction.amount}
            onChange={(e) =>
              onUpdate({ amount: parseFloat(e.target.value) || 0 })
            }
            className="w-28 text-right border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#E8A317]"
          />
          <span className="text-sm text-[#5A6B7F]">
            {deduction.isPercentage ? "%" : "ZAR"}
          </span>
        </div>
      </td>
      <td className="py-2.5 px-4">
        <button
          onClick={() => onUpdate({ isPercentage: !deduction.isPercentage })}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            deduction.isPercentage
              ? "bg-[#FFF8EC] text-[#B07A0C] border-[#F4DCA1]"
              : "bg-gray-50 text-[#5A6B7F] border-gray-200"
          }`}
        >
          {deduction.isPercentage ? "Percentage" : "Fixed"}
        </button>
      </td>
      <td className="py-2.5 px-4 text-right">
        <button
          onClick={onRemove}
          aria-label="Remove deduction"
          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </td>
    </tr>
  );
}

// ── Deductions Tab ────────────────────────────────────────────────────────────

interface DeductionsTabProps {
  employees: PayrollEmployee[];
  selectedEmployeeId: string;
  onSelectEmployee: (id: string) => void;
  onUpdateDeductions: (employeeId: string, deductions: Deduction[]) => void;
}

export function DeductionsTab({
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  onUpdateDeductions,
}: DeductionsTabProps) {
  const selectedEmployee =
    employees.find((e) => e.id === selectedEmployeeId) ?? employees[0];

  function handleAddDeduction() {
    const newDeduction: Deduction = {
      id: `d${Date.now()}`,
      type: "Other",
      amount: 0,
      isPercentage: false,
    };
    onUpdateDeductions(selectedEmployee.id, [
      ...selectedEmployee.deductions,
      newDeduction,
    ]);
  }

  function handleUpdateDeduction(
    deductionId: string,
    patch: Partial<Deduction>,
  ) {
    const updated = selectedEmployee.deductions.map((d) =>
      d.id === deductionId ? { ...d, ...patch } : d,
    );
    onUpdateDeductions(selectedEmployee.id, updated);
  }

  function handleRemoveDeduction(deductionId: string) {
    const updated = selectedEmployee.deductions.filter(
      (d) => d.id !== deductionId,
    );
    onUpdateDeductions(selectedEmployee.id, updated);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      <EmployeeSelector
        employees={employees}
        selectedId={selectedEmployee.id}
        onSelect={onSelectEmployee}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#1B2B42]">
              Recurring Deductions — {selectedEmployee.name}
            </h3>
            <p className="text-xs text-[#5A6B7F] mt-0.5">
              Configure per-period deductions applied automatically each pay
              run.
            </p>
          </div>
          <button
            onClick={handleAddDeduction}
            className="flex items-center gap-2 bg-[#1B2B42] hover:bg-[#2A4266] text-white px-3.5 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus size={15} /> Add Deduction
          </button>
        </div>

        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-100">
                <Th>Type</Th>
                <Th className="text-right">Amount</Th>
                <Th>Mode</Th>
                <Th />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {selectedEmployee.deductions.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-sm text-[#5A6B7F]"
                  >
                    No deductions configured.
                  </td>
                </tr>
              ) : (
                selectedEmployee.deductions.map((deduction) => (
                  <DeductionRow
                    key={deduction.id}
                    deduction={deduction}
                    onUpdate={(patch) =>
                      handleUpdateDeduction(deduction.id, patch)
                    }
                    onRemove={() => handleRemoveDeduction(deduction.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
