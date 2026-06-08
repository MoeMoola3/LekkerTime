import { Shift } from "../../types/shifts";
import { DAYS_OF_WEEK, TODAY_STRING } from "../../utils/calendarUtils";

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

export function MonthlyCalendar({
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
