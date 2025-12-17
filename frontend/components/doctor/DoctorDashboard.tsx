"use client";

import React, { useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import DoctorCalendarPlaceholder, { Slot } from "./DoctorCalendarPlaceholder";
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

  const appointments = [
    { time: "09:00", patient: "John Doe", type: "Consultation", day: "Today" },
    { time: "10:00", patient: "Jane Smith", type: "Follow-up", day: "Today" },
    { time: "11:00", patient: "Available", type: "—", day: "Today" },
    { time: "14:00", patient: "Mike Johnson", type: "Check-up", day: "Today" },
    { time: "15:30", patient: "Sarah Williams", type: "Consultation", day: "Today" },
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
          <section className="grid gap-5 md:grid-cols-3 mb-6">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-2xl px-6 py-5 shadow-lg shadow-sky-100/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${toneStyles[card.tone]}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 mb-2">{card.label}</p>
                <p className="text-3xl font-bold leading-tight mb-1">{card.value}</p>
                <p className="text-sm text-slate-600">{card.hint}</p>
              </div>
            ))}
          </section>

          <section className="mb-6 rounded-3xl bg-white p-6 shadow-xl shadow-sky-100/50 ring-1 ring-slate-100">
            <div className="flex items-center justify-between pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Schedule</p>
                <h4 className="text-xl font-bold text-slate-900">Today's Appointments</h4>
              </div>
            </div>
            <div className="space-y-2">
              {appointments.map((apt, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between rounded-2xl px-5 py-4 text-sm transition-all duration-150 ${
                    apt.patient === "Available"
                      ? "bg-gradient-to-r from-emerald-50 to-emerald-50/50 ring-1 ring-emerald-100"
                      : "bg-gradient-to-r from-sky-50 to-sky-50/50 ring-1 ring-sky-100 hover:ring-sky-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                      {apt.time}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{apt.patient}</p>
                      <p className="text-xs text-slate-600">{apt.type}</p>
                    </div>
                  </div>
                  {apt.patient !== "Available" && (
                    <button className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-600">
                      View Details
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-sky-100/50 ring-1 ring-slate-100 hover:shadow-2xl transition-shadow duration-200">
              <div className="flex items-center justify-between pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Waiting List</p>
                  <h4 className="text-xl font-bold text-slate-900">All Patients</h4>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">Live</span>
              </div>
              <ul className="space-y-3">
                {["Aziz Karim", "Leila Aydin", "Marcus Lee", "Sarah Chen", "Tom Wilson"].map((item, idx) => (
                  <li
                    key={item}
                    className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-50 to-slate-50/50 px-5 py-3.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-100 hover:ring-sky-200 transition-all duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700">#{idx + 1}</span>
                      <span>{item}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">Waiting</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-sky-100/50 ring-1 ring-slate-100 hover:shadow-2xl transition-shadow duration-200">
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
                <p className="rounded-2xl bg-sky-50/50 px-5 py-3.5 text-xs text-slate-600 ring-1 ring-dashed ring-sky-200">
                  Connect to real-time messaging to sync pager threads.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeMenu === "waiting" && (
        <section className="rounded-3xl bg-white p-6 shadow-xl shadow-sky-100/50 ring-1 ring-slate-100">
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Waiting List</p>
              <h4 className="text-xl font-bold text-slate-900">All Patients</h4>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">Live</span>
          </div>
          <ul className="space-y-3">
            {["Aziz Karim", "Leila Aydin", "Marcus Lee", "Sarah Chen", "Tom Wilson", "Emma Davis", "Ryan Brown"].map((item, idx) => (
              <li
                key={item}
                className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-50 to-slate-50/50 px-5 py-3.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-100 hover:ring-sky-200 transition-all duration-150"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700">#{idx + 1}</span>
                  <span>{item}</span>
                </div>
                <span className="text-xs font-medium text-slate-500">Waiting</span>
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
