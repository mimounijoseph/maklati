import React, { FC } from "react";
import Sidebar from "./sidebar";
const Index: FC = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
         {/* code here */}
        </div>
      </div>
    </div>
  );
};
export default Index;