"use client";
import React, { FC } from "react";
import Sidebar from "./sidebar";
import SnackInfo from "@/components/snackinfo";
import QrCodeGenerator from "@/components/qrcode/index";




const Snack: FC = () => {
  return (
    <div className="admin mt-14 bg-white" style={{ fontFamily: "sans-serif" }}>
      <Sidebar />
        <div className="min-h-screen p-4 sm:ml-64">
        <div className="flex gap-4">
            <div className="w-[70%]">
            <SnackInfo />
            </div>
            <div className="w-[30%] p-6 border rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Snack Information</h2>
            <QrCodeGenerator menuId="1" />
            </div>
        </div>
        </div>

    </div>
      );
    };
    

    export default Snack;