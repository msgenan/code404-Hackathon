"use client";

import { useEffect, useMemo } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export type AuthMode = "login" | "register";

interface AuthPanelProps {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
}

export default function AuthPanel({ open, mode, onClose, onSwitchMode }: AuthPanelProps) {
  const title = useMemo(
    () => (mode === "login" ? "Login to your account" : "Create an account"),
    [mode]
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-lg
      transform bg-white shadow-2xl ring-1 ring-slate-100 transition-transform duration-300 ease-in-out
      ${open ? "translate-x-0" : "translate-x-full"}`}
      aria-modal="true"
      role="dialog"
    >
      <div className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Code404 Health</p>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition"
            aria-label="Close panel"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {mode === "login" ? (
            <LoginForm onSwitchToRegister={() => onSwitchMode("register")} />
          ) : (
            <RegisterForm onSwitchToLogin={() => onSwitchMode("login")} />
          )}
        </div>
      </div>
    </aside>
  );
}
