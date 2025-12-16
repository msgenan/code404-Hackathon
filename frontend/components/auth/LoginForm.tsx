"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RoleSelector, { Role } from "./RoleSelector";
import { api, saveToken } from "@/lib/api";

export interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<Role>("patient");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const disabled = !email || !password || loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.login({ email, password });
      saveToken(response.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition"
          placeholder="you@clinic.com"
          required
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition pr-10"
            placeholder="••••••••"
            required
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
        <span className="block text-sm font-medium text-slate-700 mb-2">Role</span>
        <RoleSelector value={role} onChange={setRole} />
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={disabled}
          className="w-full py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-60 transition"
        >
          {loading ? "Giriş yapılıyor..." : "Login"}
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <button
          type="button"
          onClick={() => {
            if (onSwitchToRegister) onSwitchToRegister();
          }}
          className="text-sky-600 hover:underline"
        >
          Create account
        </button>

        <button type="button" className="hover:underline">
          Forgot password?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
