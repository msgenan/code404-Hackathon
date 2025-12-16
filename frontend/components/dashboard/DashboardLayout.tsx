"use client";
import React, { useEffect, useMemo, useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";
import { Role } from "./types";

const menuItems = [
  { label: "Dashboard" },
  { label: "Calendar" },
  { label: "Waiting List" },
  { label: "Pager Chat" },
];

const DashboardLayout: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const role: Role = "Patient";

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const syncState = (event: MediaQueryList | MediaQueryListEvent) => {
      setIsMobile(event.matches);
      if (event.matches) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    syncState(media);
    media.addEventListener("change", syncState);
    return () => media.removeEventListener("change", syncState);
  }, []);

  const title = useMemo(() => menuItems[activeIndex].label, [activeIndex]);
  const description = useMemo(() => {
    switch (activeIndex) {
      case 0:
        return "Overview of your clinic activity.";
      case 1:
        return "Manage appointments and schedules.";
      case 2:
        return "Track the live waiting list.";
      case 3:
        return "Chat with clinic staff using pager-style messaging.";
      default:
        return undefined;
    }
  }, [activeIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      {/* Ambient blobs like welcome page */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-sky-100 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-100 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-12 py-6 space-y-6">
        <Topbar
          clinicName="Code404 Health"
          role={role}
          isMobile={isMobile}
          onToggleSidebar={() => setCollapsed((c) => !c)}
        />

        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <Sidebar
            items={menuItems}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            collapsed={collapsed}
          />

          <main className="min-h-[480px]">
            <DashboardContent title={title} description={description} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
