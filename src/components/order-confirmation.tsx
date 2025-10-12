"use client";

import { collection, where, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export const OrderConfirmation = () => {
  const { t } = useTranslation("common");
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  const content = useMemo(
    () =>
      orderNumber == null
        ? {
            title: t("orderConfirmation.creating_title"),
            message: t("orderConfirmation.creating_message"),
            loading: t("orderConfirmation.creating_loading"),
          }
        : {
            title: t("orderConfirmation.done_title", { num: orderNumber }),
            message: t("orderConfirmation.done_message"),
            loading: t("orderConfirmation.done_loading"),
          },
    [orderNumber, t]
  );

  async function fetchOrder() {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("userUID", "==", uid), orderBy("number", "desc"), limit(1));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const lastOrder = snap.docs[0].data() as { number?: number };
        if (lastOrder?.number) setOrderNumber(lastOrder.number);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (orderNumber == null) {
      fetchOrder();
      interval = setInterval(fetchOrder, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [orderNumber]);

  return (
    <div className="text-center bg-white/70 w-fit m-auto rounded-3xl px-10 py-5">
      <h2 className="text-2xl font-bold text-amber-600">{content.title}</h2>
      <p className="mt-2 text-black">{content.message}</p>
      <div className="mt-4 animate-pulse text-black">{content.loading}</div>
      <img src="/fast-food.gif" alt={t("orderConfirmation.img_alt")} />
    </div>
  );
};
