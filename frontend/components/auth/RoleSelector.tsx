"use client";
import React from "react";

export type Role = "doctor" | "patient";

export interface RoleSelectorProps {
  value: Role;
  onChange: (role: Role) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg">
      <label
        className={`flex-1 text-center py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-150
          ${value === "doctor" ? "bg-white text-sky-600 shadow" : "text-slate-600 hover:bg-transparent"}`}
      >
        <input
          type="radio"
          name="role"
          value="doctor"
          checked={value === "doctor"}
          onChange={() => onChange("doctor")}
          className="sr-only"
          aria-label="Doctor"
        />
        Doctor
      </label>

      <label
        className={`flex-1 text-center py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-150
          ${value === "patient" ? "bg-white text-sky-600 shadow" : "text-slate-600 hover:bg-transparent"}`}
      >
        <input
          type="radio"
          name="role"
          value="patient"
          checked={value === "patient"}
          onChange={() => onChange("patient")}
          className="sr-only"
          aria-label="Patient"
        />
        Patient
      </label>
    </div>
  );
};

export default RoleSelector;
