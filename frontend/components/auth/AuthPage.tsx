"use client";
import React from "react";
import AuthCard from "./AuthCard";

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <AuthCard />
    </div>
  );
};

export default AuthPage;
