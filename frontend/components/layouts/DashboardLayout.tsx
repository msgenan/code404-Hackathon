"use client";

import React, { ReactNode } from "react";
import Topbar from "../shared/Topbar";
import Sidebar, { SidebarItemConfig } from "../shared/Sidebar";

type Role = "Doctor" | "Patient";

interface DashboardLayoutProps {
  role: Role;
  userName: string;
  appName?: string;
  items: SidebarItemConfig[];
  activeMenu: string;
  onMenuChange: (key: string) => void;
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  role,
  userName,
  appName = "Code404 Health",
  items,
  activeMenu,
  onMenuChange,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-0 px-3 sm:px-6 lg:px-10">
        <Sidebar items={items} activeItem={activeMenu} onSelect={onMenuChange} role={role} />

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden rounded-none bg-white/90 shadow-2xl shadow-sky-50 ring-1 ring-slate-100 lg:rounded-3xl lg:ring-0">
          <Topbar appName={appName} userName={userName} role={role} />
          <main className="flex-1 overflow-y-auto bg-slate-50/60 px-4 py-6 sm:px-6 md:px-8 lg:px-10">
            <div className="space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
