"use client";

import React from "react";

type Role = "Doktor" | "Hasta";

interface TopbarProps {
  appName: string;
  userName: string;
  role: Role;
  subtitle?: string;
  onLogout?: () => void;
}

const roleBadgeStyles: Record<Role, string> = {
  Doktor: "bg-sky-50 text-sky-700 ring-sky-200",
  Hasta: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const Topbar: React.FC<TopbarProps> = ({
  appName,
  userName,
  role,
  subtitle = "Smart Clinic Platform",
  onLogout,
}) => {
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/80 px-6 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-100">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M12 3v18" />
            <path d="M6 9h12" />
            <path d="M6 15h12" />
            <path d="M9 21h6" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">{appName}</p>
          <p className="text-sm text-slate-500">Akıllı Klinik Platformu</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${roleBadgeStyles[role]}`}
        >
          {role}
        </span>
        <div className="flex items-center gap-3 rounded-full bg-slate-50 px-3 py-1.5 ring-1 ring-slate-100 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 text-sm font-semibold text-white shadow-inner">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-slate-900">{userName}</p>
            <p className="text-xs leading-tight text-slate-500">{role}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            Çıkış
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
