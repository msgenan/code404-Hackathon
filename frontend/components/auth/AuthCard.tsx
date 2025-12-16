"use client";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export type Tab = "login" | "register";

const AuthCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("login");

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">ClinicFlow</h1>
        <p className="text-sm text-slate-500 mt-1">Smart Appointment & Queue System</p>
      </header>

      <div className="mb-6 bg-slate-50 p-1 rounded-lg flex items-center">
        <button
          type="button"
          onClick={() => setActiveTab("login")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-200
            ${activeTab === "login" ? "bg-white text-sky-600 shadow" : "text-slate-500 hover:bg-slate-100"}`}
          aria-pressed={activeTab === "login"}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("register")}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-200
            ${activeTab === "register" ? "bg-white text-sky-600 shadow" : "text-slate-500 hover:bg-slate-100"}`}
          aria-pressed={activeTab === "register"}
        >
          Register
        </button>
      </div>

      <div className="relative min-h-[320px]">
        <div
          className={`transition-all duration-300 ease-in-out transform ${
            activeTab === "login"
              ? "opacity-100 translate-y-0 relative"
              : "opacity-0 -translate-y-2 absolute inset-0 pointer-events-none"
          }`}
        >
          <LoginForm onSwitchToRegister={() => setActiveTab("register")} />
        </div>

        <div
          className={`transition-all duration-300 ease-in-out transform ${
            activeTab === "register"
              ? "opacity-100 translate-y-0 relative"
              : "opacity-0 translate-y-2 absolute inset-0 pointer-events-none"
          }`}
        >
          <RegisterForm onSwitchToLogin={() => setActiveTab("login")} />
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
