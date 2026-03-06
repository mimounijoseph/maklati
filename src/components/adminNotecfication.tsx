"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "@/context/useContext";

type Notification = {
  id: string;
  orderId: string;
  restaurantId: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  type: string;
};

type NotificationDropdownProps = {
  onNewOrder?: (message: string) => void;
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onNewOrder }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const isInitialLoad = useRef(true);
  const onNewOrderRef = useRef(onNewOrder);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onNewOrderRef.current = onNewOrder;
  }, [onNewOrder]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      isInitialLoad.current = true;
      return;
    }

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("restaurantId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const nextNotifications = snapshot.docs
        .map((docSnap) => {
          const raw = docSnap.data();
          return {
            id: docSnap.id,
            ...(raw as Omit<Notification, "id" | "createdAt">),
            createdAt: raw.createdAt?.toDate ? raw.createdAt.toDate() : new Date(),
          } as Notification;
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setNotifications(nextNotifications);

      snapshot.docChanges().forEach((change) => {
        const raw = change.doc.data();
        const current: Notification = {
          id: change.doc.id,
          ...(raw as Omit<Notification, "id" | "createdAt">),
          createdAt: raw.createdAt?.toDate ? raw.createdAt.toDate() : new Date(),
        };

        if (change.type === "added" && !isInitialLoad.current && current.type === "order") {
          const audio = new Audio("/sounds/cashier.mp3");
          audio.play().catch((err) => console.error("Sound error:", err));
          onNewOrderRef.current?.(current.message);
        }
      });

      if (isInitialLoad.current) {
        isInitialLoad.current = false;
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((item) => !item.read);
      if (unreadNotifications.length === 0) return;

      const batch = writeBatch(db);
      unreadNotifications.forEach((item) => {
        batch.update(doc(db, "notifications", item.id), { read: true });
      });
      await batch.commit();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const groupedLabel = useMemo(() => {
    if (unreadCount === 0) return "All caught up";
    if (unreadCount === 1) return "1 unread alert";
    return `${unreadCount} unread alerts`;
  }, [unreadCount]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed left-1/2 top-[84px] z-[90] w-[calc(100vw-1.5rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.14)] sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-[360px] sm:max-w-[92vw] sm:translate-x-0">
          <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">Notifications</p>
                <p className="mt-1 text-xs text-slate-500">{groupedLabel}</p>
              </div>
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto sm:max-h-[380px]">
            {notifications.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-slate-500">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`border-b border-slate-100 px-4 py-4 transition hover:bg-slate-50 ${
                    notif.read ? "bg-white" : "bg-orange-50/40"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {notif.title || "Notification"}
                        </p>
                        {!notif.read && (
                          <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{notif.message}</p>
                      <p className="mt-2 text-xs text-slate-400">
                        {notif.createdAt.toLocaleString()}
                      </p>
                    </div>

                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="self-start rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
                      >
                        Read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
