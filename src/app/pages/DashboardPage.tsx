import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  Clock,
  CalendarOff,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CalendarDays,
  Timer,
  ShieldAlert,
  UserCheck,
  Building2,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ---------- Shared palette ----------
const NAVY = "#1B2B42";
const AMBER = "#E8A317";

// ---------- Mock data mirroring all modules ----------

// Roster — today's attendance
const ATTENDANCE = [
  {
    name: "Dwight Schrute",
    dept: "Sales",
    clockIn: "07:58",
    clockOut: null,
    scheduled: "08:00–17:00",
    status: "on-duty",
  },
  {
    name: "Jim Halpert",
    dept: "Sales",
    clockIn: "08:14",
    clockOut: null,
    scheduled: "08:00–17:00",
    status: "late",
  },
  {
    name: "Pam Beesly",
    dept: "Reception",
    clockIn: null,
    clockOut: null,
    scheduled: "08:00–17:00",
    status: "on-leave",
  },
  {
    name: "Angela Martin",
    dept: "Accounting",
    clockIn: "07:55",
    clockOut: null,
    scheduled: "08:00–17:00",
    status: "on-duty",
  },
  {
    name: "Oscar Martinez",
    dept: "Accounting",
    clockIn: "08:02",
    clockOut: null,
    scheduled: "08:00–17:00",
    status: "on-duty",
  },
  {
    name: "Kevin Malone",
    dept: "Accounting",
    clockIn: "09:10",
    clockOut: null,
    scheduled: "08:00–17:00",
    status: "late",
  },
  {
    name: "Kelly Kapoor",
    dept: "Customer Svc",
    clockIn: "08:00",
    clockOut: null,
    scheduled: "08:00–17:00",
    status: "on-duty",
  },
  {
    name: "Toby Flenderson",
    dept: "HR",
    clockIn: "08:05",
    clockOut: null,
    scheduled: "08:00–17:00",
    status: "on-duty",
  },
  {
    name: "Stanley Hudson",
    dept: "Sales",
    clockIn: null,
    clockOut: null,
    scheduled: "08:00–17:00",
    status: "absent",
  },
  {
    name: "Phyllis Vance",
    dept: "Sales",
    clockIn: "08:01",
    clockOut: null,
    scheduled: "08:00–17:00",
    status: "on-duty",
  },
  {
    name: "Ryan Howard",
    dept: "IT",
    clockIn: "10:30",
    clockOut: null,
    scheduled: "09:00–18:00",
    status: "late",
  },
  {
    name: "Meredith Palmer",
    dept: "Procurement",
    clockIn: null,
    clockOut: null,
    scheduled: "08:00–17:00",
    status: "on-leave",
  },
  {
    name: "Creed Bratton",
    dept: "QA",
    clockIn: "08:00",
    clockOut: null,
    scheduled: "08:00–17:00",
    status: "on-duty",
  },
  {
    name: "Andy Bernard",
    dept: "Sales",
    clockIn: "07:50",
    clockOut: null,
    scheduled: "08:00–17:00",
    status: "on-duty",
  },
];

// Shifts — today
const TODAY_SHIFTS = [
  {
    employee: "Dwight Schrute",
    dept: "Sales",
    start: "08:00",
    end: "17:00",
    location: "Floor A",
    status: "published",
  },
  {
    employee: "Jim Halpert",
    dept: "Sales",
    start: "08:00",
    end: "17:00",
    location: "Floor A",
    status: "published",
  },
  {
    employee: "Angela Martin",
    dept: "Accounting",
    start: "08:00",
    end: "17:00",
    location: "Floor B",
    status: "published",
  },
  {
    employee: "Oscar Martinez",
    dept: "Accounting",
    start: "08:00",
    end: "17:00",
    location: "Floor B",
    status: "published",
  },
  {
    employee: "Kevin Malone",
    dept: "Accounting",
    start: "08:00",
    end: "17:00",
    location: "Floor B",
    status: "draft",
  },
  {
    employee: "Creed Bratton",
    dept: "QA",
    start: "22:00",
    end: "06:00",
    location: "QA Lab",
    status: "published",
  },
  {
    employee: "Ryan Howard",
    dept: "IT",
    start: "09:00",
    end: "18:00",
    location: "Remote",
    status: "published",
  },
  {
    employee: "Andy Bernard",
    dept: "Sales",
    start: "08:00",
    end: "17:00",
    location: "Floor A",
    status: "draft",
  },
];

// Leave — active & pending
const LEAVE_REQUESTS = [
  {
    name: "Oscar Martinez",
    dept: "Accounting",
    type: "Study",
    start: "17 Jun",
    end: "21 Jun",
    days: 5,
    status: "pending",
  },
  {
    name: "Kevin Malone",
    dept: "Accounting",
    type: "Annual",
    start: "1 Jul",
    end: "5 Jul",
    days: 5,
    status: "pending",
  },
  {
    name: "Dwight Schrute",
    dept: "Sales",
    type: "Annual",
    start: "5 Aug",
    end: "9 Aug",
    days: 5,
    status: "pending",
  },
  {
    name: "Creed Bratton",
    dept: "QA",
    type: "Unpaid",
    start: "8 Jul",
    end: "12 Jul",
    days: 5,
    status: "pending",
  },
  {
    name: "Pam Beesly",
    dept: "Reception",
    type: "Maternity/Paternity",
    start: "15 Jul",
    end: "15 Oct",
    days: 63,
    status: "approved",
  },
  {
    name: "Meredith Palmer",
    dept: "Procurement",
    type: "Sick",
    start: "3 Jun",
    end: "4 Jun",
    days: 2,
    status: "approved",
  },
];

// Payroll — current period summary
const PAYROLL_EMPLOYEES = [
  {
    name: "Dwight Schrute",
    dept: "Sales",
    gross: 7640,
    net: 5580,
    status: "pending",
  },
  {
    name: "Jim Halpert",
    dept: "Sales",
    gross: 6800,
    net: 4980,
    status: "processed",
  },
  {
    name: "Angela Martin",
    dept: "Accounting",
    gross: 8100,
    net: 5710,
    status: "processed",
  },
  {
    name: "Oscar Martinez",
    dept: "Accounting",
    gross: 7920,
    net: 5550,
    status: "pending",
  },
  {
    name: "Kevin Malone",
    dept: "Accounting",
    gross: 5800,
    net: 4200,
    status: "pending",
  },
  {
    name: "Kelly Kapoor",
    dept: "Cust. Svc",
    gross: 5200,
    net: 3860,
    status: "processed",
  },
  {
    name: "Toby Flenderson",
    dept: "HR",
    gross: 6100,
    net: 4400,
    status: "processed",
  },
  {
    name: "Stanley Hudson",
    dept: "Sales",
    gross: 6600,
    net: 4720,
    status: "awol",
  },
  {
    name: "Ryan Howard",
    dept: "IT",
    gross: 6900,
    net: 4940,
    status: "pending",
  },
  {
    name: "Meredith Palmer",
    dept: "Procurement",
    gross: 5500,
    net: 3940,
    status: "processed",
  },
  {
    name: "Creed Bratton",
    dept: "QA",
    gross: 4900,
    net: 3580,
    status: "pending",
  },
  {
    name: "Andy Bernard",
    dept: "Sales",
    gross: 6300,
    net: 4550,
    status: "processed",
  },
  {
    name: "Phyllis Vance",
    dept: "Sales",
    gross: 6400,
    net: 4610,
    status: "processed",
  },
  {
    name: "Pam Beesly",
    dept: "Reception",
    gross: 5600,
    net: 4060,
    status: "processed",
  },
];

// Department weekly hours data for bar chart
const DEPT_HOURS = [
  { dept: "Sales", scheduled: 200, actual: 187 },
  { dept: "Accounting", scheduled: 120, actual: 114 },
  { dept: "IT", scheduled: 40, actual: 36 },
  { dept: "HR", scheduled: 40, actual: 40 },
  { dept: "Procurement", scheduled: 40, actual: 30 },
  { dept: "QA", scheduled: 40, actual: 42 },
];

// Leave type distribution for pie
const LEAVE_TYPE_DATA = [
  { name: "Annual", value: 15, color: "#3B82F6" },
  { name: "Sick", value: 22, color: "#EF4444" },
  { name: "Study", value: 5, color: "#8B5CF6" },
  { name: "Maternity", value: 63, color: "#EC4899" },
  { name: "Unpaid", value: 5, color: "#9CA3AF" },
  { name: "Family", value: 4, color: AMBER },
];

// Payroll processing pie
const PAYROLL_PIE = [
  {
    name: "Processed",
    value: PAYROLL_EMPLOYEES.filter((e) => e.status === "processed").length,
    color: "#22C55E",
  },
  {
    name: "Pending",
    value: PAYROLL_EMPLOYEES.filter((e) => e.status === "pending").length,
    color: AMBER,
  },
  {
    name: "AWOL",
    value: PAYROLL_EMPLOYEES.filter((e) => e.status === "awol").length,
    color: "#EF4444",
  },
];

// ---------- Helpers ----------
function currency(n: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
  }).format(n);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ---------- Sub-components ----------
function SectionHeader({
  title,
  sub,
  action,
  onAction,
}: {
  title: string;
  sub?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-sm font-bold text-[#1B2B42] uppercase tracking-wider">
          {title}
        </h2>
        {sub && <p className="text-xs text-[#5A6B7F] mt-0.5">{sub}</p>}
      </div>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-1 text-xs font-medium text-[#5A6B7F] hover:text-[#1B2B42] transition-colors"
        >
          {action} <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon,
  trend,
  trendUp,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[#5A6B7F] uppercase tracking-wider leading-none">
          {label}
        </p>
        <p className="text-2xl font-bold text-[#1B2B42] mt-1.5 leading-none">
          {value}
        </p>
        {(sub || trend) && (
          <div className="flex items-center gap-2 mt-1.5">
            {trend && (
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${trendUp ? "text-green-600" : "text-red-500"}`}
              >
                {trendUp ? (
                  <TrendingUp size={11} />
                ) : (
                  <TrendingDown size={11} />
                )}{" "}
                {trend}
              </span>
            )}
            {sub && <span className="text-xs text-[#5A6B7F]">{sub}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

const STATUS_DOT: Record<string, string> = {
  "on-duty": "bg-green-500",
  late: "bg-amber-400",
  "on-leave": "bg-blue-400",
  absent: "bg-red-500",
};

const STATUS_LABEL: Record<string, string> = {
  "on-duty": "On Duty",
  late: "Late",
  "on-leave": "On Leave",
  absent: "Absent",
};

const LEAVE_TYPE_COLOR: Record<string, string> = {
  Annual: "text-blue-700 bg-blue-50",
  Sick: "text-red-600 bg-red-50",
  Study: "text-purple-700 bg-purple-50",
  "Maternity/Paternity": "text-pink-600 bg-pink-50",
  Unpaid: "text-gray-600 bg-gray-100",
  "Family Responsibility": "text-amber-700 bg-amber-50",
};

const PAYROLL_STATUS: Record<string, { cls: string; label: string }> = {
  processed: { cls: "bg-green-50 text-green-700", label: "Processed" },
  pending: { cls: "bg-amber-50 text-amber-700", label: "Pending" },
  awol: { cls: "bg-red-50 text-red-600", label: "AWOL" },
};

// Custom tooltip for bar chart
function HoursTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-[#1B2B42] mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: p.color }}
          />
          <span className="text-[#5A6B7F]">{p.name}:</span>
          <span className="font-medium text-[#1B2B42]">{p.value}h</span>
        </div>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [attendanceFilter, setAttendanceFilter] = useState<
    "all" | "on-duty" | "late" | "absent" | "on-leave"
  >("all");

  // Computed KPIs
  const totalEmployees = ATTENDANCE.length;
  const onDuty = ATTENDANCE.filter((e) => e.status === "on-duty").length;
  const late = ATTENDANCE.filter((e) => e.status === "late").length;
  const onLeave = ATTENDANCE.filter((e) => e.status === "on-leave").length;
  const absent = ATTENDANCE.filter((e) => e.status === "absent").length;
  const pendingLeave = LEAVE_REQUESTS.filter(
    (r) => r.status === "pending",
  ).length;
  const pendingPayroll = PAYROLL_EMPLOYEES.filter(
    (e) => e.status === "pending",
  ).length;
  const totalGross = PAYROLL_EMPLOYEES.reduce((s, e) => s + e.gross, 0);
  const draftShifts = TODAY_SHIFTS.filter((s) => s.status === "draft").length;
  const totalAlerts =
    late + absent + pendingLeave + pendingPayroll + draftShifts;

  const filteredAttendance =
    attendanceFilter === "all"
      ? ATTENDANCE
      : ATTENDANCE.filter((e) => e.status === attendanceFilter);

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-6 space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold text-[#5A6B7F] uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <h1 className="text-2xl font-bold text-[#1B2B42]">
            Good morning, Michael
          </h1>
          <p className="text-sm text-[#5A6B7F] mt-0.5">
            Here's what's happening at Dunder Mifflin Scranton today.
          </p>
        </div>
        {totalAlerts > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
            <Zap size={15} className="text-[#E8A317]" />
            <span className="text-sm font-semibold text-[#B07A0C]">
              {totalAlerts} items need your attention
            </span>
          </div>
        )}
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="On Duty Today"
          value={`${onDuty} / ${totalEmployees}`}
          sub={`${late} late · ${absent} absent`}
          icon={<UserCheck size={20} className="text-green-600" />}
          accent="bg-green-50"
          trend="+2 vs yesterday"
          trendUp
        />
        <KpiCard
          label="On Leave"
          value={onLeave}
          sub={`${pendingLeave} pending approval`}
          icon={<CalendarOff size={20} className="text-blue-600" />}
          accent="bg-blue-50"
        />
        <KpiCard
          label="Payroll — June"
          value={currency(totalGross)}
          sub={`${pendingPayroll} employees pending`}
          icon={<Wallet size={20} className="text-[#E8A317]" />}
          accent="bg-[#FFF8EC]"
          trend="↑ 4.2% vs May"
          trendUp
        />
        <KpiCard
          label="Shift Alerts"
          value={draftShifts}
          sub="Unpublished shifts today"
          icon={<ShieldAlert size={20} className="text-red-500" />}
          accent="bg-red-50"
          trend={`${TODAY_SHIFTS.filter((s) => s.status === "published").length} published`}
          trendUp
        />
      </div>

      {/* ── Row 2: Attendance + Leave requests ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Attendance */}
        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
          <div className="px-5 pt-5 pb-0">
            <SectionHeader
              title="Today's Attendance"
              sub="Live clock-in status for all employees"
              action="Full Roster"
              onAction={() => navigate("/")}
            />
            {/* Filter pills */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {(["all", "on-duty", "late", "absent", "on-leave"] as const).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setAttendanceFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                      attendanceFilter === f
                        ? "bg-[#1B2B42] text-white"
                        : "bg-gray-50 text-[#5A6B7F] border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {f === "all"
                      ? `All (${totalEmployees})`
                      : f === "on-duty"
                        ? `On Duty (${onDuty})`
                        : f === "late"
                          ? `Late (${late})`
                          : f === "absent"
                            ? `Absent (${absent})`
                            : `On Leave (${onLeave})`}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className=" max-h-[1040px] overflow-y-auto">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50/80 border-y border-gray-100">
                  <th className="px-5 py-2.5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider">
                    Clock In
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider">
                    Scheduled
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAttendance.map((emp) => (
                  <tr
                    key={emp.name}
                    className="hover:bg-gray-50/40 transition-colors"
                  >
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#EAF0FA] text-[#1B2B42] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {initials(emp.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1B2B42] leading-none">
                            {emp.name}
                          </p>
                          <p className="text-[11px] text-[#5A6B7F] mt-0.5">
                            {emp.dept}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-[#1B2B42]">
                      {emp.clockIn ?? <span className="text-[#5A6B7F]">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-[#5A6B7F]">
                      {emp.scheduled}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-[#1B2B42]">
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[emp.status]}`}
                        />
                        {STATUS_LABEL[emp.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leave requests */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <SectionHeader
            title="Leave Requests"
            sub={`${pendingLeave} pending approval`}
            action="Manage"
            onAction={() => navigate("/leave")}
          />
          <div className="space-y-2.5">
            {LEAVE_REQUESTS.map((r, i) => (
              <div
                key={i}
                className={`rounded-xl p-3.5 border ${r.status === "pending" ? "border-amber-200 bg-amber-50/40" : "border-gray-100 bg-gray-50/30"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1B2B42] truncate">
                      {r.name}
                    </p>
                    <p className="text-[11px] text-[#5A6B7F]">{r.dept}</p>
                  </div>
                  {r.status === "pending" ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">
                      <Clock size={9} /> Pending
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0">
                      <CheckCircle2 size={9} /> Approved
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${LEAVE_TYPE_COLOR[r.type] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {r.type}
                  </span>
                  <span className="text-[11px] text-[#5A6B7F]">
                    {r.start} → {r.end}
                  </span>
                  <span className="text-[11px] font-medium text-[#1B2B42] ml-auto">
                    {r.days}d
                  </span>
                </div>
                {r.status === "pending" && (
                  <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-amber-200/60">
                    <button className="flex-1 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors">
                      Approve
                    </button>
                    <button className="flex-1 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/leave")}
            className="w-full mt-4 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#5A6B7F] hover:bg-gray-50 hover:text-[#1B2B42] transition-colors"
          >
            View all leave requests <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* ── Row 3: Shifts + Payroll status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's shifts */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <SectionHeader
            title="Today's Shifts"
            sub={`${TODAY_SHIFTS.filter((s) => s.status === "published").length} published · ${draftShifts} draft`}
            action="Shift Management"
            onAction={() => navigate("/shifts")}
          />
          <div className="space-y-2">
            {TODAY_SHIFTS.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
              >
                <div className="w-8 h-8 rounded-lg bg-[#EAF0FA] text-[#1B2B42] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {initials(s.employee)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1B2B42] truncate">
                    {s.employee}
                  </p>
                  <p className="text-[11px] text-[#5A6B7F]">
                    {s.dept} · {s.location}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-[#1B2B42]">
                    {s.start}–{s.end}
                  </p>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      s.status === "published"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {s.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payroll processing status */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <SectionHeader
            title="Payroll — June 2024"
            sub="Processing status for current period"
            action="Payroll Module"
            onAction={() => navigate("/payroll")}
          />

          {/* Pie + legend */}
          <div className="flex items-center gap-4">
            <div className="w-[140px] h-[140px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PAYROLL_PIE}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PAYROLL_PIE.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {PAYROLL_PIE.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: p.color }}
                    />
                    <span className="text-xs text-[#5A6B7F]">{p.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#1B2B42]">
                    {p.value}
                  </span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5A6B7F]">Total Gross</span>
                  <span className="text-sm font-bold text-[#1B2B42]">
                    {currency(totalGross)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending employees */}
          <div className="mt-4 space-y-1.5">
            <p className="text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider mb-2">
              Needs Processing
            </p>
            {PAYROLL_EMPLOYEES.filter((e) => e.status !== "processed").map(
              (e) => (
                <div
                  key={e.name}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50/60 border border-gray-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-white border border-gray-200 text-[9px] font-bold text-[#1B2B42] flex items-center justify-center">
                      {initials(e.name)}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#1B2B42]">
                        {e.name}
                      </p>
                      <p className="text-[10px] text-[#5A6B7F]">{e.dept}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#1B2B42]">
                      {currency(e.gross)}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${PAYROLL_STATUS[e.status].cls}`}
                    >
                      {PAYROLL_STATUS[e.status].label}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* ── Row 4: Dept hours bar + Leave distribution ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Department hours bar chart */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <SectionHeader
            title="Department Hours — This Week"
            sub="Scheduled vs actual hours by department"
          />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DEPT_HOURS} barCategoryGap="30%" barGap={4}>
              <XAxis
                dataKey="dept"
                tick={{
                  fontSize: 11,
                  fill: "#5A6B7F",
                  fontFamily: "DM Sans, sans-serif",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "#5A6B7F",
                  fontFamily: "DM Sans, sans-serif",
                }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                content={<HoursTooltip />}
                cursor={{ fill: "#F4F6FA" }}
              />
              <Bar
                dataKey="scheduled"
                name="Scheduled"
                fill="#EAF0FA"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="actual"
                name="Actual"
                fill={NAVY}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#EAF0FA] border border-gray-200" />
              <span className="text-xs text-[#5A6B7F]">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ background: NAVY }}
              />
              <span className="text-xs text-[#5A6B7F]">Actual</span>
            </div>
          </div>
        </div>

        {/* Leave type distribution */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <SectionHeader
            title="Leave Distribution"
            sub="Days taken by type — June 2024"
            action="View Balances"
            onAction={() => navigate("/leave")}
          />
          <div className="flex justify-center mb-3">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={LEAVE_TYPE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {LEAVE_TYPE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {LEAVE_TYPE_DATA.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: d.color }}
                  />
                  <span className="text-xs text-[#5A6B7F]">{d.name}</span>
                </div>
                <span className="text-xs font-bold text-[#1B2B42]">
                  {d.value}d
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-[#5A6B7F]">Total days taken</span>
              <span className="text-sm font-bold text-[#1B2B42]">
                {LEAVE_TYPE_DATA.reduce((s, d) => s + d.value, 0)}d
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 5: Quick nav cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Roster",
            sub: "View attendance",
            icon: <Users size={18} />,
            color: "bg-green-50 text-green-700",
            path: "/",
          },
          {
            label: "Shift Management",
            sub: "Manage shifts",
            icon: <CalendarDays size={18} />,
            color: "bg-blue-50 text-blue-700",
            path: "/shifts",
          },
          {
            label: "Leave Management",
            sub: `${pendingLeave} pending`,
            icon: <CalendarOff size={18} />,
            color: "bg-amber-50 text-amber-700",
            path: "/leave",
          },
          {
            label: "Payroll",
            sub: "Process pay run",
            icon: <Wallet size={18} />,
            color: "bg-purple-50 text-purple-700",
            path: "/payroll",
          },
        ].map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.path)}
            className="rounded-xl border border-gray-100 bg-white p-4 flex items-center gap-3 hover:shadow-sm hover:border-gray-200 transition-all text-left group"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.color}`}
            >
              {card.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#1B2B42]">
                {card.label}
              </p>
              <p className="text-xs text-[#5A6B7F]">{card.sub}</p>
            </div>
            <ArrowRight
              size={14}
              className="text-[#5A6B7F] group-hover:translate-x-0.5 transition-transform flex-shrink-0"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
