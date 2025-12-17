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
    label: "Dashboard",
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
    label: "Calendar",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M3 11h18" />
      </svg>
    ),
  },
  {
    key: "waiting",
    label: "Waiting List",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 20h16" />
        <path d="M6 16v-5a6 6 0 1 1 12 0v5" />
        <path d="M8 20v-2a4 4 0 0 1 8 0v2" />
      </svg>
    ),
  },
  {
    key: "pager",
    label: "Pager Chat",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 11.5a8.5 8.5 0 1 0-4.675 7.6L21 21z" />
        <path d="M8 12h5" />
        <path d="M8 9h8" />
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
      { label: "Today", value: "18 patients", hint: "6 booked · 3 walk-ins", tone: "sky" },
      { label: "Waiting", value: "09 in queue", hint: "Avg wait 12m", tone: "emerald" },
      { label: "Alerts", value: "2 escalations", hint: "Pager chat pending", tone: "slate" },
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
      role="Doctor"
      userName="Dr. Amara Chen"
      items={doctorNav}
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
    >
      {activeMenu === "dashboard" && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
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

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-4 shadow-xl shadow-sky-50 ring-1 ring-slate-100">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Waiting List</p>
                  <h4 className="text-lg font-bold text-slate-900">Priority patients</h4>
                </div>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-100">Live</span>
              </div>
              <ul className="space-y-2">
                {["Aziz Karim · Chest pain", "Leila Aydin · Post-op check", "Marcus Lee · Lab review"].map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-100"
                  >
                    <span>{item}</span>
                    <span className="text-xs text-slate-500">ETA 8m</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-xl shadow-sky-50 ring-1 ring-slate-100">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Pager Chat</p>
                  <h4 className="text-lg font-bold text-slate-900">Recent threads</h4>
                </div>
                <span className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">Muted</span>
              </div>
              <div className="space-y-2">
                {["Pharmacy: Dose clarification", "Nurse: Vitals trending", "Admin: Room swap"].map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:shadow"
                  >
                    <span>{topic}</span>
                    <span className="text-xs text-slate-500">Just now</span>
                  </div>
                ))}
                <p className="rounded-2xl bg-white px-4 py-3 text-xs text-slate-500 ring-1 ring-dashed ring-slate-200">
                  Connect to real-time messaging to sync pager threads.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeMenu === "calendar" && <DoctorCalendar timeSlots={timeSlots} rows={rows} />}

      {activeMenu === "waiting" && (
        <section className="rounded-3xl bg-white p-4 shadow-xl shadow-sky-50 ring-1 ring-slate-100">
          <div className="flex items-center justify-between pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Waiting List</p>
              <h4 className="text-lg font-bold text-slate-900">Priority patients</h4>
            </div>
            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-100">Live</span>
          </div>
          <ul className="space-y-2">
            {["Aziz Karim · Chest pain", "Leila Aydin · Post-op check", "Marcus Lee · Lab review"].map((item) => (
              <li
                key={item}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-100"
              >
                <span>{item}</span>
                <span className="text-xs text-slate-500">ETA 8m</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {activeMenu === "pager" && (
        <section className="rounded-3xl bg-white p-4 shadow-xl shadow-sky-50 ring-1 ring-slate-100">
          <div className="flex items-center justify-between pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Pager Chat</p>
              <h4 className="text-lg font-bold text-slate-900">Recent threads</h4>
            </div>
            <span className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">Muted</span>
          </div>
          <div className="space-y-2">
            {["Pharmacy: Dose clarification", "Nurse: Vitals trending", "Admin: Room swap"].map((topic) => (
              <div
                key={topic}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:shadow"
              >
                <span>{topic}</span>
                <span className="text-xs text-slate-500">Just now</span>
              </div>
            ))}
            <p className="rounded-2xl bg-white px-4 py-3 text-xs text-slate-500 ring-1 ring-dashed ring-slate-200">
              Connect to real-time messaging to sync pager threads.
            </p>
          </div>
        </section>
      )}
    </DashboardLayout>
  );
};

export default DoctorDashboard;
