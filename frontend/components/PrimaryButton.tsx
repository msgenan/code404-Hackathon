import { MouseEventHandler } from "react";

type Variant = "primary" | "secondary";

interface PrimaryButtonProps {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  variant?: Variant;
  fullWidth?: boolean;
}

const baseClasses =
  "rounded-full px-6 py-3 text-base font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 shadow-sm active:scale-95 active:shadow-inner";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:from-sky-600 hover:to-emerald-600 hover:shadow-md active:from-sky-700 active:to-emerald-700 focus-visible:outline-sky-500",
  secondary:
    "bg-white text-slate-900 ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-slate-50 hover:shadow active:bg-slate-100 focus-visible:outline-sky-500",
};

export function PrimaryButton({
  label,
  onClick,
  variant = "primary",
  fullWidth = false,
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
    >
      {label}
    </button>
  );
}

export default PrimaryButton;