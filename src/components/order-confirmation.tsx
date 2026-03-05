"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/useContext";

type LiveOrder = {
  number?: number;
  total?: number;
  status?: string;
  date?: any;
  products?: any[];
};

const statusSteps = [
  {
    id: "Pending",
    label: "Order received",
    description: "The restaurant has your order and will start it shortly.",
  },
  {
    id: "In Progress",
    label: "Preparing your plats",
    description: "Your food is being prepared right now.",
  },
  {
    id: "Completed",
    label: "Ready to collect",
    description: "The order is completed and ready for handoff.",
  },
];

const statusTone: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-orange-100 text-orange-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

const toDisplayDate = (value: any) => {
  if (value?.toDate) {
    return value.toDate().toLocaleString();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Just now";
  }

  return parsed.toLocaleString();
};

export const OrderConfirmation = () => {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const [order, setOrder] = useState<LiveOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = user?.uid || auth.currentUser?.uid;

    if (!uid) {
      setLoading(false);
      return;
    }

    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userUID", "==", uid),
      orderBy("number", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          setOrder(snapshot.docs[0].data() as LiveOrder);
        } else {
          setOrder(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error watching order:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const currentStatus = order?.status || "Pending";
  const currentStepIndex = Math.max(
    0,
    statusSteps.findIndex((step) => step.id === currentStatus)
  );

  const progressWidth = useMemo(() => {
    if (!order) {
      return 8;
    }

    return ((currentStepIndex + 1) / statusSteps.length) * 100;
  }, [currentStepIndex, order]);

  const totalItems = useMemo(() => {
    if (!order?.products) {
      return 0;
    }

    return order.products.reduce(
      (acc: number, product: any) =>
        acc +
        (product?.cost || []).reduce(
          (sum: number, entry: any) => sum + (entry.quantity || 0),
          0
        ),
      0
    );
  }, [order]);

  const fmt = (value: number) => t("currency_mad", { value });
  const activeStep = statusSteps[currentStepIndex] || statusSteps[0];

  return (
    <div className="relative overflow-hidden px-4 pb-16 pt-4 sm:px-6">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.22),transparent_52%)]" />

      <div className="mx-auto max-w-6xl">
        <div className="rounded-[36px] border border-white/70 bg-white/82 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-5 border-b border-slate-100 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-500">
                Live order status
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                {loading
                  ? "Connecting to your order..."
                  : order?.number
                  ? `Order #${order.number}`
                  : "We are preparing your live tracking"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {loading
                  ? "Please wait while we connect to the restaurant updates."
                  : activeStep.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-3xl border border-white/80 bg-slate-950 px-5 py-4 text-white shadow-[0_20px_60px_rgba(15,23,42,0.2)]">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                  Current status
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      statusTone[currentStatus] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {currentStatus}
                  </span>
                  <span className="relative inline-flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-70" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
            <section className="rounded-[32px] bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                    Progress
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    Track your order in real time
                  </h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                  Updated by admin
                </div>
              </div>

              <div className="mt-8">
                <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-400 transition-all duration-700 ease-out"
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isActive = index === currentStepIndex;
                    const isPending = index > currentStepIndex;

                    return (
                      <div
                        key={step.id}
                        className={`rounded-3xl border p-5 transition-all duration-500 ${
                          isActive
                            ? "border-orange-300 bg-orange-50 text-slate-950 shadow-[0_18px_50px_rgba(249,115,22,0.18)]"
                            : isCompleted
                            ? "border-emerald-200 bg-emerald-50 text-slate-950"
                            : "border-white/10 bg-white/5 text-white/70"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold ${
                              isActive
                                ? "bg-orange-500 text-white shadow-[0_12px_30px_rgba(249,115,22,0.28)]"
                                : isCompleted
                                ? "bg-emerald-500 text-white"
                                : "bg-white/10 text-white/70"
                            }`}
                          >
                            {index + 1}
                          </span>
                          {isActive && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/12 px-3 py-1 text-xs font-semibold text-orange-200">
                              <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400" />
                              Live
                            </span>
                          )}
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">{step.label}</h3>
                        <p
                          className={`mt-2 text-sm leading-6 ${
                            isPending ? "text-white/55" : "text-inherit"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Order details
                </p>
                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Order number</span>
                    <span className="font-semibold text-slate-950">
                      {order?.number ? `#${order.number}` : "--"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Items</span>
                    <span className="font-semibold text-slate-950">{totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Total</span>
                    <span className="font-semibold text-slate-950">
                      {typeof order?.total === "number" ? fmt(order.total) : "--"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Last update</span>
                    <span className="text-right font-semibold text-slate-950">
                      {order?.date ? toDisplayDate(order.date) : "Just now"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 shadow-[0_20px_70px_rgba(249,115,22,0.08)]">
                <p className="text-xs uppercase tracking-[0.28em] text-orange-500">
                  What happens next
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <li>
                    The restaurant changes the status from the admin dashboard.
                  </li>
                  <li>
                    This page updates automatically when the status changes.
                  </li>
                  <li>
                    Once the order is completed, the progress reaches the final
                    step.
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
