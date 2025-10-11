"use client";
import React, { FC } from "react";
import Sidebar from "./sidebar";

import OrderChart from "@/components/dashboard/ordersChart";
import RevenueChart from "@/components/dashboard/revenueChart";
import RevenueOrdersCards from "@/components/dashboard/orders&revenueCards";
import ProtectedLayout from "@/guard/protectedPage";


const Index: FC = () => {
  return (
   
    <div className="admin bg-white" style={{ fontFamily: "sans-serif" }}>
      <Sidebar />
      <div className="min-h-screen p-4 sm:ml-64">
          <div className="mt-14  gap-4">
          <RevenueOrdersCards />
        </div>
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
          <OrderChart />
          <RevenueChart />
        </div>
      </div>
    </div>
 
  );
};

export default Index;
