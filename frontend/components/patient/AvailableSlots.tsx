import React from "react";
import AppointmentSlot, { AppointmentSlotData } from "./AppointmentSlot";
import StatusBadge from "../shared/StatusBadge";

interface AvailableSlotsProps {
  title?: string;
  slots: AppointmentSlotData[];
}

const AvailableSlots: React.FC<AvailableSlotsProps> = ({ title = "Müsait Randevular", slots }) => {
  const isEmpty = slots.length === 0;

  return (
    <div className="rounded-3xl bg-white p-5 shadow-xl shadow-sky-50 ring-1 ring-slate-100">
      <div className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Hasta · Randevu Al</p>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">Randevu almak için bir slota tıklayın</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="Müsait" tone="emerald" />
          <StatusBadge label="Dolu" tone="slate" />
          <StatusBadge label="Bekleme" tone="amber" />
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-inner ring-1 ring-slate-100">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p>Müsait randevu yok.</p>
          <p className="text-xs text-slate-500">Yeni slotlar için daha sonra tekrar kontrol edin.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <AppointmentSlot key={slot.id} slot={slot} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableSlots;

// Example data helper (UI only)
export const buildAvailableSlotsData = (): AppointmentSlotData[] => {
  return [
    {
      id: "slot-1",
      doctor: "Dr. Chen",
      time: "09:00 AM",
      date: "Dec 18, 2025",
      room: "Room A",
      status: "available",
      capacity: 10,
      booked: 3,
      specialty: "General Medicine",
    },
    {
      id: "slot-2",
      doctor: "Dr. Patel",
      time: "10:00 AM",
      date: "Dec 18, 2025",
      room: "Room B",
      status: "available",
      capacity: 8,
      booked: 2,
      specialty: "Cardiology",
    },
    {
      id: "slot-3",
      doctor: "Dr. Alvarez",
      time: "11:00 AM",
      date: "Dec 18, 2025",
      room: "Room C",
      status: "booked",
      capacity: 12,
      booked: 12,
      specialty: "Dermatology",
    },
    {
      id: "slot-4",
      doctor: "Dr. Kim",
      time: "02:00 PM",
      date: "Dec 18, 2025",
      room: "Room D",
      status: "waiting",
      capacity: 10,
      booked: 10,
      specialty: "Orthopedics",
    },
    {
      id: "slot-5",
      doctor: "Dr. Johnson",
      time: "03:00 PM",
      date: "Dec 18, 2025",
      room: "Room E",
      status: "available",
      capacity: 15,
      booked: 5,
      specialty: "Pediatrics",
    },
    {
      id: "slot-6",
      doctor: "Dr. Martinez",
      time: "04:00 PM",
      date: "Dec 18, 2025",
      room: "Room F",
      status: "available",
      capacity: 8,
      booked: 1,
      specialty: "Neurology",
    },
  ];
};
