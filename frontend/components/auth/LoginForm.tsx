"use client";
import React, { useState } from "react";
import { api, saveToken, saveUserData } from "@/lib/api";

export interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const disabled = !email || !password || loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log("Attempting login with:", email);
      const res = await api.login({ email, password });
      console.log("Login response:", res);
      
      const token = (res as { access_token?: string; token?: string })?.access_token || (res as { access_token?: string; token?: string })?.token;
      if (token) {
        saveToken(token);
        console.log("Token saved, fetching user data...");
        
        // Fetch user data
        const userData = await api.getCurrentUser();
        console.log("User data:", userData);
        saveUserData(userData);
        
        // Redirect based on role
        if ((userData as { role: string }).role === "doctor") {
          window.location.href = "/doctor/dashboard";
        } else {
          window.location.href = "/user/dashboard";
        }
      } else {
        throw new Error("No token received from server");
      }
    } catch (err) {
      console.error("Login failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
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
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition text-slate-900 font-medium"
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
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition pr-10 text-slate-900 font-medium"
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

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={disabled}
          className="w-full py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-60 transition"
        >
          {loading ? "Logging in..." : "Login"}
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

