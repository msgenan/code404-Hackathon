"use client";

import React, { useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import DoctorCalendarPlaceholder, { Slot } from "./DoctorCalendarPlaceholder";
import DoctorCalendar, { buildDoctorCalendarData } from "./DoctorCalendar";
import { SidebarItemConfig } from "../shared/Sidebar";

interface SummaryCard {
  label: string;
  value: string;
  hint: string;
  tone: "sky" | "emerald" | "slate";
}

const doctorNav: SidebarItemConfig[] = [
  {
    key: "dashboard",
    label: "Ana Sayfa",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 11h16" />
        <path d="M4 6h10" />
        <path d="M4 16h8" />
        <path d="M4 4v16" />
        <path d="M14 9V4" />
      </svg>
    ),
  },
  {
    key: "calendar",
    label: "Takvim",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M3 11h18" />
      </svg>
    ),
  },
];

const toneStyles: Record<SummaryCard["tone"], string> = {
  sky: "bg-gradient-to-br from-sky-50 to-white text-sky-800 ring-1 ring-sky-100",
  emerald: "bg-gradient-to-br from-emerald-50 to-white text-emerald-800 ring-1 ring-emerald-100",
  slate: "bg-gradient-to-br from-slate-50 to-white text-slate-800 ring-1 ring-slate-100",
};

const DoctorDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");

  const summaryCards: SummaryCard[] = useMemo(
    () => [
      { label: "Bugün", value: "18 hasta", hint: "6 randevulu · 3 aynı gün", tone: "sky" },
      { label: "Bekleyenler", value: "09 kişi", hint: "Ort. bekleme 12dk", tone: "emerald" },
    ],
    []
  );

  const { timeSlots, rows } = useMemo(() => buildDoctorCalendarData(), []);

  const rooms = ["Room A", "Room B", "Room C"]; 
  const slots: Slot[] = [
    { time: "09:00", label: "Dr. Smith", state: "busy" },
    { time: "10:00", label: "New consult", state: "available" },
    { time: "11:00", label: "Follow-up", state: "available" },
    { time: "12:00", label: "—", state: "empty" },
  ];

  return (
    <DashboardLayout
      role="Doktor"
      userName="Dr. Amara Chen"
      items={doctorNav}
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
    >
      {activeMenu === "dashboard" && (
        <>
          <section className="grid gap-4 md:grid-cols-2">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-2xl px-5 py-4 shadow-md shadow-sky-50 transition hover:-translate-y-0.5 hover:shadow-lg ${toneStyles[card.tone]}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">{card.label}</p>
                <p className="text-2xl font-bold leading-tight">{card.value}</p>
                <p className="text-sm text-slate-600">{card.hint}</p>
              </div>
            ))}
          </section>

          <DoctorCalendar timeSlots={timeSlots} rows={rows} />
        </>
      )}

      {activeMenu === "calendar" && <DoctorCalendar timeSlots={timeSlots} rows={rows} />}
    </DashboardLayout>
  );
};

export default DoctorDashboard;
