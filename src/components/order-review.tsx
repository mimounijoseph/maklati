"use client";

import { useAuth } from "@/context/useContext";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "./ui/toast";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { Order } from "@/interfaces/order";
import { useTranslation } from "react-i18next";

type OrderReviewProps = {
  next: () => void;
  prev: () => void;
  snackId: any;
};

export const OrderReview = ({ next, prev, snackId }: OrderReviewProps) => {
  const { t, i18n } = useTranslation("common");
  const { selectedProducts, setSelectedProducts } = useAuth();
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Order>({
    number: null,
    date: new Date(),
    products: [],
    total: null,
    userUID: null,
    snackId: snackId,
  });

  const showToast = (
    title: string,
    message: string,
    variant:
      | "success"
      | "default"
      | "destructive"
      | "warning"
      | "info"
      | undefined
  ) => {
    toast({
      title,
      description: message,
      variant,
      duration: 2500,
    });
  };

  const calculTotal = () => {
    const sum = selectedProducts.reduce(
      (acc: number, prod: any) =>
        acc +
        prod?.cost.reduce(
          (sub: number, item: any) => sub + item.quantity * item.price,
          0
        ),
      0
    );
    setTotal(sum);
  };

  useEffect(() => {
    calculTotal();
  }, [selectedProducts]);

  async function addOrder() {
    try {
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
        products: selectedProducts,
        total: total,
        userUID: auth.currentUser?.uid,
        number: newNumber,
      };

      const docRef = await addDoc(ordersRef, newOrder);

      showToast(
        "Confirmed",
        "Your order will be prepared as soon as possible 😊",
        "success"
      );

      await addDoc(collection(db, "notifications"), {
        orderId: docRef.id,
        restaurantId: newOrder.snackId,
        title: `New Order #${newOrder.number}`,
        message: `${auth.currentUser?.displayName || "Client"} ordered, total: ${newOrder.total}`,
        createdAt: new Date(),
        read: false,
        type: "order",
      });
    } catch (error) {
      console.error("Error adding order: ", error);
    }
  }

  const fmt = (value: number) => t("currency_mad", { value });

  return (
    <div className="bg-white/70 text-black md:w-[60%] m-auto md:rounded-2xl px-10 py-5">
      <h1 className="text-2xl font-semibold mb-2 text-center">
        {t("orderReview.title")}
      </h1>

      <ul className="mb-4">
        {selectedProducts.map((product: any) =>
          product?.cost.map((p: any, index: number) => {
            if (p.quantity <= 0) return null;

            const lineTotal = p.quantity * p.price;

            return (
              <div key={`${product.id}-${index}`} className="mt-6 border-t border-black/40">
                <dl className="divide-y divide-gray/10">
                  <div className="px-4 py-6 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:px-0">
                    <img
                      src={product.urlPhoto}
                      alt="product image"
                      width="50"
                      height="50"
                    />

                    <dt className="text-sm font-medium text-black">
                      {product?.name}
                    </dt>

                    <dd className="mt-1 text-sm text-gray-700 sm:mt-0">
                      {t("orderReview.qty", { count: p.quantity })} • {fmt(p.price)}
                    </dd>

                    <div className="flex sm:flex-col md:flex-row justify-end items-center sm:mt-3 md:mt-0 sm:gap-5 md:gap-0">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => decrement(product, index)}
                          className="w-8 h-8 text-lg font-bold text-white bg-red-500 rounded-full hover:bg-red-600 transition cursor-pointer"
                          aria-label="decrement"
                        >
                          −
                        </button>
                        <span className="text-lg font-medium text-black">
                          {p.quantity}
                        </span>
                        <button
                          onClick={() => increment(product, index)}
                          className="w-8 h-8 text-lg font-bold text-white bg-green-500 rounded-full hover:bg-green-600 transition cursor-pointer"
                          aria-label="increment"
                        >
                          +
                        </button>
                      </div>

                      <span className="ml-2">
                        {t("orderReview.line_total")}: {fmt(lineTotal)}
                      </span>
                    </div>
                  </div>
                </dl>
              </div>
            );
          })
        )}
      </ul>

      <div className="flex flex-col-reverse justify-between items-center mt-5 md:mt-0 md:flex-row md:justify-between md:items-end gap-4">
        <div className="flex gap-5 items-center justify-center">
          <button
            onClick={prev}
            className="bg-black text-white px-4 py-2 rounded cursor-pointer"
          >
            {t("orderReview.back")}
          </button>

          <button
            onClick={async () => {
              await addOrder();
              next();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            {t("orderReview.confirm")}
          </button>
        </div>

        <p className="text-red-700 text-2xl">
          {t("orderReview.total")} : {fmt(total)}
        </p>
      </div>
    </div>
  );

  function decrement(product: any, idx: number) {
    if (product.cost[idx].quantity > 0) {
      const updated = selectedProducts.map((p: any) => {
        if (p.id === product.id) {
          const cost = p.cost.map((e: any, i: number) =>
            i === idx ? { ...e, quantity: e.quantity - 1 } : e
          );
          return { ...p, cost };
        }
        return p;
      });
      setSelectedProducts(updated);
    }
  }

  function increment(product: any, idx: number) {
    const updated = selectedProducts.map((p: any) => {
      if (p.id === product.id) {
        const cost = p.cost.map((e: any, i: number) =>
          i === idx ? { ...e, quantity: e.quantity + 1 } : e
        );
        return { ...p, cost };
      }
      return p;
    });
    setSelectedProducts(updated);
  }
};
