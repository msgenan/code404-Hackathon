import { ReactNode } from "react";

interface FeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-100 bg-white/60 p-4 shadow-sm ring-1 ring-slate-100/60">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 text-sky-700">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default FeatureItem;