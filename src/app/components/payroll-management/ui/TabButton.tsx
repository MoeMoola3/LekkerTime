// ── Tab Button ────────────────────────────────────────────────────────────────

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function TabButton({ active, onClick, icon, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active
          ? "border-[#E8A317] text-[#1B2B42]"
          : "border-transparent text-[#5A6B7F] hover:text-[#1B2B42]"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
