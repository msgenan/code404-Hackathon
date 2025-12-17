"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DoctorDashboard from "@/components/doctor/DoctorDashboard";
import { getUserData, getToken } from "@/lib/api";

const DoctorDashboardPage: React.FC = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const userData = getUserData();

    if (!token || !userData) {
      // No auth, redirect to login
      router.push("/");
      return;
    }

    if (userData.role !== "doctor") {
      // Wrong role, redirect to appropriate dashboard
      if (userData.role === "patient") {
        router.push("/user/dashboard");
      } else {
        router.push("/");
      }
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return <DoctorDashboard />;
};

export default DoctorDashboardPage;
