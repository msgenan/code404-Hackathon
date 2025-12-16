"use client";
import React from "react";
import { DashboardContentProps } from "./types";

const DashboardContent: React.FC<DashboardContentProps> = ({ title, description }) => {
  return (
    <div className="bg-white/90 rounded-2xl shadow-2xl shadow-sky-100 ring-1 ring-slate-100 backdrop-blur-sm p-6 sm:p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {description && <p className="text-sm text-slate-600">{description}</p>}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-slate-700 text-sm">No data yet. Connect backend to populate dashboard widgets.</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-slate-700 text-sm">Use the sidebar to switch between views.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
