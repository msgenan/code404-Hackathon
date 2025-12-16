// frontend/app/page.tsx

"use client";

import { useMemo, useState } from "react";

type ApiResponse = Record<string, unknown> | string;

type UserForm = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
};

const demoUser: UserForm = {
  id: "12345678901",
  name: "Jane",
  surname: "Tester",
  email: "jane.tester@example.com",
  phone: "5551234567",
};

const emptyUser: UserForm = {
  id: "",
  name: "",
  surname: "",
  email: "",
  phone: "",
};

const defaultBase = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

const formatError = (data: any) => {
  if (!data) return "Unknown error";
  if (typeof data === "string") return data;
  if (Array.isArray(data.detail)) {
    return data.detail.map((d) => d.msg || JSON.stringify(d)).join("; ");
  }
  if (data.detail) return data.detail;
  if (data.error) return data.error;
  return JSON.stringify(data);
};

export default function Tester() {
  const baseUrl = useMemo(() => defaultBase, []);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [rootResult, setRootResult] = useState<ApiResponse | null>(null);
  const [healthResult, setHealthResult] = useState<ApiResponse | null>(null);
  const [userResult, setUserResult] = useState<ApiResponse | null>(null);
  const [form, setForm] = useState<UserForm>(demoUser);

  const fullUrl = (path: string) => {
    if (baseUrl.startsWith("http")) {
      return `${baseUrl.replace(/\/$/, "")}${path}`;
    }
    // relative base (e.g. "/api")
    return `${baseUrl.replace(/\/$/, "")}${path}`;
  };

  const fetchJson = async (path: string, init?: RequestInit) => {
    const res = await fetch(fullUrl(path), init);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const errMsg = formatError(data);
      throw new Error(`${res.status} ${res.statusText}: ${errMsg}`);
    }
    return data;
  };

  const handlePing = async (path: string, setter: (d: ApiResponse) => void) => {
    setLoading(path);
    setError(null);
    try {
      const data = await fetchJson(path);
      setter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading("create");
    setError(null);
    try {
      const data = await fetchJson("/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setUserResult(data);
      setForm(emptyUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(null);
    }
  };

  const quickFill = () => setForm(demoUser);

  const renderResult = (title: string, result: ApiResponse | null) => (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-2 text-sm font-semibold text-zinc-900">{title}</div>
      <pre className="overflow-x-auto text-xs text-zinc-700">
        {result ? JSON.stringify(result, null, 2) : "No data yet"}
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Backend Tester</h1>
          <p className="text-sm text-zinc-600">
            Base URL: <code className="font-mono">{baseUrl}</code> (set
            NEXT_PUBLIC_API_BASE_URL to override)
          </p>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Quick checks</h2>
              <span className="text-xs text-zinc-500">GET</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePing("/", setRootResult)}
                disabled={loading !== null}
                className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {loading === "/" ? "Pinging..." : "Ping /"}
              </button>
              <button
                onClick={() => handlePing("/health", setHealthResult)}
                disabled={loading !== null}
                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {loading === "/health" ? "Checking..." : "Check /health"}
              </button>
            </div>
            <div className="grid gap-2">
              {renderResult("GET /", rootResult)}
              {renderResult("GET /health", healthResult)}
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create user</h2>
              <span className="text-xs text-zinc-500">POST /users/</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { name: "id", label: "ID (11 digits)", placeholder: "12345678901" },
                { name: "name", label: "Name", placeholder: "Jane" },
                { name: "surname", label: "Surname", placeholder: "Tester" },
                { name: "email", label: "Email", placeholder: "jane.tester@example.com" },
                { name: "phone", label: "Phone (10 digits)", placeholder: "5551234567" },
              ].map((field) => (
                <label key={field.name} className="block text-sm">
                  <span className="font-medium text-zinc-800">{field.label}</span>
                  <input
                    name={field.name}
                    value={(form as Record<string, string>)[field.name]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    placeholder={field.placeholder}
                    required
                    maxLength={field.name === "id" ? 11 : field.name === "phone" ? 10 : undefined}
                    className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
                  />
                </label>
              ))}
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading !== null}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
                >
                  {loading === "create" ? "Sending..." : "Send request"}
                </button>
                <button
                  type="button"
                  onClick={quickFill}
                  disabled={loading !== null}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Fill demo data
                </button>
                <button
                  type="button"
                  onClick={() => setForm(emptyUser)}
                  disabled={loading !== null}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Clear
                </button>
              </div>
            </form>
            {renderResult("POST /users/", userResult)}
          </div>
        </section>
      </div>
    </div>
  );
}