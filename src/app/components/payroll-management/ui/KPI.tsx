import React from "react";
import { Search } from "lucide-react";

// ── KPI Card ──────────────────────────────────────────────────────────────────

interface KpiProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  /** Renders with a warm amber accent when true. */
  accent?: boolean;
}

export function Kpi({ label, value, icon, accent = false }: KpiProps) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        accent
          ? "bg-[#FFF8EC] border-[#F4DCA1]"
          : "bg-gray-50/60 border-gray-100"
      }`}
    >
      <div className="flex items-center gap-2 text-[#5A6B7F] text-xs uppercase tracking-wider mb-2">
        <span className={accent ? "text-[#B07A0C]" : "text-[#5A6B7F]"}>
          {icon}
        </span>
        {label}
      </div>
      <p className="text-2xl font-bold text-[#1B2B42]">{value}</p>
    </div>
  );
}
