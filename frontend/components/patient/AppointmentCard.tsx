"use client";

import React, { useState } from "react";
import StatusBadge from "../shared/StatusBadge";
import Tooltip from "../shared/Tooltip";
import Modal from "../shared/Modal";

type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export interface AppointmentItem {
  id: string;
  doctor: string;
  datetime: string;
  location?: string;
  status: AppointmentStatus;
  note?: string;
  specialty?: string;
}

const statusTone: Record<AppointmentStatus, Parameters<typeof StatusBadge>[0]["tone"]> = {
  upcoming: "emerald",
  completed: "slate",
  cancelled: "rose",
};

const statusLabel: Record<AppointmentStatus, string> = {
  upcoming: "Gelecek",
  completed: "Tamamlandı",
  cancelled: "İptal Edildi",
};

interface AppointmentCardProps {
  item: AppointmentItem;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tooltipContent = (
    <div className="space-y-1 text-left">
      <div className="font-semibold">{item.doctor}</div>
      {item.specialty && <div className="text-[10px] text-slate-300">{item.specialty}</div>}
      {item.location && <div className="text-[10px] text-slate-300">{item.location}</div>}
      <div className="pt-1 text-[10px]">
        <span>{item.datetime}</span>
      </div>
    </div>
  );

  return (
    <>
      <Tooltip content={tooltipContent} position="top">
        <div 
          onClick={() => setIsModalOpen(true)}
          className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-md shadow-sky-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-2 hover:ring-sky-200"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">{item.doctor}</p>
              {item.specialty && <p className="text-xs text-slate-600">{item.specialty}</p>}
              {item.location && <p className="text-xs text-slate-500">{item.location}</p>}
            </div>
            <StatusBadge label={statusLabel[item.status]} tone={statusTone[item.status]} size="md" />
          </div>
          <p className="text-sm text-slate-700">{item.datetime}</p>
          {item.note && <p className="text-xs text-slate-500">{item.note}</p>}
        </div>
      </Tooltip>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Randevu Detayları"
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-emerald-50 p-4 ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{item.doctor}</h4>
                {item.specialty && <p className="text-sm text-slate-600">{item.specialty}</p>}
                {item.location && <p className="text-xs text-slate-500">{item.location}</p>}
              </div>
              <StatusBadge 
                label={statusLabel[item.status]} 
                tone={statusTone[item.status]} 
                size="md" 
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <span className="text-sm font-medium text-slate-600">Tarih & Saat</span>
              <span className="font-semibold text-slate-900">{item.datetime}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <span className="text-sm font-medium text-slate-600">Durum</span>
              <span className="font-semibold text-slate-900">{statusLabel[item.status]}</span>
            </div>
          </div>

          {item.note && (
            <div className="rounded-xl bg-sky-50 p-3 ring-1 ring-sky-100">
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-sky-700">Not:</span> {item.note}
              </p>
            </div>
          )}

          {item.status === "upcoming" && (
            <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
              <p className="text-sm text-emerald-700">
                ✓ Randevunuz onaylandı. Lütfen 10 dakika önce gelin.
              </p>
            </div>
          )}

          {item.status === "completed" && (
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <p className="text-sm text-slate-700">
                Bu randevu tamamlandı. Ziyaretiniz için teşekkür ederiz.
              </p>
            </div>
          )}

          {item.status === "cancelled" && (
            <div className="rounded-xl bg-rose-50 p-3 ring-1 ring-rose-100">
              <p className="text-sm text-rose-700">
                Bu randevu iptal edildi.
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {item.status === "upcoming" && (
              <>
                <button className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                  Yeniden Planla
                </button>
                <button className="flex-1 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 font-semibold text-rose-700 transition-all hover:bg-rose-100">
                  İptal Et
                </button>
              </>
            )}
            {item.status === "completed" && (
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                Kapat
              </button>
            )}
            {item.status === "cancelled" && (
              <button className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                Yeniden Randevu Al
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AppointmentCard;
