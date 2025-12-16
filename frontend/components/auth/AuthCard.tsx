"use client";
import React, { useMemo } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import PrimaryButton from "../PrimaryButton";

type Mode = "initial" | "login" | "register";

interface AuthCardProps {
  mode?: Mode;
  isExpanded?: boolean;
  onLogin?: () => void;
  onRegister?: () => void;
  onBack?: () => void;
}

const AuthCard: React.FC<AuthCardProps> = ({
  mode = "initial",
  isExpanded = false,
  onLogin = () => {},
  onRegister = () => {},
  onBack = () => {},
}) => {
  const showLogin = mode === "login";
  const showRegister = mode === "register";
  const title = useMemo(() => {
    if (showLogin) return "Login";
    if (showRegister) return "Register";
    return "Welcome";
  }, [showLogin, showRegister]);

  return (
    <div
      className={`w-full max-w-xl rounded-3xl bg-white/90 p-6 sm:p-8 shadow-2xl shadow-sky-100 ring-1 ring-slate-100 backdrop-blur-sm transition-all duration-300 ease-in-out ${
        isExpanded ? "scale-[1.02]" : "scale-100"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Code404 Health</p>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-sky-600">For doctors and patients</p>
        </div>

        {isExpanded && (
          <button
            type="button"
            onClick={onBack}
            className="h-9 px-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          >
            Back
          </button>
        )}
      </div>

      {mode === "initial" && (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
          <p className="text-sm text-slate-600 text-center">
            Create appointments, track your spot live, and chat with the clinic team in one modern workflow.
          </p>
          <div className="space-y-4">
            <PrimaryButton label="Login" onClick={onLogin} fullWidth />
            <PrimaryButton label="Register" onClick={onRegister} variant="secondary" fullWidth />
          </div>
          <div className="space-y-1 text-center text-sm text-slate-500">
            <p>New here? Register and get started in minutes.</p>
            <p>Support is available around the clock.</p>
          </div>
        </div>
      )}

      <div className="relative min-h-[140px] mt-4">
        <div
          className={`transition-all duration-300 ease-in-out transform ${
            showLogin ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none absolute inset-0"
          }`}
        >
          {showLogin && <LoginForm onSwitchToRegister={onRegister} />}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out transform ${
            showRegister ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none absolute inset-0"
          }`}
        >
          {showRegister && <RegisterForm onSwitchToLogin={onLogin} />}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;

