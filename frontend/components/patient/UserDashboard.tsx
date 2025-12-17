"use client";

import React, { useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import UserCalendarPlaceholder, { Slot } from "./UserCalendarPlaceholder";
import { SidebarItemConfig } from "../shared/Sidebar";
import { AppointmentItem } from "./AppointmentCard";
import BookingCalendar from "./BookingCalendar";

interface SummaryCard {
  label: string;
  value: string;
  hint: string;
  tone: "sky" | "emerald" | "slate";
}

type QuickAction = "book" | "records" | "refill" | "support" | null;

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

const departments = [
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
  "General Medicine",
  "Gastroenterology",
  "Pulmonology",
];

const UserDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [quickAction, setQuickAction] = useState<QuickAction>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

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
      {activeMenu === "dashboard" && !quickAction && (
        <>
          <section className="grid gap-5 md:grid-cols-3 mb-8">
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

          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-sky-100/50 ring-1 ring-slate-100 hover:shadow-2xl transition-shadow duration-200">
            <div className="flex items-center justify-between pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Quick Actions</p>
                <h4 className="text-xl font-bold text-slate-900">What would you like to do?</h4>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <button 
                onClick={() => setQuickAction("book")}
                className="rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100/50 px-6 py-5 text-left ring-1 ring-sky-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:ring-sky-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <svg className="h-6 w-6 text-sky-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M7 3v4" />
                    <path d="M17 3v4" />
                    <rect x="4" y="5" width="16" height="16" rx="2" />
                    <path d="M3 11h18" />
                    <path d="M8 15h2" />
                    <path d="M14 15h2" />
                  </svg>
                  <h5 className="text-lg font-bold text-slate-900">Book Appointment</h5>
                </div>
                <p className="text-sm text-slate-600">Schedule a visit with your doctor</p>
              </button>
              <button 
                onClick={() => setQuickAction("records")}
                className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 px-6 py-5 text-left ring-1 ring-emerald-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:ring-emerald-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12h6" />
                    <path d="M12 9v6" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <h5 className="text-lg font-bold text-slate-900">View Medical Records</h5>
                </div>
                <p className="text-sm text-slate-600">Access your health history</p>
              </button>
              <button 
                onClick={() => setQuickAction("refill")}
                className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 px-6 py-5 text-left ring-1 ring-purple-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:ring-purple-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M3 10h18" />
                    <path d="M8 14h.01" />
                    <path d="M12 14h.01" />
                    <path d="M16 14h.01" />
                  </svg>
                  <h5 className="text-lg font-bold text-slate-900">Prescription Refill</h5>
                </div>
                <p className="text-sm text-slate-600">Request medication refills</p>
              </button>
              <button 
                onClick={() => setQuickAction("support")}
                className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 px-6 py-5 text-left ring-1 ring-orange-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:ring-orange-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 11.5a8.5 8.5 0 1 0-4.675 7.6L21 21z" />
                    <path d="M8 12h5" />
                    <path d="M8 9h8" />
                  </svg>
                  <h5 className="text-lg font-bold text-slate-900">Contact Support</h5>
                </div>
                <p className="text-sm text-slate-600">Get help from our team</p>
              </button>
            </div>
          </section>
        </>
      )}

      {/* Book Appointment Flow */}
      {activeMenu === "dashboard" && quickAction === "book" && !selectedDepartment && (
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuickAction(null)}
              className="rounded-xl bg-white p-2 text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Book Appointment</p>
              <h4 className="text-2xl font-bold text-slate-900">Select Department</h4>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className="group rounded-3xl bg-white p-6 text-left shadow-lg shadow-sky-100/50 ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-sky-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xl font-bold text-slate-900 mb-2">{dept}</h5>
                    <p className="text-sm text-slate-600">View available appointments</p>
                  </div>
                  <svg className="h-8 w-8 text-slate-300 transition-colors group-hover:text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {activeMenu === "dashboard" && quickAction === "book" && selectedDepartment && (
        <BookingCalendar
          selectedDepartment={selectedDepartment}
          onBack={() => {
            setSelectedDepartment(null);
            setQuickAction(null);
          }}
        />
      )}

      {/* Medical Records View */}
      {activeMenu === "dashboard" && quickAction === "records" && (
        <section className="rounded-3xl bg-white p-6 shadow-xl shadow-sky-100/50 ring-1 ring-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setQuickAction(null)}
              className="rounded-xl bg-slate-50 p-2 text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-600">Medical Records</p>
              <h4 className="text-xl font-bold text-slate-900">Your Health History</h4>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white px-6 py-12 text-center ring-1 ring-emerald-100">
            <svg className="mx-auto h-16 w-16 text-emerald-400 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 12h6" />
              <path d="M12 9v6" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <p className="text-lg font-bold text-slate-900 mb-2">No Medical Records</p>
            <p className="text-sm text-slate-600">Your medical records will appear here once you have appointments</p>
          </div>
        </section>
      )}

      {/* Prescription Refill View */}
      {activeMenu === "dashboard" && quickAction === "refill" && (
        <section className="rounded-3xl bg-white p-6 shadow-xl shadow-sky-100/50 ring-1 ring-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setQuickAction(null)}
              className="rounded-xl bg-slate-50 p-2 text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-purple-600">Prescriptions</p>
              <h4 className="text-xl font-bold text-slate-900">Prescription Refills</h4>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-white px-6 py-12 text-center ring-1 ring-purple-100">
            <svg className="mx-auto h-16 w-16 text-purple-400 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M3 10h18" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
            </svg>
            <p className="text-lg font-bold text-slate-900 mb-2">No Prescriptions</p>
            <p className="text-sm text-slate-600">You don&apos;t have any active prescriptions at the moment</p>
          </div>
        </section>
      )}

      {activeMenu === "appointments" && (
        <section className="rounded-3xl bg-white p-6 shadow-xl shadow-sky-100/50 ring-1 ring-slate-100">
          <div className="pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">My Appointments</p>
            <h4 className="text-xl font-bold text-slate-900">Upcoming visits</h4>
          </div>
          <div className="rounded-2xl bg-slate-50 px-6 py-8 text-center ring-1 ring-slate-100">
            <svg className="mx-auto h-12 w-12 text-slate-400 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M7 3v4" />
              <path d="M17 3v4" />
              <rect x="4" y="5" width="16" height="16" rx="2" />
              <path d="M3 11h18" />
            </svg>
            <p className="text-sm font-medium text-slate-600 mb-2">No appointments scheduled yet</p>
            <p className="text-xs text-slate-500">Book your first appointment to get started</p>
          </div>
        </section>
      )}

      {activeMenu === "pager" && (
        <section className="rounded-3xl bg-white p-6 shadow-xl shadow-sky-100/50 ring-1 ring-slate-100 hover:shadow-2xl transition-shadow duration-200">
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Pager Chat</p>
              <h4 className="text-xl font-bold text-slate-900">Recent threads</h4>
            </div>
            <span className="rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md">Live</span>
          </div>
          <div className="space-y-3">
            {["Front desk: Arrival confirmed", "Nurse: Vitals soon", "Billing: Coverage check"].map((topic) => (
              <div
                key={topic}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50/50 px-5 py-3.5 text-sm text-slate-700 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-sky-200"
              >
                <span>{topic}</span>
                <span className="text-xs font-medium text-slate-500">Just now</span>
              </div>
            ))}
            <p className="rounded-2xl bg-sky-50/50 px-5 py-3.5 text-xs text-slate-600 ring-1 ring-dashed ring-sky-200">
              Connect to real-time messaging to sync pager threads.
            </p>
          </div>
        </section>
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;
