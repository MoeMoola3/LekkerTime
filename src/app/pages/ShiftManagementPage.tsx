import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Clock,
  MapPin,
  X,
  ChevronDown,
  Edit,
  Trash2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ShiftStatus = "published" | "draft";
type ViewMode = "daily" | "weekly" | "monthly";

interface Shift {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  status: ShiftStatus;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  departmentId: string;
}

interface Department {
  id: string;
  name: string;
}

interface DayCell {
  day: string;
  date: string;
  fullDate: string;
}

interface ShiftFormData {
  departmentId: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: ShiftStatus;
}

interface ContextMenuState {
  x: number;
  y: number;
  shift: Shift;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Single source of truth for "today" — change this one line to update everywhere
const TODAY = new Date();
TODAY.setDate(TODAY.getDate() + 2);

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const EMPTY_FORM: ShiftFormData = {
  departmentId: "",
  employeeId: "",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  status: "draft",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DEPARTMENTS: Department[] = [
  { id: "d1", name: "Engineering" },
  { id: "d2", name: "Design" },
  { id: "d3", name: "Sales" },
  { id: "d4", name: "Operations" },
  { id: "d5", name: "Marketing" },
];

const EMPLOYEES: Employee[] = [
  {
    id: "1",
    name: "Sarah Connor",
    role: "Senior Developer",
    departmentId: "d1",
  },
  {
    id: "2",
    name: "Marcus Wright",
    role: "Product Designer",
    departmentId: "d2",
  },
  {
    id: "3",
    name: "Kyle Reese",
    role: "Account Executive",
    departmentId: "d3",
  },
  {
    id: "4",
    name: "John Connor",
    role: "Operations Manager",
    departmentId: "d4",
  },
  { id: "5", name: "Miles Dyson", role: "Lead Architect", departmentId: "d1" },
  {
    id: "6",
    name: "Kate Brewster",
    role: "Content Strategist",
    departmentId: "d5",
  },
];

const INITIAL_SHIFTS: Shift[] = [
  {
    id: "s1",
    employeeId: "1",
    date: "2026-06-15",
    startTime: "09:00",
    endTime: "17:00",
    location: "Main Office",
    status: "published",
  },
  {
    id: "s2",
    employeeId: "1",
    date: "2026-06-16",
    startTime: "09:00",
    endTime: "17:00",
    location: "Remote",
    status: "published",
  },
  {
    id: "s3",
    employeeId: "2",
    date: "2026-06-15",
    startTime: "10:00",
    endTime: "18:00",
    location: "Main Office",
    status: "draft",
  },
  {
    id: "s4",
    employeeId: "3",
    date: "2026-06-17",
    startTime: "08:00",
    endTime: "16:00",
    location: "Branch A",
    status: "published",
  },
  {
    id: "s5",
    employeeId: "4",
    date: "2026-06-18",
    startTime: "09:00",
    endTime: "17:00",
    location: "Remote",
    status: "published",
  },
  {
    id: "s6",
    employeeId: "5",
    date: "2026-06-19",
    startTime: "09:00",
    endTime: "17:00",
    location: "Main Office",
    status: "published",
  },
  {
    id: "s7",
    employeeId: "6",
    date: "2026-06-15",
    startTime: "11:00",
    endTime: "19:00",
    location: "Remote",
    status: "published",
  },
  {
    id: "s8",
    employeeId: "2",
    date: "2026-06-18",
    startTime: "10:00",
    endTime: "18:00",
    location: "Main Office",
    status: "draft",
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const TODAY_STRING = formatDateString(TODAY);

const getWeekStart = (date: Date): Date => {
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diff);
  return monday;
};

const getDaysForView = (view: ViewMode, currentDate: Date): DayCell[] => {
  if (view === "daily") {
    return [
      {
        day: DAYS_OF_WEEK[currentDate.getDay()],
        date: currentDate.getDate().toString(),
        fullDate: formatDateString(currentDate),
      },
    ];
  }

  if (view === "weekly") {
    const weekStart = getWeekStart(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return {
        day: DAYS_OF_WEEK[d.getDay()],
        date: d.getDate().toString(),
        fullDate: formatDateString(d),
      };
    });
  }

  return []; // monthly view is handled by MonthlyCalendarView directly
};

const getDateRangeText = (view: ViewMode, currentDate: Date): string => {
  if (view === "daily") {
    const month = MONTH_NAMES[currentDate.getMonth()].slice(0, 3);
    return `${month} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
  }

  if (view === "weekly") {
    const weekStart = getWeekStart(currentDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const startMonth = MONTH_NAMES[weekStart.getMonth()].slice(0, 3);
    const endMonth = MONTH_NAMES[weekEnd.getMonth()].slice(0, 3);
    const year = weekStart.getFullYear();

    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${startMonth} ${weekStart.getDate()} – ${weekEnd.getDate()}, ${year}`;
    }
    return `${startMonth} ${weekStart.getDate()} – ${endMonth} ${weekEnd.getDate()}, ${year}`;
  }

  return `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
};

const formatDisplayDate = (dateStr: string): string => {
  const [y, m, d] = dateStr.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "short",
      day: "numeric",
    },
  );
};

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

// ─── Primitive UI Components ──────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function FormField({ label, required, hint, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0B1D3A] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-[#5A6B7F] mt-1.5">{hint}</p>}
    </div>
  );
}

interface SelectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function SelectInput({
  value,
  onChange,
  disabled,
  children,
}: SelectInputProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#E8A317] focus:border-transparent text-[#0B1D3A] appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        {children}
      </select>
      <ChevronDown
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}

interface TextInputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function TextInput({
  type = "text",
  value,
  onChange,
  placeholder,
}: TextInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#E8A317] focus:border-transparent text-[#0B1D3A] placeholder:text-gray-400"
    />
  );
}

// ─── Shift Card (used inside table cells) ────────────────────────────────────

interface ShiftCardProps {
  shift: Shift;
  onContextMenu: (e: React.MouseEvent, shift: Shift) => void;
}

function ShiftCard({ shift, onContextMenu }: ShiftCardProps) {
  const isDraft = shift.status === "draft";
  return (
    <div
      onContextMenu={(e) => onContextMenu(e, shift)}
      className={`p-2.5 rounded-lg border-l-4 shadow-sm flex flex-col gap-1.5 transition-all hover:shadow-md cursor-pointer ${
        isDraft ? "bg-gray-50 border-gray-400" : "bg-[#F4F6FA] border-[#0B1D3A]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-bold ${isDraft ? "text-gray-600" : "text-[#0B1D3A]"}`}
        >
          {shift.startTime} – {shift.endTime}
        </span>
        {isDraft && (
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-200 px-1.5 py-0.5 rounded">
            Draft
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[#5A6B7F]">
        <MapPin size={12} />
        <span className="truncate">{shift.location}</span>
      </div>
    </div>
  );
}

// ─── Context Menu (right-click on a shift) ───────────────────────────────────

interface ContextMenuProps {
  x: number;
  y: number;
  shift: Shift;
  onEdit: (shift: Shift) => void;
  onDelete: (shiftId: string) => void;
}

function ContextMenu({ x, y, shift, onEdit, onDelete }: ContextMenuProps) {
  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
      style={{ top: y, left: x }}
    >
      <button
        onClick={() => onEdit(shift)}
        className="w-full px-4 py-2.5 text-left text-sm font-medium text-[#0B1D3A] hover:bg-gray-50 transition-colors flex items-center gap-3"
      >
        <Edit size={16} className="text-[#5A6B7F]" /> Edit Shift
      </button>
      <div className="border-t border-gray-100" />
      <button
        onClick={() => onDelete(shift.id)}
        className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
      >
        <Trash2 size={16} /> Delete Shift
      </button>
    </div>
  );
}

// ─── Schedule Table (daily / weekly views) ───────────────────────────────────

interface EmployeeRowProps {
  employee: Employee;
  days: DayCell[];
  shifts: Shift[];
  onContextMenu: (e: React.MouseEvent, shift: Shift) => void;
  onAddShift: () => void;
}

function EmployeeRow({
  employee,
  days,
  shifts,
  onContextMenu,
  onAddShift,
}: EmployeeRowProps) {
  return (
    <tr className="group hover:bg-gray-50/50 transition-colors">
      {/* Employee name column */}
      <td className="py-4 px-5 border-r border-gray-100 sticky left-0 z-10 bg-white group-hover:bg-gray-50/50 transition-colors">
        <span className="block text-sm font-semibold text-[#0B1D3A]">
          {employee.name}
        </span>
        <span className="block text-xs text-[#5A6B7F] mt-0.5">
          {employee.role}
        </span>
      </td>

      {/* One cell per day */}
      {days.map((day) => {
        const shift = shifts.find((s) => s.date === day.fullDate);
        return (
          <td
            key={`${employee.id}-${day.fullDate}`}
            className="py-2 px-2 border-r border-gray-100 last:border-r-0 relative group/cell hover:bg-gray-50 transition-colors align-top h-24"
          >
            {shift ? (
              <ShiftCard shift={shift} onContextMenu={onContextMenu} />
            ) : (
              <div
                className="absolute inset-2 border-2 border-dashed border-transparent group-hover/cell:border-gray-200 rounded-lg flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-all cursor-pointer bg-gray-50/50"
                onClick={onAddShift}
              >
                <Plus size={20} className="text-gray-400" />
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
}

interface ScheduleTableProps {
  employees: Employee[];
  days: DayCell[];
  shifts: Shift[];
  onContextMenu: (e: React.MouseEvent, shift: Shift) => void;
  onAddShift: () => void;
}

function ScheduleTable({
  employees,
  days,
  shifts,
  onContextMenu,
  onAddShift,
}: ScheduleTableProps) {
  return (
    <table className="w-full text-left border-collapse min-w-[1000px]">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          <th className="py-4 px-5 text-sm font-semibold text-[#0B1D3A] w-64 border-r border-gray-200 sticky left-0 z-10 bg-gray-50">
            Employees
          </th>
          {days.map((day) => (
            <th
              key={day.fullDate}
              className="py-4 px-3 text-center border-r border-gray-200 last:border-r-0 min-w-[140px]"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider">
                  {day.day}
                </span>
                <span
                  className={`text-lg font-bold ${
                    day.fullDate === TODAY_STRING
                      ? "text-[#E8A317] bg-amber-50 w-8 h-8 rounded-full flex items-center justify-center"
                      : "text-[#0B1D3A]"
                  }`}
                >
                  {day.date}
                </span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {employees.length > 0 ? (
          employees.map((emp) => (
            <EmployeeRow
              key={emp.id}
              employee={emp}
              days={days}
              shifts={shifts.filter((s) => s.employeeId === emp.id)}
              onContextMenu={onContextMenu}
              onAddShift={onAddShift}
            />
          ))
        ) : (
          <tr>
            <td
              colSpan={days.length + 1}
              className="py-12 text-center text-sm text-[#5A6B7F]"
            >
              No employees found matching your search.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// ─── Monthly Calendar View ────────────────────────────────────────────────────

interface MonthlyCalendarViewProps {
  shifts: Shift[];
  onDayClick: (date: string) => void;
  currentDate: Date;
}

interface CalendarDay {
  date: string;
  fullDate: string;
  isCurrentMonth: boolean;
}

function MonthlyCalendarView({
  shifts,
  onDayClick,
  currentDate,
}: MonthlyCalendarViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sun
  const prevMonthTotal = new Date(year, month, 0).getDate();

  const calendarDays: CalendarDay[] = [];

  // Pad start with previous month's tail
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = prevMonthTotal - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    calendarDays.push({
      date: day.toString(),
      fullDate: `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      isCurrentMonth: false,
    });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: i.toString(),
      fullDate: `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
      isCurrentMonth: true,
    });
  }

  // Pad end to fill the last row — supports both 5- and 6-week months
  const totalCells = Math.ceil(calendarDays.length / 7) * 7;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  for (let i = 1; calendarDays.length < totalCells; i++) {
    calendarDays.push({
      date: i.toString(),
      fullDate: `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
      isCurrentMonth: false,
    });
  }

  const numRows = totalCells / 7;

  return (
    <div className="flex flex-col h-full bg-white border-t border-gray-100 min-w-[800px]">
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="py-3 px-4 text-center text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider border-r border-gray-200 last:border-r-0 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className="grid grid-cols-7 flex-1"
        style={{ gridTemplateRows: `repeat(${numRows}, minmax(120px, 1fr))` }}
      >
        {calendarDays.map((day, index) => {
          const dayShifts = shifts.filter((s) => s.date === day.fullDate);
          const isToday = day.fullDate === TODAY_STRING;
          return (
            <div
              key={`${day.fullDate}-${index}`}
              className={`p-2 border-r border-b border-gray-200 last:border-r-0 transition-colors ${
                day.isCurrentMonth
                  ? "bg-white hover:bg-gray-50"
                  : "bg-gray-50/50"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold mb-2 ${
                  isToday
                    ? "bg-[#E8A317] text-white shadow-sm"
                    : day.isCurrentMonth
                      ? "text-[#0B1D3A]"
                      : "text-gray-400"
                }`}
              >
                {day.date}
              </div>

              {dayShifts.length > 0 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onDayClick(day.fullDate);
                  }}
                  className="bg-[#F4F6FA] border border-[#0B1D3A] text-[#0B1D3A] px-2.5 py-2 rounded-md text-xs font-semibold cursor-pointer hover:bg-[#e6ebf5] transition-colors shadow-sm"
                >
                  {dayShifts.length} Shift{dayShifts.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Shift Side Panel (slides in from right when a day is clicked) ────────────

interface ShiftSidePanelProps {
  date: string;
  shifts: Shift[];
  onClose: () => void;
}

function ShiftSidePanel({ date, shifts, onClose }: ShiftSidePanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-[400px] bg-white h-full shadow-2xl flex flex-col border-l border-gray-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-[#0B1D3A]">
              Shifts for {formatDisplayDate(date)}
            </h2>
            <p className="text-sm text-[#5A6B7F] mt-1">
              {shifts.length} assigned shift{shifts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Shift list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {shifts.length > 0 ? (
            shifts.map((shift) => {
              const emp = EMPLOYEES.find((e) => e.id === shift.employeeId);
              return (
                <div
                  key={shift.id}
                  className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0B1D3A] font-bold text-sm">
                        {emp && getInitials(emp.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0B1D3A]">
                          {emp?.name}
                        </h3>
                        <p className="text-xs text-[#5A6B7F]">{emp?.role}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${
                        shift.status === "published"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {shift.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[#5A6B7F] pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-[#E8A317]" />
                      <span>
                        {shift.startTime} – {shift.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{shift.location}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center py-12 text-[#5A6B7F]">
              No shifts scheduled for this day.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add / Edit Shift Modal ───────────────────────────────────────────────────

interface ShiftModalProps {
  editingShift: Shift | null;
  onClose: () => void;
  onSave: (formData: ShiftFormData, shiftId: string | null) => void;
}

function ShiftModal({ editingShift, onClose, onSave }: ShiftModalProps) {
  // Initialise form from the shift being edited, or start blank
  const [form, setForm] = useState<ShiftFormData>(() => {
    if (!editingShift) return { ...EMPTY_FORM };
    const emp = EMPLOYEES.find((e) => e.id === editingShift.employeeId);
    return {
      departmentId: emp?.departmentId ?? "",
      employeeId: editingShift.employeeId,
      date: editingShift.date,
      startTime: editingShift.startTime,
      endTime: editingShift.endTime,
      location: editingShift.location,
      status: editingShift.status,
    };
  });

  const update = <K extends keyof ShiftFormData>(
    field: K,
    value: ShiftFormData[K],
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      departmentId: e.target.value,
      employeeId: "",
    }));
  };

  const handleSubmit = () => {
    const { employeeId, date, startTime, endTime, location } = form;
    if (!employeeId || !date || !startTime || !endTime || !location) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave(form, editingShift?.id ?? null);
  };

  const availableEmployees = form.departmentId
    ? EMPLOYEES.filter((emp) => emp.departmentId === form.departmentId)
    : EMPLOYEES;

  const isEditing = !!editingShift;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0B1D3A]">
              {isEditing ? "Edit Shift" : "Add New Shift"}
            </h2>
            <p className="text-sm text-[#5A6B7F] mt-1">
              {isEditing
                ? "Update shift details"
                : "Schedule a new shift for an employee"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <FormField label="Department" required>
            <SelectInput
              value={form.departmentId}
              onChange={handleDepartmentChange}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </SelectInput>
          </FormField>

          <FormField
            label="Employee"
            required
            hint={
              !form.departmentId
                ? "Please select a department first"
                : undefined
            }
          >
            <SelectInput
              value={form.employeeId}
              onChange={(e) => update("employeeId", e.target.value)}
              disabled={!form.departmentId}
            >
              <option value="">Select an employee</option>
              {availableEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} – {emp.role}
                </option>
              ))}
            </SelectInput>
          </FormField>

          <FormField label="Date" required>
            <TextInput
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Time" required>
              <TextInput
                type="time"
                value={form.startTime}
                onChange={(e) => update("startTime", e.target.value)}
              />
            </FormField>
            <FormField label="End Time" required>
              <TextInput
                type="time"
                value={form.endTime}
                onChange={(e) => update("endTime", e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Location" required>
            <TextInput
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g., Main Office, Remote, Branch A"
            />
          </FormField>

          <FormField label="Status" required>
            <div className="flex items-center gap-6">
              {(["draft", "published"] as ShiftStatus[]).map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={form.status === status}
                    onChange={() => update("status", status)}
                    className="w-4 h-4 text-[#E8A317] border-gray-300 focus:ring-[#E8A317]"
                  />
                  <span className="text-sm text-[#0B1D3A] capitalize">
                    {status}
                  </span>
                </label>
              ))}
            </div>
          </FormField>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-[#5A6B7F] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#0B1D3A] rounded-lg hover:bg-[#152a4f] transition-colors flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <Edit size={16} /> Update Shift
              </>
            ) : (
              <>
                <Plus size={16} /> Add Shift
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

interface ToolbarProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

function Toolbar({
  view,
  onViewChange,
  currentDate,
  onPrevious,
  onNext,
  onToday,
  searchTerm,
  onSearchChange,
}: ToolbarProps) {
  return (
    <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white">
      {/* Date navigator */}
      <div className="flex items-center gap-4 xl:w-1/3">
        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
          <button
            onClick={onPrevious}
            className="p-1.5 rounded-md text-gray-500 hover:bg-white hover:shadow-sm transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-4 py-1 text-sm font-semibold text-[#0B1D3A] min-w-[140px] text-center">
            {getDateRangeText(view, currentDate)}
          </span>
          <button
            onClick={onNext}
            className="p-1.5 rounded-md text-gray-500 hover:bg-white hover:shadow-sm transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <button
          onClick={onToday}
          className="text-sm font-medium text-[#E8A317] hover:text-[#c48810] transition-colors"
        >
          Today
        </button>
      </div>

      {/* View switcher */}
      <div className="flex items-center justify-center xl:w-1/3">
        <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-200">
          {(["daily", "weekly", "monthly"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${
                view === v
                  ? "bg-white shadow-sm text-[#0B1D3A]"
                  : "text-[#5A6B7F] hover:bg-white hover:text-[#0B1D3A] hover:shadow-sm"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-end xl:w-1/3">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-56 focus:w-72 transition-all duration-300 outline-none focus:ring-2 focus:ring-[#E8A317] focus:border-transparent placeholder:text-gray-400 text-[#0B1D3A]"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────

interface PageHeaderProps {
  onAddShift: () => void;
}

function PageHeader({ onAddShift }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-extrabold text-[#0B1D3A] tracking-tight">
          Shift Management
        </h1>
        <p className="text-[#5A6B7F] mt-2 text-base font-medium tracking-wide">
          Schedule and manage employee shifts efficiently
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#0B1D3A] px-4 py-2 rounded-lg transition-colors font-medium">
          <Calendar size={18} /> Copy Previous Week
        </button>
        <button
          onClick={onAddShift}
          className="flex items-center gap-2 bg-[#0B1D3A] hover:bg-[#152a4f] text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus size={18} /> Add Shift
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ShiftManagementPage() {
  const [view, setView] = useState<ViewMode>("weekly");
  const [currentDate, setCurrentDate] = useState<Date>(TODAY);
  const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Close the context menu whenever the user clicks anywhere
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [contextMenu]);

  const filteredEmployees = EMPLOYEES.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ── Navigation ──────────────────────────────────────────────────────────────

  const navigate = (direction: "prev" | "next") => {
    const delta = direction === "prev" ? -1 : 1;
    const next = new Date(currentDate);
    if (view === "daily") next.setDate(currentDate.getDate() + delta);
    if (view === "weekly") next.setDate(currentDate.getDate() + delta * 7);
    if (view === "monthly") next.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(next);
  };

  // ── Modal handlers ──────────────────────────────────────────────────────────

  const openAddModal = () => {
    setEditingShift(null);
    setShowModal(true);
  };

  const openEditModal = (shift: Shift) => {
    setEditingShift(shift);
    setShowModal(true);
    setContextMenu(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingShift(null);
  };

  // ── Shift CRUD ──────────────────────────────────────────────────────────────

  const handleSaveShift = (formData: ShiftFormData, shiftId: string | null) => {
    const payload: Omit<Shift, "id"> = {
      employeeId: formData.employeeId,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      status: formData.status,
    };

    if (shiftId) {
      setShifts((prev) =>
        prev.map((s) => (s.id === shiftId ? { ...s, ...payload } : s)),
      );
    } else {
      setShifts((prev) => [...prev, { id: `s${Date.now()}`, ...payload }]);
    }
    closeModal();
  };

  const handleDeleteShift = (shiftId: string) => {
    if (!confirm("Are you sure you want to delete this shift?")) return;
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, shift: Shift) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, shift });
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 space-y-8 h-full flex flex-col relative">
      <PageHeader onAddShift={openAddModal} />

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col flex-1 overflow-hidden">
        <Toolbar
          view={view}
          onViewChange={setView}
          currentDate={currentDate}
          onPrevious={() => navigate("prev")}
          onNext={() => navigate("next")}
          onToday={() => setCurrentDate(TODAY)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="overflow-x-auto flex-1 flex flex-col">
          {view === "monthly" ? (
            <MonthlyCalendarView
              shifts={shifts}
              onDayClick={setSelectedDate}
              currentDate={currentDate}
            />
          ) : (
            <ScheduleTable
              employees={filteredEmployees}
              days={getDaysForView(view, currentDate)}
              shifts={shifts}
              onContextMenu={handleContextMenu}
              onAddShift={openAddModal}
            />
          )}
        </div>
      </div>

      {/* Overlays — rendered at page level so they sit above everything */}

      {selectedDate && (
        <ShiftSidePanel
          date={selectedDate}
          shifts={shifts.filter((s) => s.date === selectedDate)}
          onClose={() => setSelectedDate(null)}
        />
      )}

      {showModal && (
        <ShiftModal
          editingShift={editingShift}
          onClose={closeModal}
          onSave={handleSaveShift}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          shift={contextMenu.shift}
          onEdit={openEditModal}
          onDelete={handleDeleteShift}
        />
      )}
    </div>
  );
}

export default ShiftManagementPage;
