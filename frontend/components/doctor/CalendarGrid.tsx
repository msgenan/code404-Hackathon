import React from "react";
import CalendarSlot, { CalendarSlotData } from "./CalendarSlot";

export interface CalendarRow {
  id: string;
  title: string;
  subtitle?: string;
  slots: CalendarSlotData[];
}

interface CalendarGridProps {
  rows: CalendarRow[];
  timeSlots: string[];
}

const columnClassMap: Record<number, string> = {
  3: "grid-cols-[180px_repeat(3,_1fr)]",
  4: "grid-cols-[180px_repeat(4,_1fr)]",
  5: "grid-cols-[180px_repeat(5,_1fr)]",
  6: "grid-cols-[180px_repeat(6,_1fr)]",
};

const CalendarGrid: React.FC<CalendarGridProps> = ({ rows, timeSlots }) => {
  const columnClass = columnClassMap[timeSlots.length] ?? "grid-cols-[180px_repeat(4,_1fr)]";

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[780px]">
        <div className={`grid ${columnClass} gap-3 text-sm font-semibold text-slate-600`}>
          <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">Rooms</div>
          {timeSlots.map((slot) => (
            <div key={slot} className="rounded-xl bg-slate-50 px-3 py-2 text-center ring-1 ring-slate-100">
              {slot}
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-3">
          {rows.map((row) => {
            const doctorName = row.title.split("·")[1]?.trim() || row.title;
            const roomName = row.title.split("·")[0]?.trim();

            return (
              <div key={row.id} className={`grid ${columnClass} gap-3 text-sm`}>
                <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 font-semibold text-slate-800 ring-1 ring-slate-100 shadow-sm">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 text-slate-800 ring-1 ring-slate-100">
                    {row.title[0]}
                  </span>
                  <div>
                    <p className="leading-tight">{row.title}</p>
                    {row.subtitle && <p className="text-xs text-slate-500">{row.subtitle}</p>}
                  </div>
                </div>

                {row.slots.map((slot, idx) => (
                  <CalendarSlot 
                    key={`${row.id}-${idx}`} 
                    slot={slot} 
                    doctorName={doctorName}
                    roomName={roomName}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
