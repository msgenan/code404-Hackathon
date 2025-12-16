"use client";

import { useCallback, useMemo, useState } from "react";
import FeatureItem from "@/components/FeatureItem";
import PrimaryButton from "@/components/PrimaryButton";
import AuthCard from "@/components/auth/AuthCard";

const features = [
  {
    title: "Fast Appointments",
    description: "Pick your doctor, grab an available slot, confirm in seconds.",
    icon: (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M3 11h18" />
        <path d="M12 16h5" />
      </svg>
    ),
  },
  {
    title: "Smart Queue",
    description: "Track your wait time live and stay notified with instant updates.",
    icon: (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 20h16" />
        <path d="M6 16v-5a6 6 0 1 1 12 0v5" />
        <path d="M8 20v-2a4 4 0 0 1 8 0v2" />
      </svg>
    ),
  },
  {
    title: "Live Support",
    description: "Chat with the clinic team in real time and resolve questions fast.",
    icon: (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M21 11.5a8.5 8.5 0 1 0-4.675 7.6L21 21z" />
        <path d="M8 12h5" />
        <path d="M8 9h8" />
      </svg>
    ),
  },
];

type Mode = "initial" | "login" | "register";

export default function WelcomePage() {
  const [mode, setMode] = useState<Mode>("initial");

  const handleLogin = useCallback(() => setMode("login"), []);
  const handleRegister = useCallback(() => setMode("register"), []);
  const handleBack = useCallback(() => setMode("initial"), []);
  const isExpanded = useMemo(() => mode !== "initial", [mode]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-slate-50 to-emerald-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-sky-200 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-200 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12 lg:px-12">
        <div className="mb-10 flex items-center gap-3">
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
              <path d="M5 10h14" />
              <path d="M5 14h14" />
              <path d="M8 21h8" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Smart Clinic Platform</p>
            <p className="text-lg font-semibold text-slate-900">Code404 Health</p>
          </div>
        </div>

        <div className="grid flex-1 gap-12 lg:grid-cols-2 lg:items-start">
          <div className="space-y-8 pt-1">
            <div className="space-y-4">
              <p className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700 ring-1 ring-sky-100 shadow-sm">
                Next-Gen Clinic Experience
              </p>
              <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Smart Appointment & Queue Management
              </h1>
              <p className="max-w-2xl text-lg text-slate-600">
                Create appointments, track your spot live, and chat with the clinic team in one modern workflow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <FeatureItem
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <AuthCard
              mode={mode}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onBack={handleBack}
              isExpanded={isExpanded}
            />
          </div>
        </div>
      </div>
    </div>
  );
}