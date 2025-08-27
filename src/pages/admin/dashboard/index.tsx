import React, { FC } from "react";
import Sidebar from "./sidebar";

import PexelsSearchModal from "@/components/pexelsSearch";

const Index: FC = () => {
  return (
    <div style={{fontFamily:'sans-serif'}}>
      <Sidebar />
      <div className="h-screen p-4 sm:ml-64">
        <div className=" mt-14">
             {/* Pexels Search Component */}
      <PexelsSearchModal
        onSelect={() => alert("")}
      />
        </div>
      </div>
    </div>
  );
};
export default Index;