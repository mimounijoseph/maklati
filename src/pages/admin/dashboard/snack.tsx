"use client";
import React, { FC } from "react";
import Sidebar from "./sidebar";
import SnackInfo from "@/components/snackinfo";
import QrCodeGenerator from "@/components/qrcode/index";
import ProtectedLayout from "@/guard/protectedPage";



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
          <div className="w-full flex items-center gap-2 mb-6">
            <div>
                <svg className="w-7 h-7 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7.926 10.898 15 7.727m-7.074 5.39L15 16.29M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0-11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
                </svg>
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800 ">Access to your menu  </h2>
            </div>
          </div>
            <QrCodeGenerator menuId="1" />
          <div className="flex items-center p-4 m-4 text-sm text-yellow-400 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
            <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span className="sr-only">Info</span>
            <small>
               Download the QR code and paste it on your restaurant tables.
            </small>
          </div>
          {/* <button>
            downloed Qr
          </button> */}
          </div>
        </div>
        </div>

    </div>
  
      );
    };
    

    export default Snack;