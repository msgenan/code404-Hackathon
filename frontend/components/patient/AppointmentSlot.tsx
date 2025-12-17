"use client";

import React, { useState } from "react";
import Tooltip from "../shared/Tooltip";
import ProgressBar from "../shared/ProgressBar";
import SlotBadge from "../shared/SlotBadge";
import Modal from "../shared/Modal";

export interface AppointmentSlotData {
  id: string;
  doctor: string;
  time: string;
  date: string;
  room?: string;
  status: "available" | "booked" | "waiting";
  capacity?: number;
  booked?: number;
  specialty?: string;
}

interface AppointmentSlotProps {
  slot: AppointmentSlotData;
}

const statusClasses = {
  available: "bg-white text-slate-800 ring-1 ring-emerald-100 hover:ring-emerald-300",
  booked: "bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300",
  waiting: "bg-gradient-to-r from-amber-50 to-sky-50 text-amber-900 ring-1 ring-amber-200 hover:ring-amber-300",
};

const statusBadgeColor = {
  available: "emerald" as const,
  booked: "slate" as const,
  waiting: "amber" as const,
};

const statusLabel = {
  available: "Available",
  booked: "Booked",
  waiting: "Waiting List",
};

const AppointmentSlot: React.FC<AppointmentSlotProps> = ({ slot }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { doctor, time, date, room, status, capacity = 10, booked = 0, specialty } = slot;

  const bookedPercentage = Math.round((booked / capacity) * 100);

  const tooltipContent = (
    <div className="space-y-1 text-left">
      <div className="font-semibold">{doctor}</div>
      {specialty && <div className="text-[10px] text-slate-300">{specialty}</div>}
      {room && <div className="text-[10px] text-slate-300">{room}</div>}
      <div className="flex items-center gap-2 pt-1 text-[10px]">
        <span>Capacity: {booked}/{capacity}</span>
        <span>• {bookedPercentage}% full</span>
      </div>
    </div>
  );

  return (
    <>
      <Tooltip content={tooltipContent} position="top">
        <div
          onClick={() => setIsModalOpen(true)}
          className={`group relative flex cursor-pointer flex-col gap-3 rounded-2xl p-4 shadow-md shadow-sky-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${statusClasses[status]}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">{doctor}</p>
              {specialty && <p className="text-xs text-slate-600">{specialty}</p>}
              {room && <p className="text-xs text-slate-500">{room}</p>}
            </div>
            <SlotBadge 
              label={statusLabel[status]} 
              tone={statusBadgeColor[status]} 
              size="md" 
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-slate-700">{time}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{date}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600">
              <span>Availability</span>
              <span className="tabular-nums">{capacity - booked} / {capacity}</span>
            </div>
            <ProgressBar 
              percentage={bookedPercentage} 
              size="sm" 
              color={status === "available" ? "emerald" : status === "waiting" ? "amber" : "slate"}
            />
          </div>

          <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-2 ring-sky-400 transition-opacity duration-300 group-hover:opacity-60" />
        </div>
      </Tooltip>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book Appointment"
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-emerald-50 p-4 ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{doctor}</h4>
                {specialty && <p className="text-sm text-slate-600">{specialty}</p>}
                {room && <p className="text-xs text-slate-500">{room}</p>}
              </div>
              <SlotBadge 
                label={statusLabel[status]} 
                tone={statusBadgeColor[status]} 
                size="md" 
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <span className="text-sm font-medium text-slate-600">Date</span>
              <span className="font-semibold text-slate-900">{date}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <span className="text-sm font-medium text-slate-600">Time</span>
              <span className="font-semibold text-slate-900">{time}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <span className="text-sm font-medium text-slate-600">Available Slots</span>
              <span className="font-semibold text-slate-900">{capacity - booked} / {capacity}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Booking Progress</label>
            <ProgressBar 
              percentage={bookedPercentage} 
              size="lg" 
              color={status === "available" ? "emerald" : status === "waiting" ? "amber" : "slate"}
              showLabel
            />
          </div>

          {status === "available" && (
            <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
              <p className="text-sm text-emerald-700">
                ✓ This appointment slot is available. Click below to book.
              </p>
            </div>
          )}

          {status === "booked" && (
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <p className="text-sm text-slate-700">
                This slot is fully booked. You can join the waiting list.
              </p>
            </div>
          )}

          {status === "waiting" && (
            <div className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-100">
              <p className="text-sm text-amber-700">
                This slot has a waiting list. You will be notified if a spot opens.
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {status === "available" && (
              <>
                <button className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                  Book Appointment
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Cancel
                </button>
              </>
            )}
            {status === "booked" && (
              <>
                <button className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                  Join Waiting List
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Cancel
                </button>
              </>
            )}
            {status === "waiting" && (
              <>
                <button className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                  Join Waiting List
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AppointmentSlot;
