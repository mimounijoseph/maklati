"use client";

import React from "react";
import QRCode from "react-qr-code";

interface QrCodeGeneratorProps {
  menuId: string;
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ menuId=1 }) => {
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/menu/${menuId}`;

  return (
    <div className="flex flex-col justify-center items-center  ">
      <p className="text-gray-800">Scannez ce QR code pour accéder au menu </p>
      <QRCode className="w-80 "  value={url} />
    </div>
  );
};

export default QrCodeGenerator;
