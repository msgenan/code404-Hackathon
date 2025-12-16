"use client";
import React from "react";
import SidebarItem from "./SidebarItem";
import { SidebarProps } from "./types";

const Sidebar: React.FC<SidebarProps> = ({ items, activeIndex, onSelect, collapsed }) => {
  return (
    <aside
      className={[
        "bg-white rounded-xl shadow-md shadow-sky-100 ring-1 ring-slate-100",
        "p-3",
        collapsed ? "hidden md:block md:w-64" : "w-64",
      ].join(" ")}
    >
      <nav className="space-y-1">
        {items.map((item, idx) => (
          <SidebarItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            active={idx === activeIndex}
            onClick={() => onSelect(idx)}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
