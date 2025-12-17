import React from "react";
import CalendarGrid, { CalendarRow } from "./CalendarGrid";
import { CalendarSlotData } from "./CalendarSlot";
import StatusBadge from "../shared/StatusBadge";

interface DoctorCalendarProps {
  timeSlots: string[];
  rows: CalendarRow[];
}

const legend = [
  { label: "Available", tone: "emerald" as const },
  { label: "Booked", tone: "slate" as const },
  { label: "Waiting", tone: "amber" as const },
];

const DoctorCalendar: React.FC<DoctorCalendarProps> = ({ timeSlots, rows }) => {

  return (
    <div className="rounded-3xl bg-white p-5 shadow-xl shadow-sky-50 ring-1 ring-slate-100">
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Doctor / Room Calendar</p>
          <h3 className="text-xl font-bold text-slate-900">Today's coverage</h3>
          <p className="text-sm text-slate-600">Hover cells to inspect; UI only, no live data.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-100">
              <StatusBadge label={item.label} tone={item.tone} size="sm" />
              <span className="text-xs font-semibold text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <CalendarGrid rows={rows} timeSlots={timeSlots} />
    </div>
  );
};

export default DoctorCalendar;

// Example data helper (UI only)
export const buildDoctorCalendarData = () => {
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00"];

  const makeSlots = (defs: Array<Omit<CalendarSlotData, "time"> & { time: string }>): CalendarSlotData[] =>
    timeSlots.map((time) => defs.find((d) => d.time === time) ?? { 
      time, 
      label: "Open", 
      status: "available",
      capacity: 10,
      booked: 0,
      waitingList: 0,
    });

  const rows: CalendarRow[] = [
    {
      id: "room-a",
      title: "Room A · Dr. Chen",
      subtitle: "General Medicine",
      slots: makeSlots([
        { time: "09:00", label: "Follow-up", status: "booked", note: "Ms. Lin", capacity: 10, booked: 10, waitingList: 0 },
        { time: "10:00", label: "Consult", status: "available", note: "30m", capacity: 10, booked: 3, waitingList: 0 },
        { time: "11:00", label: "Walk-in", status: "waiting", note: "Queue #02", capacity: 10, booked: 10, waitingList: 2 },
        { time: "12:00", label: "Break", status: "booked", note: "Prep", capacity: 10, booked: 8, waitingList: 0 },
      ]),
    },
    {
      id: "room-b",
      title: "Room B · Dr. Patel",
      subtitle: "Cardiology",
      slots: makeSlots([
        { time: "09:00", label: "Echo review", status: "booked", note: "J. Ozturk", capacity: 8, booked: 8, waitingList: 0 },
        { time: "10:00", label: "New consult", status: "available", note: "40m", capacity: 8, booked: 2, waitingList: 0 },
        { time: "11:00", label: "Stress test", status: "booked", note: "Room prep", capacity: 8, booked: 7, waitingList: 0 },
        { time: "12:00", label: "Waiting", status: "waiting", note: "Queue #05", capacity: 8, booked: 8, waitingList: 5 },
      ]),
    },
    {
      id: "room-c",
      title: "Room C · Dr. Alvarez",
      subtitle: "Dermatology",
      slots: makeSlots([
        { time: "09:00", label: "Open", status: "available", capacity: 12, booked: 1, waitingList: 0 },
        { time: "10:00", label: "Procedures", status: "booked", note: "Blocked", capacity: 12, booked: 12, waitingList: 0 },
        { time: "11:00", label: "Follow-up", status: "available", capacity: 12, booked: 5, waitingList: 0 },
        { time: "12:00", label: "Waiting", status: "waiting", note: "Queue #08", capacity: 12, booked: 12, waitingList: 8 },
      ]),
    },
  ];

  return { timeSlots, rows };
};
