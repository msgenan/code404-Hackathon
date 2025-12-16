import React from "react";
import AppointmentCard, { AppointmentItem } from "./AppointmentCard";
import StatusBadge from "../shared/StatusBadge";

interface AppointmentsListProps {
  title?: string;
  appointments: AppointmentItem[];
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ title = "My Appointments", appointments }) => {
  const isEmpty = appointments.length === 0;

  return (
    <div className="rounded-3xl bg-white p-5 shadow-xl shadow-sky-50 ring-1 ring-slate-100">
      <div className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Patient · Schedule</p>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">Static UI only. Connect API to sync live data.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="Upcoming" tone="emerald" />
          <StatusBadge label="Completed" tone="slate" />
          <StatusBadge label="Cancelled" tone="rose" />
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-inner ring-1 ring-slate-100">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M8 7h8" />
              <path d="M8 12h6" />
              <path d="M8 17h4" />
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
          </div>
          <p>No appointments yet.</p>
          <p className="text-xs text-slate-500">You will see your booked visits here once connected.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {appointments.map((item) => (
            <AppointmentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
