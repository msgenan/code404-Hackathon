import React from "react";
import StatusBadge from "../shared/StatusBadge";

export type SlotStatus = "available" | "booked" | "waiting";

export interface CalendarSlotData {
  time: string;
  label: string;
  status: SlotStatus;
  note?: string;
}

interface CalendarSlotProps {
  slot: CalendarSlotData;
}

const statusClasses: Record<SlotStatus, string> = {
  available: "bg-white text-slate-800 ring-1 ring-emerald-100",
  booked: "bg-slate-50 text-slate-700 ring-1 ring-slate-200",
  waiting: "bg-gradient-to-r from-amber-50 to-sky-50 text-amber-900 ring-1 ring-amber-200",
};

const badgeTone: Record<SlotStatus, Parameters<typeof StatusBadge>[0]["tone"]> = {
  available: "emerald",
  booked: "slate",
  waiting: "amber",
};

const CalendarSlot: React.FC<CalendarSlotProps> = ({ slot }) => {
  const { label, note, status } = slot;

  return (
    <div
      className={`group relative flex h-20 flex-col justify-center gap-1 rounded-xl p-3 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${statusClasses[status]}`}
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-800">{label}</p>
        <StatusBadge label={status === "waiting" ? "Waiting" : status === "booked" ? "Booked" : "Available"} tone={badgeTone[status]} />
      </div>
      {note && <p className="text-xs text-slate-500">{note}</p>}
      <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 ring-2 ring-sky-200 transition group-hover:opacity-60" />
    </div>
  );
};

export default CalendarSlot;
