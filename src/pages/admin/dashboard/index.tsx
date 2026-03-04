"use client";
import React, { FC } from "react";
import Sidebar from "./sidebar";
import ProtectedLayout from "@/guard/adminProtectedPage";
import { useAuth } from "@/context/useContext";
import LiveDashboard from "@/components/dashboard/liveDashboard";


const Index: FC = () => {
  const { user } = useAuth();

  return (
    <ProtectedLayout>
      <div className="admin" style={{ fontFamily: "sans-serif" }}>
        <Sidebar />
        <LiveDashboard snackId={user?.uid} />
      </div>
    </ProtectedLayout>
  );
};

export default Index;
