import React, { useState, useEffect } from "react";

import { PageHeader } from "../components/shift-management/PageHeader";
import {
  ContextMenuState,
  Shift,
  ShiftFormData,
  ViewMode,
} from "../types/shifts";
import { getDaysForView, TODAY } from "../utils/calendarUtils";
import { Toolbar } from "../components/shift-management/Toolbar";
import { EMPLOYEES, INITIAL_SHIFTS } from "../api/mock/shifts";
import { ShiftModal } from "../components/shift-management/ShiftModal";
import { ShiftSidePanel } from "../components/shift-management/ShiftSidePanle";
import { MonthlyCalendar } from "../components/shift-management/MonthlyCalendar";
import { ScheduleTable } from "../components/shift-management/ScheduleTable";
import { ContextMenu } from "../components/shift-management/ContextMenu";

export function ShiftManagementPage() {
  const [view, setView] = useState<ViewMode>("weekly");
  const [currentDate, setCurrentDate] = useState<Date>(TODAY);
  const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Close the context menu whenever the user clicks anywhere
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [contextMenu]);

  const filteredEmployees = EMPLOYEES.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const navigate = (direction: "prev" | "next") => {
    const delta = direction === "prev" ? -1 : 1;
    const next = new Date(currentDate);
    if (view === "daily") next.setDate(currentDate.getDate() + delta);
    if (view === "weekly") next.setDate(currentDate.getDate() + delta * 7);
    if (view === "monthly") next.setMonth(currentDate.getMonth() + delta);
    setCurrentDate(next);
  };

  // ── Modal handlers ──────────────────────────────────────────────────────────

  const openAddModal = () => {
    setEditingShift(null);
    setShowModal(true);
  };

  const openEditModal = (shift: Shift) => {
    setEditingShift(shift);
    setShowModal(true);
    setContextMenu(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingShift(null);
  };

  // ── Shift CRUD ──────────────────────────────────────────────────────────────

  const handleSaveShift = (formData: ShiftFormData, shiftId: string | null) => {
    const payload: Omit<Shift, "id"> = {
      employeeId: formData.employeeId,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      status: formData.status,
    };

    if (shiftId) {
      setShifts((prev) =>
        prev.map((s) => (s.id === shiftId ? { ...s, ...payload } : s)),
      );
    } else {
      setShifts((prev) => [...prev, { id: `s${Date.now()}`, ...payload }]);
    }
    closeModal();
  };

  const handleDeleteShift = (shiftId: string) => {
    if (!confirm("Are you sure you want to delete this shift?")) return;
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, shift: Shift) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, shift });
  };

  return (
    <div className="p-8 space-y-8 h-full flex flex-col relative">
      <PageHeader onAddShift={openAddModal} />

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col flex-1 overflow-hidden">
        <Toolbar
          view={view}
          onViewChange={setView}
          currentDate={currentDate}
          onPrevious={() => navigate("prev")}
          onNext={() => navigate("next")}
          onToday={() => setCurrentDate(TODAY)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="overflow-x-auto flex-1 flex flex-col">
          {view === "monthly" ? (
            <MonthlyCalendar
              shifts={shifts}
              onDayClick={setSelectedDate}
              currentDate={currentDate}
            />
          ) : (
            <ScheduleTable
              employees={filteredEmployees}
              days={getDaysForView(view, currentDate)}
              shifts={shifts}
              onContextMenu={handleContextMenu}
              onAddShift={openAddModal}
            />
          )}
        </div>
      </div>

      {/* Overlays — rendered at page level so they sit above everything */}

      {selectedDate && (
        <ShiftSidePanel
          date={selectedDate}
          shifts={shifts.filter((s) => s.date === selectedDate)}
          onClose={() => setSelectedDate(null)}
        />
      )}

      {showModal && (
        <ShiftModal
          editingShift={editingShift}
          onClose={closeModal}
          onSave={handleSaveShift}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          shift={contextMenu.shift}
          onEdit={openEditModal}
          onDelete={handleDeleteShift}
        />
      )}
    </div>
  );
}

export default ShiftManagementPage;
