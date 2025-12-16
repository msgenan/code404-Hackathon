import React from "react";
import StatusBadge from "../shared/StatusBadge";

type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export interface AppointmentItem {
  id: string;
  doctor: string;
  datetime: string;
  location?: string;
  status: AppointmentStatus;
  note?: string;
}

const statusTone: Record<AppointmentStatus, Parameters<typeof StatusBadge>[0]["tone"]> = {
  upcoming: "emerald",
  completed: "slate",
  cancelled: "rose",
};

const statusLabel: Record<AppointmentStatus, string> = {
  upcoming: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
};

interface AppointmentCardProps {
  item: AppointmentItem;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ item }) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-md shadow-sky-50 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{item.doctor}</p>
          {item.location && <p className="text-xs text-slate-500">{item.location}</p>}
        </div>
        <StatusBadge label={statusLabel[item.status]} tone={statusTone[item.status]} size="md" />
      </div>
      <p className="text-sm text-slate-700">{item.datetime}</p>
      {item.note && <p className="text-xs text-slate-500">{item.note}</p>}
    </div>
  );
};

export default AppointmentCard;
