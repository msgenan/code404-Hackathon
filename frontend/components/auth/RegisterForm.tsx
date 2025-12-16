"use client";
import React, { useMemo, useState } from "react";
import RoleSelector, { Role } from "./RoleSelector";

export interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<Role>("patient");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const passwordsMatch = useMemo(
    () => password.length > 0 && password === confirmPassword,
    [password, confirmPassword]
  );
  const disabled = !fullName || !email || !password || !confirmPassword || !passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reg-name" className="block text-sm font-medium text-slate-700 mb-1">
          Full name
        </label>
        <input
          id="reg-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition"
          placeholder="Jane Doe"
          required
        />
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition"
          placeholder="you@clinic.com"
          required
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition pr-10"
            placeholder="••••••••"
            required
            minLength={6}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="reg-confirm" className="block text-sm font-medium text-slate-700 mb-1">
          Confirm password
        </label>
        <input
          id="reg-confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border ${
            confirmPassword.length === 0
              ? "border-slate-200"
              : passwordsMatch
              ? "border-emerald-300"
              : "border-rose-300"
          } focus:outline-none focus:ring-2 focus:ring-emerald-200 transition`}
          placeholder="••••••••"
          required
        />
        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="text-rose-600 text-sm mt-1">Passwords do not match</p>
        )}
      </div>

      <div>
        <span className="block text-sm font-medium text-slate-700 mb-2">Role</span>
        <RoleSelector value={role} onChange={setRole} />
      </div>

      <div>
        <button
          type="submit"
          disabled={disabled}
          className="w-full py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-60 transition"
        >
          Create account
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <button
          type="button"
          onClick={() => {
            if (onSwitchToLogin) onSwitchToLogin();
          }}
          className="text-sky-600 hover:underline"
        >
          Have an account? Login
        </button>
        <div />
      </div>
    </form>
  );
};

export default RegisterForm;
