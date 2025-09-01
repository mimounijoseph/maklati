"use client"; 
import React, { FC } from "react";
import Sidebar from "./sidebar";
import UrlInput from "@/components/urlInput";

import QrCodeGenerator from '@/components/qrcode';
import OrderChart from "@/components/dashboard/ordersChart";

const Index: FC = () => {
  return (
    <div className="admin bg-white" style={{fontFamily:'sans-serif'}}>
      <Sidebar />
      <div className="min-h-screen  p-4 sm:ml-64">
        <div className=" mt-14">
            {/* <UrlInput/>
              <QrCodeGenerator menuId="123" /> */}
              <OrderChart/>
        </div>
      </div>
    </div>
  );
};
export default Index;