import { Clock, MapPin, X } from "lucide-react";
import { EMPLOYEES } from "../../api/mock/shifts";
import { Shift } from "../../types/shifts";
import { formatDisplayDate, getInitials } from "../../utils/calendarUtils";

interface ShiftSidePanelProps {
  date: string;
  shifts: Shift[];
  onClose: () => void;
}

export function ShiftSidePanel({ date, shifts, onClose }: ShiftSidePanelProps) {
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
