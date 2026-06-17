// ── Search Input ──────────────────────────────────────────────────────────────

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search employees...",
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:w-80 transition-all duration-300 outline-none focus:ring-2 focus:ring-[#E8A317] placeholder:text-gray-400 text-[#1B2B42]"
      />
    </div>
  );
}
