"use client";
import React from "react";
import { Bell } from "lucide-react";

type NewOrderAlertProps = {
  message: string;
};

const NewOrderAlert: React.FC<NewOrderAlertProps> = ({ message }) => {
  return (
    <div
      className="flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
      role="alert"
    >
      <Bell className="shrink-0 inline w-4 h-4 me-3" />
      <div>
        <span className="font-medium">New Order!</span> {message}
      </div>
    </div>
  );
};

export default NewOrderAlert;
