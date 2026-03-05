"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { addDoc, collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuth } from "@/context/useContext";
import { useToast } from "./ui/toast";
import { Order } from "@/interfaces/order";

type OrderReviewProps = {
  next: () => void;
  prev: () => void;
  snackId: any;
};

type OrderLine = {
  key: string;
  productId: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export const OrderReview = ({ next, prev, snackId }: OrderReviewProps) => {
  const { t } = useTranslation("common");
  const { selectedProducts, setSelectedProducts } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState<Order>({
    number: null,
    date: new Date(),
    products: [],
    total: null,
    userUID: null,
    snackId,
    status: "Pending",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      snackId,
    }));
  }, [snackId]);

  const orderLines = useMemo<OrderLine[]>(
    () =>
      selectedProducts.flatMap((product: any) =>
        (product?.cost || [])
          .filter((cost: any) => cost.quantity > 0)
          .map((cost: any, index: number) => ({
            key: `${product.id}-${cost.size}-${index}`,
            productId: String(product.id),
            name: product?.name || "Product",
            image: product?.urlPhoto || "/images.jpg",
            size: cost.size,
            quantity: cost.quantity,
            unitPrice: cost.price,
            lineTotal: cost.quantity * cost.price,
          }))
      ),
    [selectedProducts]
  );

  useEffect(() => {
    const sum = selectedProducts.reduce(
      (acc: number, product: any) =>
        acc +
        (product?.cost || []).reduce(
          (sub: number, item: any) => sub + item.quantity * item.price,
          0
        ),
      0
    );

    setTotal(sum);
  }, [selectedProducts]);

  const itemCount = useMemo(
    () => orderLines.reduce((acc, line) => acc + line.quantity, 0),
    [orderLines]
  );

  const fmt = (value: number) => t("currency_mad", { value });

  function showToast(
    title: string,
    message: string,
    variant:
      | "success"
      | "default"
      | "destructive"
      | "warning"
      | "info"
      | undefined
  ) {
    toast({
      title,
      description: message,
      variant,
      duration: 2500,
    });
  }

  async function addOrder() {
    try {
      if (!snackId || orderLines.length === 0) {
        showToast(
          "Cart is empty",
          "Add at least one product before confirming your order.",
          "warning"
        );
        return false;
      }

      setSubmitting(true);

      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, orderBy("number", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      let newNumber = 1;
      if (!querySnapshot.empty) {
        const lastOrder = querySnapshot.docs[0].data();
        newNumber = (lastOrder.number || 0) + 1;
      }

      const newOrder = {
        ...formData,
        date: new Date(),
        products: selectedProducts,
        total,
        userUID: auth.currentUser?.uid,
        number: newNumber,
      };

      const docRef = await addDoc(ordersRef, newOrder);

      await addDoc(collection(db, "notifications"), {
        orderId: docRef.id,
        restaurantId: newOrder.snackId,
        title: `New Order #${newOrder.number}`,
        message: `${auth.currentUser?.displayName || "Client"} ordered, total: ${
          newOrder.total
        }`,
        createdAt: new Date(),
        read: false,
        type: "order",
      });

      setSelectedProducts([]);
      showToast(
        "Confirmed",
        "Your order was sent to the restaurant successfully.",
        "success"
      );

      return true;
    } catch (error) {
      console.error("Error adding order: ", error);
      showToast(
        "Order failed",
        "We could not send your order. Please try again.",
        "destructive"
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  function updateQuantity(line: OrderLine, delta: number) {
    const updated = selectedProducts
      .map((product: any) => {
        if (String(product.id) !== line.productId) {
          return product;
        }

        const cost = (product.cost || []).map((entry: any) => {
          if (entry.size !== line.size) {
            return entry;
          }

          return { ...entry, quantity: Math.max(0, entry.quantity + delta) };
        });

        return { ...product, cost };
      })
      .filter((product: any) =>
        (product.cost || []).some((entry: any) => entry.quantity > 0)
      );

    setSelectedProducts(updated);
  }

  return (
    <div className="relative overflow-hidden px-4 pb-12 pt-4 sm:px-6">
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.18),transparent_55%)]" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-500">
              Checkout
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Review your order before sending it
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Double-check your plats, quantities, and total. Once you confirm,
              the restaurant will receive the order instantly.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-auto">
            <div className="rounded-3xl border border-white/80 bg-white/80 px-5 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Items
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {itemCount}
              </p>
            </div>
            <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-500 to-amber-500 px-5 py-4 text-white shadow-[0_18px_60px_rgba(249,115,22,0.28)]">
              <p className="text-xs uppercase tracking-[0.28em] text-white/70">
                Total
              </p>
              <p className="mt-2 text-2xl font-semibold">{fmt(total)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
          <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/82 shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
              <h2 className="text-lg font-semibold text-slate-950">
                Selected plats
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Update quantities here before confirming.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {orderLines.length > 0 ? (
                orderLines.map((line) => (
                  <article
                    key={line.key}
                    className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:px-8"
                  >
                    <img
                      src={line.image}
                      alt={line.name}
                      className="h-24 w-full rounded-3xl object-cover sm:h-24 sm:w-28"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-950">
                            {line.name}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <span className="rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-600">
                              {line.size}
                            </span>
                            <span>{fmt(line.unitPrice)} each</span>
                          </div>
                        </div>

                        <p className="text-lg font-semibold text-slate-950">
                          {fmt(line.lineTotal)}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 shadow-inner">
                          <button
                            type="button"
                            onClick={() => updateQuantity(line, -1)}
                            className="h-10 w-10 rounded-full bg-white text-lg font-semibold text-slate-900 transition hover:bg-slate-100"
                            aria-label={`Decrease ${line.name}`}
                          >
                            -
                          </button>
                          <span className="min-w-12 text-center text-sm font-semibold text-slate-900">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(line, 1)}
                            className="h-10 w-10 rounded-full bg-orange-500 text-lg font-semibold text-white transition hover:bg-orange-600"
                            aria-label={`Increase ${line.name}`}
                          >
                            +
                          </button>
                        </div>

                        <p className="text-sm text-slate-500">
                          {line.quantity} x {fmt(line.unitPrice)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="px-6 py-14 text-center sm:px-8">
                  <p className="text-lg font-semibold text-slate-900">
                    Your cart is empty
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Go back to the menu and add some plats first.
                  </p>
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-[32px] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_28px_90px_rgba(15,23,42,0.2)] sm:p-8">
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/70">
              Order summary
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm text-white/60">Plats selected</span>
                <span className="text-sm font-semibold">{itemCount}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm text-white/60">Different lines</span>
                <span className="text-sm font-semibold">{orderLines.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm text-white/60">Restaurant status</span>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Ready to receive
                </span>
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-white/6 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                Total to pay
              </p>
              <p className="mt-3 text-3xl font-semibold">{fmt(total)}</p>
              <p className="mt-3 text-sm leading-6 text-white/60">
                The restaurant can update your order status after confirmation,
                and you will see the progress on the next screen.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={async () => {
                  const created = await addOrder();
                  if (created) {
                    next();
                  }
                }}
                disabled={submitting || orderLines.length === 0}
                className="inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending your order..." : t("orderReview.confirm")}
              </button>

              <button
                type="button"
                onClick={prev}
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t("orderReview.back")}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
