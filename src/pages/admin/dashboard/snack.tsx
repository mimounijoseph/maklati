"use client";
import React, { FC, useState } from "react";
import Sidebar from "./sidebar";
import SnackInfo from "@/components/snackinfo";
import QrCodeGenerator from "@/components/qrcode/index";
import ProtectedLayout from "@/guard/adminProtectedPage";

const Snack: FC = () => {
  const [snackDocId, setSnackDocId] = useState<string | null>(null);

  return (
    <ProtectedLayout>
      <div className="admin mt-14 bg-white" style={{ fontFamily: "sans-serif" }}>
        <Sidebar />
        <div className="min-h-screen p-4 sm:ml-64">
          <div className="flex gap-4">
            <div className="w-[70%]">
              <SnackInfo onSnackChange={setSnackDocId} />
            </div>
            <div className="w-[30%] rounded-md border p-6 shadow-md">
              <div className="mb-6 flex w-full items-center gap-2">
                <div>
                  <svg
                    className="h-7 w-7 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M7.926 10.898 15 7.727m-7.074 5.39L15 16.29M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0-11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Access to your menu</h2>
                </div>
              </div>

              {snackDocId ? (
                <QrCodeGenerator snackId={snackDocId} />
              ) : (
                <div className="rounded-md border border-dashed border-gray-300 p-6 text-sm text-gray-500">
                  Add your snack details to generate a customer QR code.
                </div>
              )}

              <div
                className="m-4 flex items-center rounded-lg bg-yellow-50 p-4 text-sm text-yellow-400 dark:bg-gray-800 dark:text-yellow-300"
                role="alert"
              >
                <svg
                  className="me-3 inline h-4 w-4 shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <small>Download the QR code and paste it on your restaurant tables.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default Snack;
