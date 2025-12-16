"use client";

import React from "react";

export interface Slot {
  time: string;
  label: string;
  state?: "available" | "busy" | "empty";
}

interface DoctorCalendarPlaceholderProps {
  rooms: string[];
  slots: Slot[];
}

const stateStyles: Record<NonNullable<Slot["state"]>, string> = {
  available: "bg-gradient-to-r from-emerald-50 to-sky-50 text-slate-800 ring-1 ring-emerald-100",
  busy: "bg-white text-slate-500 ring-1 ring-slate-100",
  empty: "bg-slate-50 text-slate-400 ring-1 ring-slate-100",
};

const DoctorCalendarPlaceholder: React.FC<DoctorCalendarPlaceholderProps> = ({ rooms, slots }) => {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-xl shadow-sky-50 ring-1 ring-slate-100">
      <div className="flex items-center justify-between pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Schedule</p>
          <h3 className="text-xl font-bold text-slate-900">Upcoming Slots</h3>
        </div>
        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-100">
          Mock grid / UI only
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[140px_repeat(4,_1fr)] gap-2 text-sm font-semibold text-slate-600">
            <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">Rooms</div>
            {slots.map((slot) => (
              <div key={slot.time} className="rounded-xl bg-slate-50 px-3 py-2 text-center ring-1 ring-slate-100">
                {slot.time}
              </div>
            ))}
          </div>

          <div className="mt-2 space-y-2">
            {rooms.map((room, rowIndex) => (
              <div key={room} className="grid grid-cols-[140px_repeat(4,_1fr)] gap-2 text-sm">
                <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 font-semibold text-slate-700 ring-1 ring-slate-100">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 text-slate-700 ring-1 ring-slate-100">
                    {String.fromCharCode(65 + rowIndex)}
                  </span>
                  <div>
                    <p className="leading-tight">{room}</p>
                    <p className="text-xs text-slate-500">Capacity 6 · Prep</p>
                  </div>
                </div>

                {slots.map((slot) => {
                  const state = slot.state ?? "available";
                  return (
                    <div
                      key={`${room}-${slot.time}`}
                      className={`group relative flex h-16 items-center justify-center rounded-xl p-2 text-sm transition hover:-translate-y-0.5 hover:shadow-md ${stateStyles[state]}`}
                    >
                      <span className="text-center leading-tight">
                        {state === "busy" ? "Booked" : state === "empty" ? "-" : slot.label}
                      </span>
                      <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 ring-2 ring-sky-200 transition group-hover:opacity-60" />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCalendarPlaceholder;
