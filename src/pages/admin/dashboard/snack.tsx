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
      <div className="admin mt-14 bg-slate-50/70" style={{ fontFamily: "sans-serif" }}>
        <Sidebar />
        <div className="min-h-screen px-3 pb-6 pt-4 sm:ml-64 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:p-5">
              <SnackInfo onSnackChange={setSnackDocId} />
            </div>
            <div className="h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:p-6 xl:sticky xl:top-24">
              <div className="mb-6 flex w-full items-center gap-2">
                <div>
                  <svg
                    className="h-7 w-7 text-slate-800"
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
                  <h2 className="text-lg font-bold text-slate-800 sm:text-xl">Access to your menu</h2>
                </div>
              </div>

              {snackDocId ? (
                <QrCodeGenerator snackId={snackDocId} />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                  Add your snack details to generate a customer QR code.
                </div>
              )}

              <div
                className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700"
                role="alert"
              >
                <svg
                  className="mt-0.5 inline h-4 w-4 shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <small className="leading-5">
                  Download the QR code and paste it on your restaurant tables.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default Snack;
