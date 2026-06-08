import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ViewMode } from "../../types/shifts";
import { getDateRangeText } from "../../utils/calendarUtils";

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

export function Toolbar({
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
