"use client";

import React, { useState } from "react";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingCalendarProps {
  selectedDepartment: string;
  selectedDoctor: string;
  onBack: () => void;
}

const BookingCalendar = ({ selectedDepartment, selectedDoctor, onBack }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  // Generate time slots based on department
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        // Randomly mark some slots as unavailable for demo
        const available = Math.random() > 0.3;
        slots.push({ time, available });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      alert(`Appointment booked with ${selectedDoctor} (${selectedDepartment}) on ${selectedDate} at ${selectedTime}`);
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="rounded-xl bg-white p-2 text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-600">Book Appointment</p>
          <h4 className="text-2xl font-bold text-slate-900">{selectedDoctor}</h4>
          <p className="text-sm text-slate-600">{selectedDepartment}</p>
        </div>
      </div>

      {/* Date Selection */}
      <section className="rounded-3xl bg-white p-6 shadow-xl shadow-sky-100/50 ring-1 ring-slate-100">
        <h5 className="mb-4 text-lg font-bold text-slate-900">Select a Date</h5>
        <div className="grid grid-cols-7 gap-3">
          {dates.map((date, index) => {
            const dateString = date.toISOString().split("T")[0];
            const isSelected = selectedDate === dateString;
            const isToday = index === 0;

            return (
              <button
                key={dateString}
                onClick={() => {
                  setSelectedDate(dateString);
                  setSelectedTime(null);
                }}
                className={`rounded-2xl px-3 py-4 text-center transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg ring-2 ring-sky-300"
                    : isToday
                    ? "bg-sky-50 text-sky-700 ring-2 ring-sky-200 hover:bg-sky-100"
                    : "bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 hover:ring-slate-300"
                }`}
              >
                <div className="text-xs font-semibold">{getDayName(date)}</div>
                <div className="text-lg font-bold">{date.getDate()}</div>
                <div className="text-xs opacity-75">{date.toLocaleDateString("en-US", { month: "short" })}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Time Selection */}
      {selectedDate && (
        <section className="rounded-3xl bg-white p-6 shadow-xl shadow-sky-100/50 ring-1 ring-slate-100">
          <h5 className="mb-4 text-lg font-bold text-slate-900">
            Available Times for {new Date(selectedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </h5>
          <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot.time;
              
              return (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isSelected
                      ? "bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg ring-2 ring-sky-300"
                      : slot.available
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 hover:ring-emerald-300"
                      : "cursor-not-allowed bg-slate-100 text-slate-400 ring-1 ring-slate-200 opacity-50"
                  }`}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Booking Confirmation */}
      {selectedDate && selectedTime && (
        <section className="rounded-3xl bg-gradient-to-br from-sky-50 to-emerald-50 p-6 ring-1 ring-sky-200">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-700">Appointment Summary</p>
              <h5 className="text-xl font-bold text-slate-900">Confirm Your Booking</h5>
            </div>
          </div>
          <div className="mb-6 space-y-2 rounded-2xl bg-white/70 p-4 backdrop-blur-sm">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-600">Doctor:</span>
              <span className="font-bold text-slate-900">{selectedDoctor}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-600">Department:</span>
              <span className="font-bold text-slate-900">{selectedDepartment}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-600">Date:</span>
              <span className="font-bold text-slate-900">
                {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-600">Time:</span>
              <span className="font-bold text-slate-900">{selectedTime}</span>
            </div>
          </div>
          <button
            onClick={handleBooking}
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-6 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            Confirm Appointment
          </button>
        </section>
      )}
    </div>
  );
};

export default BookingCalendar;
