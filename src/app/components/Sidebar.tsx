import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  CalendarClock,
  CalendarOff,
  UserCircle,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Attendance Roster", icon: Users, path: "/attendance" },
  { name: "Payroll Management", icon: Wallet, path: "/payroll" },
  { name: "Shift Management", icon: CalendarClock, path: "/shifts" },
  { name: "Leave Management", icon: CalendarOff, path: "/leave" },
  { name: "Employees", icon: UserCircle, path: "/employees" },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
    navigate(path);
  };

  return (
    <aside
      className={`relative flex flex-col h-[calc(100vh-32px)] my-4 ml-4 bg-[#0B1D3A] rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-in-out shrink-0 z-20 overflow-hidden border border-white/5 ${
        isExpanded ? "w-[260px]" : "w-[72px]"
      }`}
    >
      {/* Header */}
      <div className="relative flex flex-col items-center justify-center pt-6 pb-4 px-4 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A317] to-[#D4920B] shadow-[0_2px_10px_rgba(232,163,23,0.3)] flex items-center justify-center shrink-0">
          <span className="font-extrabold text-[#0B1D3A] text-[15px] leading-none tracking-tight">
            LT
          </span>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${isExpanded ? "opacity-100 max-h-10 mt-2" : "opacity-0 max-h-0"}`}
        >
          <span className="font-extrabold text-white text-[18px] whitespace-nowrap tracking-tight">
            LekkerTime
          </span>
        </div>
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Collapse sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={(e) => {
              if (!isExpanded) {
                e.preventDefault();
                handleNavClick(item.path);
              }
            }}
            className={({ isActive }) => `
              flex items-center px-3 py-3 rounded-lg transition-all duration-200 group cursor-pointer
              ${
                isActive
                  ? "bg-[#E8A317] text-[#0B1D3A] shadow-[0_2px_10px_rgba(232,163,23,0.3)] font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }
            `}
            title={!isExpanded ? item.name : undefined}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={22}
                  className={`shrink-0 ${isActive ? "text-[#0B1D3A]" : ""}`}
                />
                <span
                  className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                    isExpanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4 w-0 overflow-hidden"
                  }`}
                >
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info (Bottom) */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <div
          className={`flex items-center cursor-pointer ${isExpanded ? "" : "justify-center"}`}
          onClick={() => !isExpanded && setIsExpanded(true)}
          title={!isExpanded ? "Michael Scott" : undefined}
        >
          <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-semibold shrink-0">
            MS
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? "ml-3 opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            <div className="text-sm font-medium text-white whitespace-nowrap">
              Michael Scott
            </div>
            <div className="text-xs text-white/50 whitespace-nowrap">
              Regional Manager
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
