import React from "react";

export interface SlotBadgeProps {
  label: string;
  count?: number;
  tone?: "emerald" | "sky" | "amber" | "rose" | "slate";
  size?: "sm" | "md";
}

const toneClasses = {
  emerald: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  sky: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
  amber: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  rose: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
  slate: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

const SlotBadge: React.FC<SlotBadgeProps> = ({ label, count, tone = "slate", size = "sm" }) => {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${toneClasses[tone]} ${sizeClasses[size]}`}>
      {label}
      {count !== undefined && (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold tabular-nums">
          {count}
        </span>
      )}
    </span>
  );
};

export default SlotBadge;
