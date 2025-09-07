"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { db } from "../config/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

type Notification = {
  orderId: string;
  restaurantId: string;
  title: string;
  message: string;
  createdAt: any;
  read: boolean;
  type: string;
};

type NotificationDropdownProps = {
  onNewOrder?: (message: string) => void;
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onNewOrder }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const isInitialLoad = useRef(true); // 🔑 track initial snapshot

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newNotif = {
            ...change.doc.data(),
            createdAt: change.doc.data().createdAt?.toDate
              ? change.doc.data().createdAt.toDate()
              : new Date(),
          } as Notification;

          // ✅ Only trigger sound + alert after initial load
          if (!isInitialLoad.current && newNotif.type === "order") {
            const audio = new Audio("/sounds/cashier.mp3");
            audio.play().catch((err) => console.error("Sound error:", err));

            onNewOrder?.(newNotif.message);
          }

          setNotifications((prev) => [newNotif, ...prev]);
        }

        if (change.type === "modified") {
          setNotifications((prev) =>
            prev.map((n) =>
              n.orderId === change.doc.data().orderId
                ? {
                    ...change.doc.data(),
                    createdAt: change.doc.data().createdAt?.toDate
                      ? change.doc.data().createdAt.toDate()
                      : new Date(),
                  } as Notification
                : n
            )
          );
        }

        if (change.type === "removed") {
          setNotifications((prev) =>
            prev.filter((n) => n.orderId !== change.doc.data().orderId)
          );
        }
      });

      // 🔑 After first snapshot, mark as loaded
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
      }
    });

    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* Notification button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-950 focus:outline-none"
      >
        <Bell className="w-7 h-7" />
        {unreadCount > 0 && (
          <div className="absolute block w-4 h-4 bg-red-600 border-2 border-white rounded-full -top-0.5 left-3 flex items-center justify-center">
            <p className="text-white text-xs">{unreadCount}</p>
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 z-20 w-80 max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
          <div className="block px-4 py-2 font-medium text-center text-gray-900 rounded-t-lg bg-gray-50">
            Notifications
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="px-4 py-3 text-gray-500 text-sm text-center">
                No notifications
              </div>
            )}

            {notifications.map((notif, index) => (
              <div key={index} className="flex px-4 py-3 hover:bg-gray-100">
                {/* <div className="shrink-0 relative">
                  <img
                    className="rounded-full w-11 h-11"
                    src="https://randomuser.me/api/portraits/lego/1.jpg"
                    alt="profile"
                  />
                </div> */}
                <div className="w-full ps-3">
                  <div className="text-gray-500 text-sm mb-1.5">{notif.message}</div>
                  <div className="text-xs text-blue-600">
                    {notif.createdAt.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <a
            href="#"
            className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100"
          >
            View all
          </a>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
