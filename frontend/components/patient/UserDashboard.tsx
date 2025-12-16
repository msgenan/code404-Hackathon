"use client";

import React, { useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import UserCalendarPlaceholder, { Slot } from "./UserCalendarPlaceholder";
import { SidebarItemConfig } from "../shared/Sidebar";
import { AppointmentItem } from "./AppointmentCard";

interface SummaryCard {
  label: string;
  value: string;
  hint: string;
  tone: "sky" | "emerald" | "slate";
}

const patientNav: SidebarItemConfig[] = [
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
    key: "appointments",
    label: "Appointments",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M3 11h18" />
        <path d="M8 15h2" />
        <path d="M14 15h2" />
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

const UserDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");

  const summaryCards: SummaryCard[] = useMemo(
    () => [
      { label: "Next visit", value: "Jan 12 · 10:30", hint: "Dr. Smith · Room B", tone: "sky" },
      { label: "Queue", value: "You are #04", hint: "Estimated 14 minutes", tone: "emerald" },
      { label: "Reminders", value: "2 tasks", hint: "Bring ID · Previous labs", tone: "slate" },
    ],
    []
  );

  return (
    <DashboardLayout
      role="Patient"
      userName="Aylin Demir"
      items={patientNav}
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

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-4 shadow-xl shadow-sky-50 ring-1 ring-slate-100">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Waiting List</p>
                  <h4 className="text-lg font-bold text-slate-900">Live status</h4>
                </div>
                <span className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">Live</span>
              </div>
              <ul className="space-y-2">
                {["#04 · You · 14m", "#05 · R. Kaya · 18m", "#06 · T. Sousa · 21m"].map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-100"
                  >
                    <span>{item}</span>
                    <span className="text-xs text-slate-500">Pager updates</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

      {activeMenu === "appointments" && (
        <section className="rounded-3xl bg-white p-4 shadow-xl shadow-sky-50 ring-1 ring-slate-100">
          <div className="pb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">My Appointments</p>
            <h4 className="text-lg font-bold text-slate-900">Upcoming visits</h4>
          </div>
          <p className="text-sm text-slate-500">No appointments scheduled yet.</p>
        </section>
      )}

      {activeMenu === "waiting" && (
        <section className="rounded-3xl bg-white p-4 shadow-xl shadow-sky-50 ring-1 ring-slate-100">
          <div className="flex items-center justify-between pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Waiting List</p>
              <h4 className="text-lg font-bold text-slate-900">Live status</h4>
            </div>
            <span className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">Live</span>
          </div>
          <ul className="space-y-2">
            {["#04 · You · 14m", "#05 · R. Kaya · 18m", "#06 · T. Sousa · 21m"].map((item) => (
              <li
                key={item}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-100"
              >
                <span>{item}</span>
                <span className="text-xs text-slate-500">Pager updates</span>
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
            <span className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">Live</span>
          </div>
          <div className="space-y-2">
            {["Front desk: Arrival confirmed", "Nurse: Vitals soon", "Billing: Coverage check"].map((topic) => (
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

export default UserDashboard;
