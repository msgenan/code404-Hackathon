import React from "react";

type BadgeTone = "sky" | "emerald" | "amber" | "slate" | "rose";

type BadgeSize = "sm" | "md";

interface StatusBadgeProps {
  label: string;
  tone?: BadgeTone;
  size?: BadgeSize;
}

const toneClasses: Record<BadgeTone, string> = {
  sky: "bg-gradient-to-r from-sky-500 to-emerald-500 text-white",
  emerald: "bg-gradient-to-r from-emerald-500 to-sky-500 text-white",
  amber: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  slate: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  rose: "bg-rose-50 text-rose-800 ring-1 ring-rose-200",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-[11px] px-2 py-1",
  md: "text-xs px-3 py-1.5",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ label, tone = "sky", size = "sm" }) => {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold tracking-wide shadow-sm transition ${toneClasses[tone]} ${sizeClasses[size]}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
