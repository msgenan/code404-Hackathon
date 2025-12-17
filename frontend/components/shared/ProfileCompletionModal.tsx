"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";

interface ProfileCompletionModalProps {
  missingFields: string[];
  userData: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  missingFields,
  userData,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    full_name: userData?.full_name || "",
    phone: userData?.phone || "",
    age: userData?.age || "",
    gender: userData?.gender || "",
    medical_history: userData?.medical_history || "",
    allergies: userData?.allergies || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.updateProfile({
        full_name: formData.full_name || undefined,
        phone: formData.phone || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        medical_history: formData.medical_history || undefined,
        allergies: formData.allergies || undefined,
      });

      alert("Profile updated successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const isPatient = userData?.role === "patient";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-200 mx-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Complete Your Profile</h2>
          <p className="mt-2 text-sm text-slate-600">
            Please fill in the missing information to get the best experience
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {missingFields.includes("full_name") && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="John Doe"
                required
              />
            </div>
          )}

          {missingFields.includes("phone") && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="(555) 123-4567"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {missingFields.includes("age") && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="25"
                  min="1"
                  max="150"
                  required
                />
              </div>
            )}

            {missingFields.includes("gender") && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            )}
          </div>

          {isPatient && missingFields.includes("medical_history") && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Medical History *
              </label>
              <textarea
                value={formData.medical_history}
                onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="Any chronic conditions, past surgeries, etc. (or write 'None')"
                rows={3}
                required
              />
            </div>
          )}

          {isPatient && missingFields.includes("allergies") && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Allergies *
              </label>
              <textarea
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="List any allergies (or write 'None')"
                rows={2}
                required
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-50"
              disabled={loading}
            >
              Skip for now
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 font-medium text-white shadow-lg transition hover:shadow-xl disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
