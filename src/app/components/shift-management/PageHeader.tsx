import { Calendar, Plus } from "lucide-react";

interface PageHeaderProps {
  onAddShift: () => void;
}

export function PageHeader({ onAddShift }: PageHeaderProps) {
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
