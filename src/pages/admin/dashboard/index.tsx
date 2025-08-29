import React, { FC } from "react";
import Sidebar from "./sidebar";
import UrlInput from "@/components/urlInput";

import QrCodeGenerator from '@/components/qrcode';

const Index: FC = () => {
  return (
    <div className="admin h-full bg-white" style={{fontFamily:'sans-serif'}}>
      <Sidebar />
      <div className="h-screen p-4 sm:ml-64">
        <div className=" mt-14">
            <UrlInput/>
              <QrCodeGenerator menuId="123" />
        </div>
      </div>
    </div>
  );
};
export default Index;