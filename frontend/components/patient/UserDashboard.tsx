"use client";

import React, { useMemo, useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import UserCalendarPlaceholder, { Slot } from "./UserCalendarPlaceholder";
import { SidebarItemConfig } from "../shared/Sidebar";
import { AppointmentItem } from "./AppointmentCard";
import BookingCalendar from "./BookingCalendar";
import ProfileCompletionModal from "../shared/ProfileCompletionModal";
import { api, getUserData, User, Appointment } from "@/lib/api";

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
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfileBanner, setShowProfileBanner] = useState(true);

  const fetchAppointments = async () => {
    try {
      const appointmentsData: any = await api.getMyAppointments();
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUserData();
        setUserData(user);
        
        await fetchAppointments();
        
        const doctorsData: any = await api.getDoctors();
        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);

        // Check profile completion
        const completionData: any = await api.checkProfileCompletion();
        setProfileCompletion(completionData);
        if (!completionData.is_complete) {
          setShowProfileBanner(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      // Refresh profile completion status
      const completionData: any = await api.checkProfileCompletion();
      setProfileCompletion(completionData);
      
      // Refresh user data
      const user = await api.getCurrentUser();
      setUserData(user);
      
      if (completionData.is_complete) {
        setShowProfileBanner(false);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  const summaryCards: SummaryCard[] = useMemo(
    () => {
      const nextAppointment = appointments[0];
      const nextVisit = nextAppointment 
        ? `${new Date(nextAppointment.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${new Date(nextAppointment.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
        : "No upcoming visits";
      
      return [
        { label: "Next visit", value: nextVisit, hint: nextAppointment ? `${nextAppointment.doctor?.full_name || 'Doctor'}` : "Schedule an appointment", tone: "sky" },
        { label: "Appointments", value: `${appointments.length} total`, hint: `${appointments.filter((a: any) => a.status === 'active').length} active`, tone: "emerald" },
        { label: "Profile", value: userData?.full_name?.split(' ')[0] || "User", hint: userData?.email || "", tone: "slate" },
      ];
    },
    [appointments, userData]
  );

  return (
    <DashboardLayout
      role="Patient"
      userName={userData?.full_name || "Loading..."}
      items={patientNav}
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
    >
      {activeMenu === "dashboard" && !quickAction && (
        <>
          {/* Profile Completion Banner */}
          {profileCompletion && !profileCompletion.is_complete && showProfileBanner && (
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-5 ring-1 ring-amber-200 shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">Complete Your Profile</h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Your profile is {profileCompletion.completion_percentage}% complete. 
                      Please fill in the missing information for a better experience.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowProfileModal(true)}
                        className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:shadow-lg"
                      >
                        Complete Profile
                      </button>
                      <button
                        onClick={() => setShowProfileBanner(false)}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
                      >
                        Remind me later
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileBanner(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

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
                className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 px-6 py-5 text-left ring-1 ring-orange-200 opacity-50 cursor-not-allowed"
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

      {/* Book Appointment Flow - Department Selection */}
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
                    <p className="text-sm text-slate-600">View available doctors</p>
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

      {/* Book Appointment Flow - Doctor Selection */}
      {activeMenu === "dashboard" && quickAction === "book" && selectedDepartment && !selectedDoctor && (
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedDepartment(null)}
              className="rounded-xl bg-white p-2 text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Select Doctor</p>
              <h4 className="text-2xl font-bold text-slate-900">{selectedDepartment}</h4>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {doctors
              .filter((doc) => doc.department === selectedDepartment)
              .map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className="group rounded-3xl bg-white p-6 text-left shadow-lg shadow-sky-100/50 ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-sky-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xl font-bold text-slate-900 mb-2">{doc.full_name}</h5>
                      <p className="text-sm text-slate-600">{doc.department}</p>
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

      {activeMenu === "dashboard" && quickAction === "book" && selectedDepartment && selectedDoctor && (
        <BookingCalendar
          selectedDepartment={selectedDepartment}
          selectedDoctor={selectedDoctor.full_name}
          selectedDoctorId={selectedDoctor.id}
          onBack={() => {
            setSelectedDepartment(null);
            setSelectedDoctor(null);
            setQuickAction(null);
          }}
          onSuccess={fetchAppointments}
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
          {loading ? (
            <div className="rounded-2xl bg-slate-50 px-6 py-8 text-center ring-1 ring-slate-100">
              <p className="text-sm font-medium text-slate-600">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
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
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment: any) => (
                <div
                  key={appointment.id}
                  className="rounded-2xl bg-gradient-to-r from-sky-50 to-sky-50/50 p-5 ring-1 ring-sky-100 hover:ring-sky-200 transition-all duration-150"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700">
                          #{appointment.id}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          appointment.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {appointment.status === 'active' ? 'Active' : 'Cancelled'}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-900">{appointment.doctor?.full_name || "Doctor"}</p>
                      <p className="text-sm text-slate-600 mt-1">{appointment.doctor?.department || "General Medicine"}</p>
                      <p className="text-sm font-medium text-slate-700 mt-2">
                        📅 {new Date(appointment.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-sm font-medium text-slate-700">
                        🕐 {new Date(appointment.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {appointment.appointment_type && (
                        <p className="text-xs text-slate-500 mt-2">Type: {appointment.appointment_type}</p>
                      )}
                      {appointment.notes && (
                        <p className="text-xs text-slate-500 mt-1">Notes: {appointment.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* Profile Completion Modal */}
      {showProfileModal && profileCompletion && (
        <ProfileCompletionModal
          missingFields={profileCompletion.missing_fields}
          userData={userData}
          onClose={() => setShowProfileModal(false)}
          onSuccess={handleProfileUpdate}
        />
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;
