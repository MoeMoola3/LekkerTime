// ─────────────────────────────────────────────────────────────────────────────
// Payroll — Types
// ─────────────────────────────────────────────────────────────────────────────

export type DeductionType =
  | "Tax (PAYE)"
  | "Pension"
  | "Medical Aid"
  | "UIF"
  | "Other";

export type PayPeriod = "weekly" | "bi-weekly" | "monthly";

export type ActiveTab = "pay-run" | "cross-check" | "deductions" | "reports";

// ── Domain models ─────────────────────────────────────────────────────────────

export interface Deduction {
  id: string;
  type: DeductionType;
  /** Monetary (ZAR) or percentage value, depending on `isPercentage`. */
  amount: number;
  isPercentage?: boolean;
}

export interface DailyRecord {
  date: string;
  shiftStart: string | null;
  shiftEnd: string | null;
  clockIn: string | null;
  clockOut: string | null;
}

export interface PayrollEmployee {
  id: string;
  name: string;
  department: string;
  position: string;
  hourlyRate: number;
  scheduledHours: number;
  actualHours: number;
  nightHours: number;
  weekendHours: number;
  holidayHours: number;
  /** Historical average gross pay — used for variance detection. */
  avgPay: number;
  deductions: Deduction[];
  processed: boolean;
  awol: boolean;
  hasMissingClockOut: boolean;
  dailyRecords: DailyRecord[];
}

// ── Derived / calculated shapes ───────────────────────────────────────────────

export interface PayCalculation {
  regularPay: number;
  overtimePay: number;
  nightDiffPay: number;
  weekendDiffPay: number;
  holidayDiffPay: number;
  gross: number;
  deductionTotal: number;
  net: number;
  overtimeHours: number;
}

export type PayCalculationMap = Record<string, PayCalculation>;

export interface PayTotals {
  gross: number;
  net: number;
  deductions: number;
  overtimeHours: number;
}

export interface VarianceAlert {
  employee: PayrollEmployee;
  /** Percentage change relative to the employee's historical average. */
  delta: number;
  currentGross: number;
}

export interface DepartmentCost {
  department: string;
  gross: number;
  employeeCount: number;
}
