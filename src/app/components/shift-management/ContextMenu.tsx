import { Edit, Trash2 } from "lucide-react";
import { Shift } from "../../types/shifts";

interface ContextMenuProps {
  x: number;
  y: number;
  shift: Shift;
  onEdit: (shift: Shift) => void;
  onDelete: (shiftId: string) => void;
}

export function ContextMenu({
  x,
  y,
  shift,
  onEdit,
  onDelete,
}: ContextMenuProps) {
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
