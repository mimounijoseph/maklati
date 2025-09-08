"use client";

import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";

interface QrCodeGeneratorProps {
  menuId: string;
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ menuId = "1" }) => {
  const ref = useRef<HTMLDivElement>(null);

  const url = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/menu/${menuId}`;

  const downloadImage = async () => {
    if (ref.current === null) return;
    try {
      const dataUrl = await toPng(ref.current);
      const link = document.createElement("a");
      link.download = `menu-${menuId}-qrcode.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to download image", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      {/* The container to export */}
      <div
        ref={ref}
        className="flex flex-col justify-center items-center border border-gray-100 rounded-md shadow-md p-4 bg-white"
      >
        <p className="text-gray-800 text-center">
          Scan this QR code to access the menu
        </p>
        <QRCode className="w-48 h-48" value={url} />
      </div>

      {/* Download button */}
      <button
        onClick={downloadImage}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        <div className="flex items-center gap-2">
          <div>
            <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
            </svg>
          </div>
          <div>
              Download QR Code
          </div>
        </div>
      </button>
    </div>
  );
};

export default QrCodeGenerator;
