"use client";

import React, { useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import UserCalendarPlaceholder, { Slot } from "./UserCalendarPlaceholder";
import { SidebarItemConfig } from "../shared/Sidebar";
import { AppointmentItem } from "./AppointmentCard";
import AppointmentsList from "./AppointmentsList";
import AvailableSlots, { buildAvailableSlotsData } from "./AvailableSlots";

interface SummaryCard {
  label: string;
  value: string;
  hint: string;
  tone: "sky" | "emerald" | "slate";
}

const patientNav: SidebarItemConfig[] = [
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
    key: "appointments",
    label: "Randevularım",
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

const UserDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");

  const summaryCards: SummaryCard[] = useMemo(
    () => [
      { label: "Sıradaki Randevu", value: "12 Ocak · 10:30", hint: "Dr. Smith · B Odası", tone: "sky" },
      { label: "Sıra Durumum", value: "Sırada #04", hint: "Tahmini 14 dakika", tone: "emerald" },
    ],
    []
  );

  const myAppointments: AppointmentItem[] = useMemo(
    () => [
      {
        id: "apt-1",
        doctor: "Dr. Smith",
        datetime: "Jan 12, 2025 · 10:30 AM",
        location: "Room B",
        status: "upcoming",
        note: "General checkup",
        specialty: "General Medicine",
      },
      {
        id: "apt-2",
        doctor: "Dr. Patel",
        datetime: "Dec 15, 2024 · 02:00 PM",
        location: "Room A",
        status: "completed",
        specialty: "Cardiology",
      },
      {
        id: "apt-3",
        doctor: "Dr. Kim",
        datetime: "Dec 10, 2024 · 11:00 AM",
        location: "Room C",
        status: "cancelled",
        note: "Rescheduled due to conflict",
        specialty: "Orthopedics",
      },
    ],
    []
  );

  const availableSlots = useMemo(() => buildAvailableSlotsData(), []);

  const doctors = ["Dr. Smith", "Dr. Patel", "Dr. Alvarez"];
  const slots: Slot[] = [
    { time: "09:00", label: "Open", state: "available" },
    { time: "10:00", label: "Booked", state: "booked" },
    { time: "11:00", label: "Open", state: "available" },
    { time: "12:00", label: "-", state: "empty" },
  ];

  return (
    <DashboardLayout
      role="Hasta"
      userName="Aylin Demir"
      items={patientNav}
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

          <section>
            <div className="rounded-3xl bg-white p-5 shadow-xl shadow-sky-50 ring-1 ring-slate-100">
              <div className="flex items-center justify-between pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Bekleme Listesi</p>
                  <h4 className="text-lg font-bold text-slate-900">Anlık Durum</h4>
                </div>
                <span className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">Canlı</span>
              </div>
              <ul className="space-y-2">
                {["#04 · Siz · 14 dk", "#05 · R. Kaya · 18 dk", "#06 · T. Sousa · 21 dk"].map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-100"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

      {activeMenu === "appointments" && (
        <>
          <AppointmentsList appointments={myAppointments} />
          <div className="mt-4">
            <AvailableSlots slots={availableSlots} />
          </div>
        </>
      )}


    </DashboardLayout>
  );
};

export default UserDashboard;
