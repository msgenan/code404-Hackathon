"use client";
import React from "react";
import { TopbarProps } from "./types";

const Topbar: React.FC<TopbarProps> = ({ clinicName, role, onToggleSidebar, isMobile }) => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <header className="h-16 bg-white rounded-xl shadow-md shadow-sky-100 ring-1 ring-slate-100 flex items-center px-4 sm:px-6 justify-between">
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          >
            <span className="sr-only">Menu</span>
            {/* Hamburger */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-100">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M12 3v18" />
              <path d="M5 10h14" />
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-900">{clinicName}</span>
        </div>
      </div>

      <div className="hidden sm:block">
        <p className="text-sm text-slate-600">{today}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">
          <span className="h-6 w-6 rounded-full bg-slate-300" />
          {role}
        </span>
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-medium shadow-md shadow-sky-100 hover:from-sky-600 hover:to-emerald-600 active:scale-95 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
