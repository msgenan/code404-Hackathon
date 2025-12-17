"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DoctorDashboard from "@/components/doctor/DoctorDashboard";
import { getUserData, getToken } from "@/lib/api";

const DoctorDashboardPage: React.FC = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;
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

    if (isMounted) {
      setIsAuthorized(true);
    }

    return () => {
      isMounted = false;
    };
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
