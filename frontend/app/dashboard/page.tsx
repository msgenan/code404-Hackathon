"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, removeToken, User, Appointment } from "@/lib/api";

export default function DashboardPage() {
  const [doctors, setDoctors] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/auth");
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [doctorsData, appointmentsData] = await Promise.all([
        api.getDoctors(),
        api.getMyAppointments(),
      ]);
      setDoctors(doctorsData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError("Veriler yüklenirken hata oluştu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !appointmentDate || !appointmentTime) {
      setError("Lütfen tüm alanları doldurun");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const startTime = `${appointmentDate}T${appointmentTime}:00`;
      await api.createAppointment({
        doctor_id: selectedDoctorId,
        start_time: startTime,
      });

      setSuccess("Randevu başarıyla oluşturuldu!");
      setSelectedDoctorId(null);
      setAppointmentDate("");
      setAppointmentTime("");
      
      // Randevuları yeniden yükle
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Randevu oluşturulamadı");
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center">
        <div className="text-lg text-slate-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-slate-800">
              Hastane Randevu Sistemi
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Randevu Oluşturma Formu */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Yeni Randevu Al
            </h2>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Doktor Seçin
                </label>
                <select
                  value={selectedDoctorId || ""}
                  onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  required
                >
                  <option value="">Doktor seçin...</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Randevu Tarihi
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Randevu Saati
                </label>
                <input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  required
                />
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
              >
                Randevu Oluştur
              </button>
            </form>
          </div>

          {/* Randevularım */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Randevularım
            </h2>

            {appointments.length === 0 ? (
              <p className="text-slate-500">Henüz randevunuz yok.</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {appointment.doctor?.full_name || `Doktor ID: ${appointment.doctor_id}`}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {new Date(appointment.start_time).toLocaleString("tr-TR", {
                            dateStyle: "long",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {appointment.status === "active" ? "Aktif" : "İptal"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Doktor Listesi */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Doktorlarımız
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-slate-800">{doctor.full_name}</h3>
                <p className="text-sm text-slate-600">{doctor.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
