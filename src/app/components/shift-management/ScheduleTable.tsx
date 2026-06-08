import { MapPin, Plus } from "lucide-react";
import { DayCell, Employee, Shift } from "../../types/shifts";
import { TODAY_STRING } from "../../utils/calendarUtils";

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

interface ScheduleTableProps {
  employees: Employee[];
  days: DayCell[];
  shifts: Shift[];
  onContextMenu: (e: React.MouseEvent, shift: Shift) => void;
  onAddShift: () => void;
}

export function ScheduleTable({
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
