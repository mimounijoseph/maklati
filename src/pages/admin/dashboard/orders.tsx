import React, { FC } from "react";
import Sidebar from "./sidebar";



const Orders: FC = () => {
  return (
    <div className="admin h-full bg-white" style={{fontFamily:'sans-serif'}}>
      <Sidebar />
      <div className="h-screen p-4 sm:ml-64">
         {/* code here */}
      </div>
    </div>
  );
};
export default Orders;