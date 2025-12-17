"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserDashboard from "@/components/patient/UserDashboard";
import { getUserData, getToken } from "@/lib/api";

const UserDashboardPage: React.FC = () => {
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

    if (userData.role !== "patient") {
      // Wrong role, redirect to appropriate dashboard
      if (userData.role === "doctor") {
        router.push("/doctor/dashboard");
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

  return <UserDashboard />;
};

export default UserDashboardPage;
