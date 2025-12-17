"use client";

import React, { useMemo, useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import DoctorCalendarPlaceholder, { Slot } from "./DoctorCalendarPlaceholder";
import { SidebarItemConfig } from "../shared/Sidebar";
import { getUserData, api } from "@/lib/api";

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
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUserData();
        setUserData(user);
        
        // Fetch doctor's appointments
        const appointmentsData: any = await api.getMyAppointments();
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const summaryCards: SummaryCard[] = useMemo(
    () => {
      const today = new Date().toDateString();
      const todayAppointments = appointments.filter(apt => 
        new Date(apt.start_time).toDateString() === today
      );
      const activeAppointments = appointments.filter(apt => apt.status === 'active');
      
      return [
        { label: "Today", value: `${todayAppointments.length} patients`, hint: `${activeAppointments.length} total active`, tone: "sky" },
        { label: "Appointments", value: `${appointments.length} total`, hint: `${todayAppointments.length} today`, tone: "emerald" },
        { label: "Status", value: userData?.department || "Doctor", hint: userData?.email || "", tone: "slate" },
      ];
    },
    [appointments, userData]
  );

  // Format appointments for display
  const formattedAppointments = useMemo(() => {
    return appointments.map(apt => ({
      time: new Date(apt.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      patient: apt.patient?.full_name || "Unknown Patient",
      type: apt.appointment_type || "Consultation",
      day: new Date(apt.start_time).toDateString() === new Date().toDateString() ? "Today" : new Date(apt.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      age: apt.patient?.age,
      gender: apt.patient?.gender,
      phone: apt.patient?.phone,
      email: apt.patient?.email,
      medicalHistory: apt.patient?.medical_history,
      allergies: apt.patient?.allergies,
      lastVisit: new Date(apt.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      notes: apt.notes || "No additional notes",
      status: apt.status
    }));
  }, [appointments]);

  const priorityPatients = useMemo(() => {
    // Filter patients with urgent medical conditions
    return appointments
      .filter(apt => {
        const history = apt.patient?.medical_history?.toLowerCase() || '';
        return history.includes('chest pain') || history.includes('severe') || history.includes('urgent');
      })
      .slice(0, 3)
      .map(apt => ({
        name: apt.patient?.full_name || "Unknown",
        priority: "High",
        condition: apt.patient?.medical_history || "No information"
      }));
  }, [appointments]);

  const waitingList = useMemo(() => {
    return appointments
      .filter(apt => apt.status === 'active')
      .map(apt => apt.patient?.full_name || "Unknown Patient");
  }, [appointments]);

  return (
    <DashboardLayout
      role="Doctor"
      userName={userData?.full_name || "Loading..."}
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
              {loading ? (
                <div className="text-center py-8 text-slate-600">Loading appointments...</div>
              ) : formattedAppointments.length === 0 ? (
                <div className="text-center py-8 text-slate-600">No appointments scheduled</div>
              ) : (
                formattedAppointments.map((apt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-2xl px-5 py-4 text-sm transition-all duration-150 bg-gradient-to-r from-sky-50 to-sky-50/50 ring-1 ring-sky-100 hover:ring-sky-200"
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
                    <button 
                      onClick={() => {
                        setSelectedPatient(apt);
                        setShowDetails(true);
                      }}
                      className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-600"
                    >
                      View Details
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-sky-100/50 ring-1 ring-slate-100 hover:shadow-2xl transition-shadow duration-200">
              <div className="flex items-center justify-between pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Waiting List</p>
                  <h4 className="text-xl font-bold text-slate-900">Priority Patients</h4>
                </div>
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">Urgent</span>
              </div>
              <ul className="space-y-3">
                {priorityPatients.map((item) => (
                    <li
                      key={item.name}
                      className={`flex items-center justify-between rounded-2xl bg-gradient-to-r px-5 py-3.5 text-sm font-semibold text-slate-700 ring-1 hover:ring-sky-200 transition-all duration-150 ${
                        item.priority === "High" 
                          ? "from-red-50 to-red-50/50 ring-red-100" 
                          : "from-amber-50 to-amber-50/50 ring-amber-100"
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            item.priority === "High" 
                              ? "bg-red-100 text-red-700" 
                              : "bg-amber-100 text-amber-700"
                          }`}>{item.priority}</span>
                          <span>{item.name}</span>
                        </div>
                        <span className="text-xs text-slate-600">{item.condition}</span>
                      </div>
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
            {waitingList.map((patient, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-50 to-slate-50/50 px-5 py-3.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-100 hover:ring-sky-200 transition-all duration-150"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700">#{idx + 1}</span>
                  <span>{patient}</span>
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

      {/* Patient Details Modal */}
      {showDetails && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowDetails(false)}>
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedPatient.patient}</h3>
                <p className="text-sm text-slate-600">{selectedPatient.type} · {selectedPatient.time}</p>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="rounded-full bg-slate-100 p-2 transition hover:bg-slate-200"
              >
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-white p-4 ring-1 ring-sky-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">Personal Info</p>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold text-slate-900">Age:</span> <span className="text-slate-600">{selectedPatient.age} years</span></p>
                    <p><span className="font-semibold text-slate-900">Gender:</span> <span className="text-slate-600">{selectedPatient.gender}</span></p>
                    <p><span className="font-semibold text-slate-900">Phone:</span> <span className="text-slate-600">{selectedPatient.phone}</span></p>
                    <p><span className="font-semibold text-slate-900">Email:</span> <span className="text-slate-600">{selectedPatient.email}</span></p>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white p-4 ring-1 ring-emerald-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">Medical History</p>
                  <p className="text-sm text-slate-700">{selectedPatient.medicalHistory}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-white p-4 ring-1 ring-amber-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">Allergies</p>
                  <p className="text-sm font-medium text-slate-700">{selectedPatient.allergies}</p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-white p-4 ring-1 ring-purple-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">Last Visit</p>
                  <p className="text-sm text-slate-700">{selectedPatient.lastVisit}</p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white p-4 ring-1 ring-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Notes</p>
                  <p className="text-sm text-slate-700">{selectedPatient.notes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorDashboard;
