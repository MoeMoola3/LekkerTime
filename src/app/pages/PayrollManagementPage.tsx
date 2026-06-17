// ─────────────────────────────────────────────────────────────────────────────
// Payroll — Page
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Clock,
  DollarSign,
  FileText,
  Lock,
  Settings,
  TrendingDown,
  TrendingUp,
  Unlock,
} from "lucide-react";

import { Kpi } from "../components/payroll-management/ui/KPI";
import { TabButton } from "../components/payroll-management/ui/TabButton";
import { PayRunTab } from "../components/payroll-management/PayRunTab";
import { CrossCheckTab } from "../components/payroll-management/CrossCheckTab";
import { DeductionsTab } from "../components/payroll-management/DeductionsTab";
import { ReportsTab } from "../components/payroll-management/ReportsTab";
import { MOCK_EMPLOYEES } from "../api/mock/payroll";
import {
  buildCalculationMap,
  computeTotals,
  computeVarianceAlerts,
  computeDepartmentCosts,
  formatCurrency,
  getPeriodLabel,
} from "../utils/payroll";
import type {
  ActiveTab,
  Deduction,
  PayPeriod,
  PayrollEmployee,
} from "../types/payroll";

export function PayrollManagementPage() {
  // ── State ───────────────────────────────────────────────────────────────────

  const [employees, setEmployees] = useState<PayrollEmployee[]>(MOCK_EMPLOYEES);
  const [activeTab, setActiveTab] = useState<ActiveTab>("pay-run");
  const [payPeriod, setPayPeriod] = useState<PayPeriod>("bi-weekly");
  const [isPayRunOpen, setIsPayRunOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(
    null,
  );
  const [selectedDeductionEmployeeId, setSelectedDeductionEmployeeId] =
    useState(MOCK_EMPLOYEES[0].id);

  // ── Derived data ────────────────────────────────────────────────────────────

  const calculations = useMemo(
    () => buildCalculationMap(employees),
    [employees],
  );

  const totals = useMemo(() => computeTotals(calculations), [calculations]);

  const variances = useMemo(
    () => computeVarianceAlerts(employees, calculations),
    [employees, calculations],
  );

  const departments = useMemo(
    () => computeDepartmentCosts(employees, calculations),
    [employees, calculations],
  );

  const filteredEmployees = useMemo(
    () =>
      employees.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.id.toLowerCase().includes(search.toLowerCase()) ||
          e.department.toLowerCase().includes(search.toLowerCase()),
      ),
    [employees, search],
  );

  const unprocessedEmployees = useMemo(
    () => employees.filter((e) => !e.processed && e.actualHours > 0),
    [employees],
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleUpdateDeductions(employeeId: string, deductions: Deduction[]) {
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, deductions } : e)),
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 space-y-8">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1B2B42] tracking-tight">
            Payroll Management
          </h1>
          <p className="text-[#5A6B7F] mt-2 text-base font-medium tracking-wide">
            Run payroll, reconcile hours, and manage deductions across your
            organisation
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="relative">
            <Calendar
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={payPeriod}
              onChange={(e) => setPayPeriod(e.target.value as PayPeriod)}
              className="appearance-none bg-white border border-gray-200 text-[#1B2B42] text-sm rounded-lg pl-9 pr-9 py-2 outline-none focus:ring-2 focus:ring-[#E8A317] cursor-pointer hover:bg-gray-50"
            >
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <ChevronDown
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          {/* Open / close pay run */}
          <button
            onClick={() => setIsPayRunOpen((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              isPayRunOpen
                ? "bg-[#E8A317] hover:bg-[#D6960E] text-[#1B2B42] shadow-[0_2px_8px_rgba(232,163,23,0.3)]"
                : "bg-[#1B2B42] hover:bg-[#2A4266] text-white"
            }`}
          >
            {isPayRunOpen ? <Unlock size={16} /> : <Lock size={16} />}
            {isPayRunOpen ? "Close Pay Run" : "Open Pay Run"}
          </button>
        </div>
      </div>

      {/* ── Period Banner + KPIs ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B2B42] flex items-center justify-center">
              <Calendar size={18} className="text-[#E8A317]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#5A6B7F]">
                Current Pay Period
              </p>
              <p className="text-base font-semibold text-[#1B2B42]">
                {getPeriodLabel(payPeriod)}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border ${
              isPayRunOpen
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isPayRunOpen ? "bg-green-500" : "bg-gray-400"}`}
            />
            {isPayRunOpen ? "Open" : "Closed"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Kpi
            label="Gross Payroll"
            value={formatCurrency(totals.gross)}
            icon={<DollarSign size={16} />}
            accent
          />
          <Kpi
            label="Total Deductions"
            value={formatCurrency(totals.deductions)}
            icon={<TrendingDown size={16} />}
          />
          <Kpi
            label="Net Payout"
            value={formatCurrency(totals.net)}
            icon={<TrendingUp size={16} />}
          />
          <Kpi
            label="Overtime Hours"
            value={`${totals.overtimeHours.toFixed(1)}h`}
            icon={<Clock size={16} />}
          />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="border-b border-gray-100 flex items-center gap-1 px-3 overflow-x-auto">
          <TabButton
            active={activeTab === "pay-run"}
            onClick={() => setActiveTab("pay-run")}
            icon={<DollarSign size={15} />}
          >
            Pay Run
          </TabButton>
          <TabButton
            active={activeTab === "cross-check"}
            onClick={() => setActiveTab("cross-check")}
            icon={<Clock size={15} />}
          >
            Hours Cross-Check
          </TabButton>
          <TabButton
            active={activeTab === "deductions"}
            onClick={() => setActiveTab("deductions")}
            icon={<Settings size={15} />}
          >
            Deductions
          </TabButton>
          <TabButton
            active={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
            icon={<FileText size={15} />}
          >
            Reports
          </TabButton>
        </div>

        <div className="p-6">
          {activeTab === "pay-run" && (
            <PayRunTab
              employees={filteredEmployees}
              calculations={calculations}
              search={search}
              onSearchChange={setSearch}
              variances={variances}
              payRunOpen={isPayRunOpen}
            />
          )}
          {activeTab === "cross-check" && (
            <CrossCheckTab
              employees={filteredEmployees}
              search={search}
              onSearchChange={setSearch}
              expandedEmployeeId={expandedEmployeeId}
              onToggleExpand={setExpandedEmployeeId}
            />
          )}
          {activeTab === "deductions" && (
            <DeductionsTab
              employees={employees}
              selectedEmployeeId={selectedDeductionEmployeeId}
              onSelectEmployee={setSelectedDeductionEmployeeId}
              onUpdateDeductions={handleUpdateDeductions}
            />
          )}
          {activeTab === "reports" && (
            <ReportsTab
              departments={departments}
              totalGross={totals.gross}
              unprocessedEmployees={unprocessedEmployees}
              calculations={calculations}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PayrollManagementPage;
