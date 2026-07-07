import { useState, useMemo, Fragment } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  CalendarDays,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Umbrella,
  HeartPulse,
  GraduationCap,
  Baby,
  Plane,
  MoreHorizontal,
} from "lucide-react";

// ---------- Types ----------
type LeaveType =
  | "Annual"
  | "Sick"
  | "Study"
  | "Maternity/Paternity"
  | "Unpaid"
  | "Family Responsibility";
type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  approvedBy?: string;
}

interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  department: string;
  annual: { total: number; used: number };
  sick: { total: number; used: number };
  study: { total: number; used: number };
  family: { total: number; used: number };
}

interface NewRequestForm {
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

// ---------- Constants ----------
const LEAVE_TYPES: LeaveType[] = [
  "Annual",
  "Sick",
  "Study",
  "Maternity/Paternity",
  "Unpaid",
  "Family Responsibility",
];

const TYPE_META: Record<
  LeaveType,
  { icon: React.ReactNode; color: string; bg: string; border: string }
> = {
  Annual: {
    icon: <Plane size={13} />,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  Sick: {
    icon: <HeartPulse size={13} />,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  Study: {
    icon: <GraduationCap size={13} />,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  "Maternity/Paternity": {
    icon: <Baby size={13} />,
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
  Unpaid: {
    icon: <Umbrella size={13} />,
    color: "text-gray-600",
    bg: "bg-gray-100",
    border: "border-gray-200",
  },
  "Family Responsibility": {
    icon: <HeartPulse size={13} />,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ---------- Mock data ----------
const INITIAL_REQUESTS: LeaveRequest[] = [
  {
    id: "lr1",
    employeeId: "e1",
    employeeName: "Dwight Schrute",
    department: "Sales",
    type: "Annual",
    startDate: "2024-06-10",
    endDate: "2024-06-14",
    days: 5,
    reason: "Beet harvest at Schrute Farms",
    status: "approved",
    appliedOn: "2024-05-28",
    approvedBy: "Michael Scott",
  },
  {
    id: "lr2",
    employeeId: "e2",
    employeeName: "Meredith Palmer",
    department: "Procurement",
    type: "Sick",
    startDate: "2024-06-03",
    endDate: "2024-06-04",
    days: 2,
    reason: "Rabies shot follow-up",
    status: "approved",
    appliedOn: "2024-06-03",
    approvedBy: "Michael Scott",
  },
  {
    id: "lr3",
    employeeId: "e3",
    employeeName: "Oscar Martinez",
    department: "Accounting",
    type: "Study",
    startDate: "2024-06-17",
    endDate: "2024-06-21",
    days: 5,
    reason: "CPA continuing education",
    status: "pending",
    appliedOn: "2024-06-01",
  },
  {
    id: "lr4",
    employeeId: "e4",
    employeeName: "Kevin Malone",
    department: "Accounting",
    type: "Annual",
    startDate: "2024-07-01",
    endDate: "2024-07-05",
    days: 5,
    reason: "Poker tournament in Atlantic City",
    status: "pending",
    appliedOn: "2024-06-05",
  },
  {
    id: "lr5",
    employeeId: "e5",
    employeeName: "Pam Beesly",
    department: "Reception",
    type: "Maternity/Paternity",
    startDate: "2024-07-15",
    endDate: "2024-10-15",
    days: 63,
    reason: "Maternity leave",
    status: "approved",
    appliedOn: "2024-05-15",
    approvedBy: "Michael Scott",
  },
  {
    id: "lr6",
    employeeId: "e6",
    employeeName: "Ryan Howard",
    department: "IT",
    type: "Annual",
    startDate: "2024-06-24",
    endDate: "2024-06-28",
    days: 5,
    reason: "Startup conference in Scottsdale",
    status: "rejected",
    appliedOn: "2024-06-02",
  },
  {
    id: "lr7",
    employeeId: "e7",
    employeeName: "Angela Martin",
    department: "Accounting",
    type: "Family Responsibility",
    startDate: "2024-06-06",
    endDate: "2024-06-07",
    days: 2,
    reason: "Cat Sprinkles needs surgery",
    status: "approved",
    appliedOn: "2024-06-06",
    approvedBy: "Michael Scott",
  },
  {
    id: "lr8",
    employeeId: "e8",
    employeeName: "Creed Bratton",
    department: "QA",
    type: "Unpaid",
    startDate: "2024-07-08",
    endDate: "2024-07-12",
    days: 5,
    reason: "Personal matters",
    status: "pending",
    appliedOn: "2024-06-10",
  },
  {
    id: "lr9",
    employeeId: "e3",
    employeeName: "Oscar Martinez",
    department: "Accounting",
    type: "Sick",
    startDate: "2024-05-20",
    endDate: "2024-05-20",
    days: 1,
    reason: "Doctor appointment",
    status: "approved",
    appliedOn: "2024-05-20",
    approvedBy: "Michael Scott",
  },
  {
    id: "lr10",
    employeeId: "e1",
    employeeName: "Dwight Schrute",
    department: "Sales",
    type: "Annual",
    startDate: "2024-08-05",
    endDate: "2024-08-09",
    days: 5,
    reason: "Assistant Regional Manager training",
    status: "pending",
    appliedOn: "2024-06-12",
  },
];

const LEAVE_BALANCES: LeaveBalance[] = [
  {
    employeeId: "e1",
    employeeName: "Dwight Schrute",
    department: "Sales",
    annual: { total: 21, used: 10 },
    sick: { total: 30, used: 2 },
    study: { total: 10, used: 0 },
    family: { total: 3, used: 0 },
  },
  {
    employeeId: "e2",
    employeeName: "Meredith Palmer",
    department: "Procurement",
    annual: { total: 21, used: 5 },
    sick: { total: 30, used: 14 },
    study: { total: 10, used: 0 },
    family: { total: 3, used: 1 },
  },
  {
    employeeId: "e3",
    employeeName: "Oscar Martinez",
    department: "Accounting",
    annual: { total: 21, used: 3 },
    sick: { total: 30, used: 4 },
    study: { total: 10, used: 5 },
    family: { total: 3, used: 0 },
  },
  {
    employeeId: "e4",
    employeeName: "Kevin Malone",
    department: "Accounting",
    annual: { total: 21, used: 0 },
    sick: { total: 30, used: 8 },
    study: { total: 10, used: 0 },
    family: { total: 3, used: 0 },
  },
  {
    employeeId: "e5",
    employeeName: "Pam Beesly",
    department: "Reception",
    annual: { total: 21, used: 2 },
    sick: { total: 30, used: 1 },
    study: { total: 10, used: 0 },
    family: { total: 3, used: 0 },
  },
  {
    employeeId: "e6",
    employeeName: "Ryan Howard",
    department: "IT",
    annual: { total: 21, used: 18 },
    sick: { total: 30, used: 0 },
    study: { total: 10, used: 3 },
    family: { total: 3, used: 0 },
  },
  {
    employeeId: "e7",
    employeeName: "Angela Martin",
    department: "Accounting",
    annual: { total: 21, used: 7 },
    sick: { total: 30, used: 0 },
    study: { total: 10, used: 0 },
    family: { total: 3, used: 2 },
  },
  {
    employeeId: "e8",
    employeeName: "Creed Bratton",
    department: "QA",
    annual: { total: 21, used: 8 },
    sick: { total: 30, used: 5 },
    study: { total: 10, used: 0 },
    family: { total: 3, used: 0 },
  },
];

// ---------- Helpers ----------
function fmt(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function workingDays(start: string, end: string) {
  const s = new Date(start),
    e = new Date(end);
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    if (cur.getDay() !== 0 && cur.getDay() !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function datesInMonth(year: number, month: number): Date[] {
  const result: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    result.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return result;
}

function dateInRange(date: Date, start: string, end: string) {
  const d = date.getTime();
  return d >= new Date(start).getTime() && d <= new Date(end).getTime();
}

// ---------- Sub-components ----------
function StatusBadge({ status }: { status: LeaveStatus }) {
  const map: Record<
    LeaveStatus,
    { label: string; icon: React.ReactNode; cls: string }
  > = {
    pending: {
      label: "Pending",
      icon: <Clock size={11} />,
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    approved: {
      label: "Approved",
      icon: <CheckCircle2 size={11} />,
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    rejected: {
      label: "Rejected",
      icon: <XCircle size={11} />,
      cls: "bg-red-50 text-red-600 border-red-200",
    },
    cancelled: {
      label: "Cancelled",
      icon: <XCircle size={11} />,
      cls: "bg-gray-100 text-gray-500 border-gray-200",
    },
  };
  const { label, icon, cls } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${cls}`}
    >
      {icon} {label}
    </span>
  );
}

function TypeBadge({ type }: { type: LeaveType }) {
  const { icon, color, bg, border } = TYPE_META[type];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${color} ${bg} ${border}`}
    >
      {icon} {type}
    </span>
  );
}

function BalanceBar({
  label,
  used,
  total,
  color,
}: {
  label: string;
  used: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const remaining = total - used;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-[#5A6B7F]">{label}</span>
        <span className="text-xs text-[#1B2B42]">
          <span className="font-semibold">{remaining}</span> / {total} left
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---------- Calendar Tab ----------
function CalendarTab({ requests }: { requests: LeaveRequest[] }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const days = datesInMonth(viewYear, viewMonth);
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const blanks = Array.from({ length: firstDow });

  const approved = requests.filter((r) => r.status === "approved");

  const requestsForDay = (date: Date) =>
    approved.filter((r) => dateInRange(date, r.startDate, r.endDate));

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  };

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const typeColors: Partial<Record<LeaveType, string>> = {
    Annual: "bg-blue-100 text-blue-700",
    Sick: "bg-red-100 text-red-700",
    Study: "bg-purple-100 text-purple-700",
    "Maternity/Paternity": "bg-pink-100 text-pink-700",
    Unpaid: "bg-gray-100 text-gray-600",
    "Family Responsibility": "bg-amber-100 text-amber-700",
  };

  return (
    <div className="space-y-5">
      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {(Object.entries(typeColors) as [LeaveType, string][]).map(
          ([t, cls]) => (
            <div key={t} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-sm ${cls.split(" ")[0]}`} />
              <span className="text-xs text-[#5A6B7F]">{t}</span>
            </div>
          ),
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        {/* Month nav */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors text-[#5A6B7F]"
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className="text-base font-semibold text-[#1B2B42]">
            {MONTHS[viewMonth]} {viewYear}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors text-[#5A6B7F]"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className="py-2 text-center text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7">
          {blanks.map((_, i) => (
            <div
              key={`b${i}`}
              className="min-h-[96px] border-b border-r border-gray-50 bg-gray-50/30"
            />
          ))}
          {days.map((date, i) => {
            const rqs = requestsForDay(date);
            const isWknd = date.getDay() === 0 || date.getDay() === 6;
            return (
              <div
                key={i}
                className={`min-h-[96px] border-b border-r border-gray-50 p-2 ${isWknd ? "bg-gray-50/40" : "bg-white"}`}
              >
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mb-1 ${
                    isToday(date)
                      ? "bg-[#E8A317] text-[#1B2B42] font-bold"
                      : "text-[#1B2B42]"
                  }`}
                >
                  {date.getDate()}
                </span>
                <div className="space-y-0.5">
                  {rqs.slice(0, 2).map((r) => (
                    <div
                      key={r.id}
                      title={`${r.employeeName} — ${r.type}`}
                      className={`truncate text-[10px] px-1.5 py-0.5 rounded font-medium ${typeColors[r.type] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {r.employeeName.split(" ")[0]}
                    </div>
                  ))}
                  {rqs.length > 2 && (
                    <div className="text-[10px] text-[#5A6B7F] px-1">
                      +{rqs.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- Requests Tab ----------
function RequestsTab({
  requests,
  onApprove,
  onReject,
  onNew,
}: {
  requests: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onNew: () => void;
}) {
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<LeaveType | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = requests.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (typeFilter !== "all" && r.type !== typeFilter) return false;
    if (search && !r.employeeName.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-5">
      {pendingCount > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertTriangle
            size={18}
            className="text-[#E8A317] flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-semibold text-[#B07A0C]">
              {pendingCount} request{pendingCount > 1 ? "s" : ""} awaiting
              approval
            </p>
            <p className="text-xs text-[#B07A0C] mt-0.5">
              Review and action pending leave applications below.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <input
            type="text"
            placeholder="Search employee…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1B2B42] outline-none focus:ring-2 focus:ring-[#E8A317] placeholder:text-[#5A6B7F]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as LeaveStatus | "all")
          }
          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1B2B42] outline-none focus:ring-2 focus:ring-[#E8A317]"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as LeaveType | "all")}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1B2B42] outline-none focus:ring-2 focus:ring-[#E8A317]"
        >
          <option value="all">All types</option>
          {LEAVE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <div className="ml-auto">
          <button
            onClick={onNew}
            className="flex items-center gap-2 bg-[#1B2B42] hover:bg-[#2A4266] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={15} /> New Request
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100">
              {[
                "Employee",
                "Type",
                "From",
                "To",
                "Days",
                "Applied",
                "Status",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-sm text-[#5A6B7F]"
                >
                  No leave requests match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="bg-white hover:bg-gray-50/40 transition-colors"
                >
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-[#1B2B42]">
                      {r.employeeName}
                    </p>
                    <p className="text-xs text-[#5A6B7F]">{r.department}</p>
                  </td>
                  <td className="py-3 px-4">
                    <TypeBadge type={r.type} />
                  </td>
                  <td className="py-3 px-4 text-sm text-[#1B2B42]">
                    {fmt(r.startDate)}
                  </td>
                  <td className="py-3 px-4 text-sm text-[#1B2B42]">
                    {fmt(r.endDate)}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-[#1B2B42]">
                    {r.days}d
                  </td>
                  <td className="py-3 px-4 text-sm text-[#5A6B7F]">
                    {fmt(r.appliedOn)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 px-4">
                    {r.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onApprove(r.id)}
                          className="px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium border border-green-200 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onReject(r.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium border border-red-200 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-[#5A6B7F]">
                        <MoreHorizontal size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Balances Tab ----------
function BalancesTab({ balances }: { balances: LeaveBalance[] }) {
  const [search, setSearch] = useState("");
  const filtered = balances.filter(
    (b) =>
      b.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      b.department.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search employee or department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1B2B42] outline-none focus:ring-2 focus:ring-[#E8A317] placeholder:text-[#5A6B7F] flex-1 max-w-xs"
        />
        <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#5A6B7F] px-3.5 py-2.5 rounded-xl text-sm transition-colors ml-auto">
          <Download size={14} /> Export
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map((b) => {
          const annualLeft = b.annual.total - b.annual.used;
          const lowAnnual = annualLeft <= 3;
          return (
            <div
              key={b.employeeId}
              className="rounded-xl border border-gray-100 bg-white p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-[#1B2B42]">
                    {b.employeeName}
                  </p>
                  <p className="text-xs text-[#5A6B7F]">{b.department}</p>
                </div>
                {lowAnnual && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-medium">
                    <AlertTriangle size={10} /> Low Balance
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <BalanceBar
                  label="Annual Leave"
                  used={b.annual.used}
                  total={b.annual.total}
                  color="bg-blue-400"
                />
                <BalanceBar
                  label="Sick Leave"
                  used={b.sick.used}
                  total={b.sick.total}
                  color="bg-red-400"
                />
                <BalanceBar
                  label="Study Leave"
                  used={b.study.used}
                  total={b.study.total}
                  color="bg-purple-400"
                />
                <BalanceBar
                  label="Family Responsibility"
                  used={b.family.used}
                  total={b.family.total}
                  color="bg-amber-400"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- New Request Modal ----------
function NewRequestModal({
  onClose,
  onSubmit,
  balances,
}: {
  onClose: () => void;
  onSubmit: (req: Omit<LeaveRequest, "id" | "appliedOn" | "status">) => void;
  balances: LeaveBalance[];
}) {
  const [form, setForm] = useState<NewRequestForm>({
    employeeId: balances[0].employeeId,
    type: "Annual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const selectedBalance = balances.find(
    (b) => b.employeeId === form.employeeId,
  );
  const days =
    form.startDate && form.endDate
      ? workingDays(form.startDate, form.endDate)
      : 0;

  const canSubmit =
    form.startDate && form.endDate && form.reason.trim() && days > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const emp = balances.find((b) => b.employeeId === form.employeeId)!;
    onSubmit({
      employeeId: form.employeeId,
      employeeName: emp.employeeName,
      department: emp.department,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days,
      reason: form.reason,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-[#1B2B42]">
              New Leave Request
            </h2>
            <p className="text-xs text-[#5A6B7F] mt-0.5">
              Submit a leave application for an employee.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-[#5A6B7F]"
          >
            <XCircle size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Employee */}
          <div>
            <label className="block text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider mb-1.5">
              Employee
            </label>
            <select
              value={form.employeeId}
              onChange={(e) =>
                setForm((f) => ({ ...f, employeeId: e.target.value }))
              }
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1B2B42] outline-none focus:ring-2 focus:ring-[#E8A317]"
            >
              {balances.map((b) => (
                <option key={b.employeeId} value={b.employeeId}>
                  {b.employeeName} — {b.department}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider mb-1.5">
              Leave Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LEAVE_TYPES.map((t) => {
                const { icon, color, bg, border } = TYPE_META[t];
                return (
                  <button
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      form.type === t
                        ? `${color} ${bg} ${border} ring-2 ring-offset-1 ring-[#E8A317]`
                        : "bg-white border-gray-200 text-[#5A6B7F] hover:border-gray-300"
                    }`}
                  >
                    {icon} {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startDate: e.target.value }))
                }
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1B2B42] outline-none focus:ring-2 focus:ring-[#E8A317]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={form.endDate}
                min={form.startDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endDate: e.target.value }))
                }
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1B2B42] outline-none focus:ring-2 focus:ring-[#E8A317]"
              />
            </div>
          </div>

          {/* Days preview */}
          {days > 0 && (
            <div className="rounded-xl bg-[#F4F6FA] border border-gray-100 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-[#5A6B7F]">Working days</span>
              <span className="text-sm font-bold text-[#1B2B42]">
                {days} day{days !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Annual balance warning */}
          {selectedBalance &&
            form.type === "Annual" &&
            days > 0 &&
            (() => {
              const remaining =
                selectedBalance.annual.total - selectedBalance.annual.used;
              return remaining < days ? (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
                  <AlertTriangle
                    size={14}
                    className="text-red-500 flex-shrink-0"
                  />
                  <span className="text-xs text-red-600">
                    Only <strong>{remaining}</strong> annual leave day
                    {remaining !== 1 ? "s" : ""} remaining. This request exceeds
                    the balance.
                  </span>
                </div>
              ) : null;
            })()}

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider mb-1.5">
              Reason
            </label>
            <textarea
              rows={3}
              value={form.reason}
              onChange={(e) =>
                setForm((f) => ({ ...f, reason: e.target.value }))
              }
              placeholder="Brief description of the reason for leave…"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1B2B42] outline-none focus:ring-2 focus:ring-[#E8A317] resize-none placeholder:text-[#5A6B7F]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm text-[#5A6B7F] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-5 py-2.5 rounded-xl bg-[#1B2B42] hover:bg-[#2A4266] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Leave Component ----------
const TABS = ["Requests", "Calendar", "Balances"] as const;
type Tab = (typeof TABS)[number];

export function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Requests");
  const [requests, setRequests] = useState<LeaveRequest[]>(INITIAL_REQUESTS);
  const [showModal, setShowModal] = useState(false);

  const handleApprove = (id: string) =>
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "approved", approvedBy: "Michael Scott" }
          : r,
      ),
    );

  const handleReject = (id: string) =>
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
    );

  const handleNewRequest = (
    req: Omit<LeaveRequest, "id" | "appliedOn" | "status">,
  ) => {
    const today = new Date().toISOString().split("T")[0];
    setRequests((prev) => [
      { ...req, id: `lr${Date.now()}`, appliedOn: today, status: "pending" },
      ...prev,
    ]);
  };

  const kpis = useMemo(
    () => ({
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      onLeave: requests.filter((r) => {
        const today = new Date();
        return (
          r.status === "approved" && dateInRange(today, r.startDate, r.endDate)
        );
      }).length,
      totalDays: requests
        .filter((r) => r.status === "approved")
        .reduce((s, r) => s + r.days, 0),
    }),
    [requests],
  );

  return (
    <div className="min-h-screen bg-[#F4F6FA] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2B42]">
            Leave Management
          </h1>
          <p className="text-sm text-[#5A6B7F] mt-0.5">
            Manage employee leave requests, balances, and approvals.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#5A6B7F] px-3.5 py-2.5 rounded-xl text-sm transition-colors">
            <Filter size={14} /> Filter
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#E8A317] hover:bg-[#D6960E] text-[#1B2B42] font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Plus size={15} /> New Request
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Pending Approval",
            value: kpis.pending,
            icon: <Clock size={18} className="text-amber-600" />,
            accent: "bg-amber-50",
            valueColor: "text-amber-700",
          },
          {
            label: "Approved (Period)",
            value: kpis.approved,
            icon: <CheckCircle2 size={18} className="text-green-600" />,
            accent: "bg-green-50",
            valueColor: "text-green-700",
          },
          {
            label: "On Leave Today",
            value: kpis.onLeave,
            icon: <Plane size={18} className="text-blue-600" />,
            accent: "bg-blue-50",
            valueColor: "text-blue-700",
          },
          {
            label: "Total Days Taken",
            value: kpis.totalDays,
            icon: <CalendarDays size={18} className="text-[#1B2B42]" />,
            accent: "bg-[#EAF0FA]",
            valueColor: "text-[#1B2B42]",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-gray-100 bg-white p-5 flex items-start gap-4"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${k.accent}`}
            >
              {k.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-[#5A6B7F] uppercase tracking-wider">
                {k.label}
              </p>
              <p className={`text-2xl font-bold mt-0.5 ${k.valueColor}`}>
                {k.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === activeTab
                ? "bg-[#1B2B42] text-white"
                : "text-[#5A6B7F] hover:text-[#1B2B42] hover:bg-gray-50"
            }`}
          >
            {tab}
            {tab === "Requests" && kpis.pending > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#E8A317] text-[#1B2B42] text-[10px] font-bold">
                {kpis.pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Requests" && (
        <RequestsTab
          requests={requests}
          onApprove={handleApprove}
          onReject={handleReject}
          onNew={() => setShowModal(true)}
        />
      )}
      {activeTab === "Calendar" && <CalendarTab requests={requests} />}
      {activeTab === "Balances" && <BalancesTab balances={LEAVE_BALANCES} />}

      {/* Modal */}
      {showModal && (
        <NewRequestModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewRequest}
          balances={LEAVE_BALANCES}
        />
      )}
    </div>
  );
}

export default LeaveManagementPage;
