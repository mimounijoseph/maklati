"use client";
import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";

type NewOrderAlertProps = {
  message: string;
};

const NewOrderAlert: React.FC<NewOrderAlertProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setVisible(true), 50);

    // Auto-hide after 5 seconds
    const hideTimer = setTimeout(() => setVisible(false), 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div
      className={`fixed top-14 left-1/2 transform -translate-x-1/2 z-50 
        w-auto max-w-lg px-4 
        transition-all duration-500 ease-in-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
      `}
    >
      <div
        className="flex items-center p-4 text-sm text-blue-800 border border-blue-300 
        rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800 shadow-md"
        role="alert"
      >
        <Bell className="shrink-0 inline w-4 h-4 me-3" />
        <div>
          <span className="font-medium">New Order!</span> {message}
        </div>
      </div>
    </div>
  );
};

export default NewOrderAlert;
