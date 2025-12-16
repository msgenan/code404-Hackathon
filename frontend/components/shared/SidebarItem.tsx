"use client";

import React from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
        isActive
          ? "bg-gradient-to-r from-sky-50 to-emerald-50 text-slate-900 shadow-sm ring-1 ring-sky-100"
          : "text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm hover:ring-1 hover:ring-slate-100"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sky-600 transition ${
          isActive ? "bg-white ring-1 ring-sky-100" : "bg-slate-50 group-hover:bg-white"
        }`}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
};

export default SidebarItem;
