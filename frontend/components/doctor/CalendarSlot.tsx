"use client";

import React, { useState } from "react";
import StatusBadge from "../shared/StatusBadge";
import Tooltip from "../shared/Tooltip";
import ProgressBar from "../shared/ProgressBar";
import SlotBadge from "../shared/SlotBadge";
import Modal from "../shared/Modal";

export type SlotStatus = "available" | "booked" | "waiting";

export interface CalendarSlotData {
  time: string;
  label: string;
  status: SlotStatus;
  note?: string;
  doctor?: string;
  room?: string;
  capacity?: number;
  booked?: number;
  waitingList?: number;
}

interface CalendarSlotProps {
  slot: CalendarSlotData;
  doctorName?: string;
  roomName?: string;
}

const statusClasses: Record<SlotStatus, string> = {
  available: "bg-white text-slate-800 ring-1 ring-emerald-100 hover:ring-emerald-300",
  booked: "bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300",
  waiting: "bg-gradient-to-r from-amber-50 to-sky-50 text-amber-900 ring-1 ring-amber-200 hover:ring-amber-300",
};

const badgeTone: Record<SlotStatus, Parameters<typeof StatusBadge>[0]["tone"]> = {
  available: "emerald",
  booked: "slate",
  waiting: "amber",
};

const CalendarSlot: React.FC<CalendarSlotProps> = ({ slot, doctorName, roomName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { label, note, status, doctor, room, capacity = 10, booked = 0, waitingList = 0 } = slot;

  const finalDoctor = doctor || doctorName || "Dr. Unknown";
  const finalRoom = room || roomName || "Room Unknown";
  const bookedPercentage = Math.round((booked / capacity) * 100);

  const tooltipContent = (
    <div className="space-y-1 text-left">
      <div className="font-semibold">{finalDoctor}</div>
      <div className="text-[10px] text-slate-300">{finalRoom}</div>
      <div className="flex items-center gap-2 pt-1 text-[10px]">
        <span>Capacity: {booked}/{capacity}</span>
        {waitingList > 0 && <span className="text-amber-300">• Wait: {waitingList}</span>}
      </div>
    </div>
  );

  return (
    <>
      <Tooltip content={tooltipContent} position="top">
        <div
          onClick={() => setIsModalOpen(true)}
          className={`group relative flex h-24 cursor-pointer flex-col justify-between gap-1 rounded-xl p-3 text-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${statusClasses[status]}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="font-semibold leading-tight text-slate-800">{label}</p>
              {note && <p className="text-xs text-slate-500">{note}</p>}
            </div>
            <StatusBadge 
              label={status === "waiting" ? "Beklemede" : status === "booked" ? "Dolu" : "Müsait"} 
              tone={badgeTone[status]} 
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <ProgressBar 
                percentage={bookedPercentage} 
                size="sm" 
                color={status === "available" ? "emerald" : status === "waiting" ? "amber" : "slate"}
              />
              <span className="text-[10px] font-bold text-slate-600 tabular-nums">{bookedPercentage}%</span>
            </div>
            {waitingList > 0 && (
              <div className="flex items-center gap-1">
                <SlotBadge label="Waiting" count={waitingList} tone="amber" size="sm" />
              </div>
            )}
          </div>

          <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 ring-2 ring-sky-400 transition-opacity duration-300 group-hover:opacity-60" />
        </div>
      </Tooltip>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Slot Detayları"
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-emerald-50 p-4 ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{label}</h4>
                <p className="text-sm text-slate-600">{finalDoctor} · {finalRoom}</p>
              </div>
              <StatusBadge 
                label={status === "waiting" ? "Beklemede" : status === "booked" ? "Dolu" : "Müsait"} 
                tone={badgeTone[status]}
                size="md"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <span className="text-sm font-medium text-slate-600">Saat</span>
              <span className="font-semibold text-slate-900">{slot.time}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <span className="text-sm font-medium text-slate-600">Kapasite</span>
              <span className="font-semibold text-slate-900">{booked} / {capacity}</span>
            </div>
            {waitingList > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-amber-50 p-3 ring-1 ring-amber-100">
                <span className="text-sm font-medium text-amber-700">Bekleme Listesi</span>
                <span className="font-semibold text-amber-900">{waitingList} hasta</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Doluluk Oranı</label>
            <ProgressBar 
              percentage={bookedPercentage} 
              size="lg" 
              color={status === "available" ? "emerald" : status === "waiting" ? "amber" : "slate"}
              showLabel
            />
          </div>

          {note && (
            <div className="rounded-xl bg-sky-50 p-3 ring-1 ring-sky-100">
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-sky-700">Not:</span> {note}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              Detayları Gör
            </button>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50"
            >
              Kapat
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CalendarSlot;
