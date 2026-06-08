import { useState } from "react";
import { Shift, ShiftFormData, ShiftStatus } from "../../types/shifts";
import { EMPTY_FORM } from "../../utils/calendarUtils";
import { DEPARTMENTS, EMPLOYEES } from "../../api/mock/shifts";
import { ChevronDown, Edit, Plus, X } from "lucide-react";

interface ShiftModalProps {
  editingShift: Shift | null;
  onClose: () => void;
  onSave: (formData: ShiftFormData, shiftId: string | null) => void;
}

export function ShiftModal({ editingShift, onClose, onSave }: ShiftModalProps) {
  // Initialise form from the shift being edited, or start blank
  const [form, setForm] = useState<ShiftFormData>(() => {
    if (!editingShift) return { ...EMPTY_FORM };
    const emp = EMPLOYEES.find((e) => e.id === editingShift.employeeId);
    return {
      departmentId: emp?.departmentId ?? "",
      employeeId: editingShift.employeeId,
      date: editingShift.date,
      startTime: editingShift.startTime,
      endTime: editingShift.endTime,
      location: editingShift.location,
      status: editingShift.status,
    };
  });

  const update = <K extends keyof ShiftFormData>(
    field: K,
    value: ShiftFormData[K],
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      departmentId: e.target.value,
      employeeId: "",
    }));
  };

  const handleSubmit = () => {
    const { employeeId, date, startTime, endTime, location } = form;
    if (!employeeId || !date || !startTime || !endTime || !location) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave(form, editingShift?.id ?? null);
  };

  const availableEmployees = form.departmentId
    ? EMPLOYEES.filter((emp) => emp.departmentId === form.departmentId)
    : EMPLOYEES;

  const isEditing = !!editingShift;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0B1D3A]">
              {isEditing ? "Edit Shift" : "Add New Shift"}
            </h2>
            <p className="text-sm text-[#5A6B7F] mt-1">
              {isEditing
                ? "Update shift details"
                : "Schedule a new shift for an employee"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <FormField label="Department" required>
            <SelectInput
              value={form.departmentId}
              onChange={handleDepartmentChange}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </SelectInput>
          </FormField>

          <FormField
            label="Employee"
            required
            hint={
              !form.departmentId
                ? "Please select a department first"
                : undefined
            }
          >
            <SelectInput
              value={form.employeeId}
              onChange={(e) => update("employeeId", e.target.value)}
              disabled={!form.departmentId}
            >
              <option value="">Select an employee</option>
              {availableEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} – {emp.role}
                </option>
              ))}
            </SelectInput>
          </FormField>

          <FormField label="Date" required>
            <TextInput
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Time" required>
              <TextInput
                type="time"
                value={form.startTime}
                onChange={(e) => update("startTime", e.target.value)}
              />
            </FormField>
            <FormField label="End Time" required>
              <TextInput
                type="time"
                value={form.endTime}
                onChange={(e) => update("endTime", e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Location" required>
            <TextInput
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g., Main Office, Remote, Branch A"
            />
          </FormField>

          <FormField label="Status" required>
            <div className="flex items-center gap-6">
              {(["draft", "published"] as ShiftStatus[]).map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={form.status === status}
                    onChange={() => update("status", status)}
                    className="w-4 h-4 text-[#E8A317] border-gray-300 focus:ring-[#E8A317]"
                  />
                  <span className="text-sm text-[#0B1D3A] capitalize">
                    {status}
                  </span>
                </label>
              ))}
            </div>
          </FormField>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-[#5A6B7F] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#0B1D3A] rounded-lg hover:bg-[#152a4f] transition-colors flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <Edit size={16} /> Update Shift
              </>
            ) : (
              <>
                <Plus size={16} /> Add Shift
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function FormField({ label, required, hint, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0B1D3A] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-[#5A6B7F] mt-1.5">{hint}</p>}
    </div>
  );
}

interface SelectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function SelectInput({
  value,
  onChange,
  disabled,
  children,
}: SelectInputProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#E8A317] focus:border-transparent text-[#0B1D3A] appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        {children}
      </select>
      <ChevronDown
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}

interface TextInputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function TextInput({
  type = "text",
  value,
  onChange,
  placeholder,
}: TextInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#E8A317] focus:border-transparent text-[#0B1D3A] placeholder:text-gray-400"
    />
  );
}
