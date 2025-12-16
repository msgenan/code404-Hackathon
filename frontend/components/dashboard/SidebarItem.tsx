"use client";
import React from "react";
import { SidebarItemProps } from "./types";

const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition",
        active
          ? "bg-slate-100 text-slate-900 shadow-sm"
          : "text-slate-700 hover:bg-slate-100",
      ].join(" ")}
    >
      <span className="h-5 w-5 text-slate-500">
        {icon ?? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <rect x="4" y="4" width="16" height="16" rx="3" />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </button>
  );
};

export default SidebarItem;
