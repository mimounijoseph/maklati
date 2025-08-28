"use client";

import React from "react";
import QRCode from "react-qr-code";

interface QrCodeGeneratorProps {
  menuId: string;
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ menuId=1 }) => {
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/menu/${menuId}`;

  return (
    <div className="flex flex-col  ">
      <p className="">Scannez ce QR code pour accéder au menu #{menuId}</p>
      <QRCode className="w-40 "  value={url} />
    </div>
  );
};

export default QrCodeGenerator;
