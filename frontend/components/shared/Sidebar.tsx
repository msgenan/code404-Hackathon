"use client";

import React from "react";
import SidebarItem from "./SidebarItem";

type Role = "Doctor" | "Patient";

export interface SidebarItemConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItemConfig[];
  activeItem: string;
  onSelect: (key: string) => void;
  role: Role;
}

const Sidebar: React.FC<SidebarProps> = ({ items, activeItem, onSelect, role }) => {
  return (
    <aside className="hidden min-h-screen w-[260px] shrink-0 flex-col justify-between border-r border-slate-100 bg-white/80 px-4 py-6 shadow-lg shadow-slate-100 ring-1 ring-slate-100 backdrop-blur lg:flex">
      <div className="space-y-5">
        <div className="rounded-2xl bg-gradient-to-r from-sky-500/90 to-emerald-500/90 px-4 py-4 text-white shadow-lg shadow-sky-100">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] opacity-90">{role} Mode</p>
          <p className="text-lg font-bold">Navigation</p>
          <p className="text-sm opacity-90">Stay in sync with your day.</p>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.key}
              onClick={() => onSelect(item.key)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500 ring-1 ring-slate-100">
        <p className="font-semibold text-slate-700">Need help?</p>
        <p>Chat with support or review onboarding in a minute.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
