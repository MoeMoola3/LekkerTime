// ─────────────────────────────────────────────────────────────────────────────
// Payroll — Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Number of regular hours per pay period before overtime applies. */
const STANDARD_HOURS_PER_PERIOD = 80;

/** Overtime hours are paid at this multiple of the base hourly rate. */
const OVERTIME_MULTIPLIER = 1.5;

/** Night-shift pay is this multiple of the base rate (15% premium). */
const NIGHT_DIFFERENTIAL = 1.15;

/** Weekend pay is this multiple of the base rate (25% premium). */
const WEEKEND_DIFFERENTIAL = 1.25;

/** Public holiday pay is this multiple of the base rate (100% premium). */
const HOLIDAY_DIFFERENTIAL = 2.0;

/** Variance alerts are raised when gross pay deviates by this % from the average. */
const VARIANCE_ALERT_THRESHOLD = 15;

// ─────────────────────────────────────────────────────────────────────────────
// Payroll — Utilities
// ─────────────────────────────────────────────────────────────────────────────

import type {
  PayrollEmployee,
  PayCalculation,
  PayCalculationMap,
  PayTotals,
  VarianceAlert,
  DepartmentCost,
  PayPeriod,
} from "../types/payroll";

// ── Pay calculation ───────────────────────────────────────────────────────────

export function calculatePay(employee: PayrollEmployee): PayCalculation {
  const regularHours = Math.min(
    employee.actualHours,
    STANDARD_HOURS_PER_PERIOD,
  );
  const overtimeHours = Math.max(
    0,
    employee.actualHours - STANDARD_HOURS_PER_PERIOD,
  );

  const regularPay = regularHours * employee.hourlyRate;
  const overtimePay = overtimeHours * employee.hourlyRate * OVERTIME_MULTIPLIER;
  const nightDiffPay =
    employee.nightHours * employee.hourlyRate * (NIGHT_DIFFERENTIAL - 1);
  const weekendDiffPay =
    employee.weekendHours * employee.hourlyRate * (WEEKEND_DIFFERENTIAL - 1);
  const holidayDiffPay =
    employee.holidayHours * employee.hourlyRate * (HOLIDAY_DIFFERENTIAL - 1);

  const gross =
    regularPay + overtimePay + nightDiffPay + weekendDiffPay + holidayDiffPay;

  const deductionTotal = employee.deductions.reduce((total, deduction) => {
    const amount = deduction.isPercentage
      ? (gross * deduction.amount) / 100
      : deduction.amount;
    return total + amount;
  }, 0);

  return {
    regularPay,
    overtimePay,
    nightDiffPay,
    weekendDiffPay,
    holidayDiffPay,
    gross,
    deductionTotal,
    net: gross - deductionTotal,
    overtimeHours,
  };
}

export function buildCalculationMap(
  employees: PayrollEmployee[],
): PayCalculationMap {
  return Object.fromEntries(employees.map((e) => [e.id, calculatePay(e)]));
}

// ── Derived summaries ─────────────────────────────────────────────────────────

export function computeTotals(calculations: PayCalculationMap): PayTotals {
  const values = Object.values(calculations);
  return {
    gross: values.reduce((sum, c) => sum + c.gross, 0),
    net: values.reduce((sum, c) => sum + c.net, 0),
    deductions: values.reduce((sum, c) => sum + c.deductionTotal, 0),
    overtimeHours: values.reduce((sum, c) => sum + c.overtimeHours, 0),
  };
}

export function computeVarianceAlerts(
  employees: PayrollEmployee[],
  calculations: PayCalculationMap,
): VarianceAlert[] {
  return employees
    .map((employee) => {
      const currentGross = calculations[employee.id].gross;
      const delta =
        employee.avgPay > 0
          ? ((currentGross - employee.avgPay) / employee.avgPay) * 100
          : 0;
      return { employee, delta, currentGross };
    })
    .filter((alert) => Math.abs(alert.delta) >= VARIANCE_ALERT_THRESHOLD);
}

export function computeDepartmentCosts(
  employees: PayrollEmployee[],
  calculations: PayCalculationMap,
): DepartmentCost[] {
  const grouped: Record<string, { gross: number; employeeCount: number }> = {};

  for (const employee of employees) {
    if (!grouped[employee.department]) {
      grouped[employee.department] = { gross: 0, employeeCount: 0 };
    }
    grouped[employee.department].gross += calculations[employee.id].gross;
    grouped[employee.department].employeeCount += 1;
  }

  return Object.entries(grouped)
    .map(([department, values]) => ({ department, ...values }))
    .sort((a, b) => b.gross - a.gross);
}

// ── Formatters ────────────────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 2,
  });
}

export function getPeriodLabel(period: PayPeriod): string {
  const labels: Record<PayPeriod, string> = {
    weekly: "Week of Jun 1 – Jun 7, 2026",
    "bi-weekly": "Jun 1 – Jun 14, 2026",
    monthly: "June 2026",
  };
  return labels[period];
}
