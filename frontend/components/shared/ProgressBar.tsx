import React from "react";

export interface ProgressBarProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  color?: "emerald" | "sky" | "amber" | "rose" | "slate";
  showLabel?: boolean;
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

const colorClasses = {
  emerald: "bg-gradient-to-r from-emerald-400 to-emerald-500",
  sky: "bg-gradient-to-r from-sky-400 to-sky-500",
  amber: "bg-gradient-to-r from-amber-400 to-amber-500",
  rose: "bg-gradient-to-r from-rose-400 to-rose-500",
  slate: "bg-gradient-to-r from-slate-400 to-slate-500",
};

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  percentage, 
  size = "md", 
  color = "sky",
  showLabel = false 
}) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="flex w-full items-center gap-2">
      <div className={`w-full overflow-hidden rounded-full bg-slate-100 ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-600 tabular-nums">
          {clampedPercentage}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
