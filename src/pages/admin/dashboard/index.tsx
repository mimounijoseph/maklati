import React, { FC } from "react";
import Sidebar from "./sidebar";
import PexelsSearchModal from "@/components/pexelsSearch";

const Index: FC = () => {
  return (
    <div style={{fontFamily:'sans-serif'}}>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
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