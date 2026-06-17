// ── Table Header Cell ─────────────────────────────────────────────────────────

interface ThProps {
  children?: React.ReactNode;
  className?: string;
}

export function Th({ children, className = "" }: ThProps) {
  return (
    <th
      className={`py-3 px-4 text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  );
}
