"use client";
import React from "react";

export type Role = "patient" | "doctor";

interface RoleSelectorProps {
  selectedRole: Role;
  onRoleChange: (role: Role) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  return (
    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        type="button"
        onClick={() => onRoleChange("patient")}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          selectedRole === "patient"
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        }`}
      >
        👤 Patient
      </button>
      <button
        type="button"
        onClick={() => onRoleChange("doctor")}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          selectedRole === "doctor"
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        }`}
      >
        🩺 Doctor
      </button>
    </div>
  );
};

export default RoleSelector;
