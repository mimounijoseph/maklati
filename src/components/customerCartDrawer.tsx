"use client";

import { auth, db } from "@/config/firebase";
import { useAuth } from "@/context/useContext";
import { Price } from "@/context/currencyContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type CustomerCartDrawerProps = {
  orderOwnerId?: string | null;
  onReview: () => void;
  reviewLabel?: string;
};

type OrderHistoryItem = {
  id: string;
  number?: number;
  total?: number;
  status?: string;
  date?: any;
  snackId?: string;
};

const toTimestamp = (value: any) => {
  if (value?.toDate) return value.toDate().getTime();
  if (value?.seconds) return value.seconds * 1000;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

export default function CustomerCartDrawer({
  orderOwnerId,
  onReview,
  reviewLabel = "Review order",
}: CustomerCartDrawerProps) {
  const { selectedProducts } = useAuth();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<OrderHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartItems = useMemo(
    () =>
      selectedProducts.flatMap((product: any) =>
        (product?.cost || [])
          .filter((cost: any) => cost.quantity > 0)
          .map((cost: any) => ({
            id: `${product.id}-${cost.size}`,
            name: product.name,
            size: cost.size,
            quantity: cost.quantity,
            price: cost.price,
            lineTotal: cost.quantity * cost.price,
          }))
      ),
    [selectedProducts]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum: number, item: any) => sum + item.lineTotal, 0),
    [cartItems]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setHistory([]);
        return;
      }

      setLoadingHistory(true);
      try {
        const ordersQuery = query(collection(db, "orders"), where("userUID", "==", uid));
        const snapshot = await getDocs(ordersQuery);
        let orders = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<OrderHistoryItem, "id">),
        }));

        if (orderOwnerId) {
          orders = orders.filter((order) => order.snackId === orderOwnerId);
        }

        orders.sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date));
        setHistory(orders.slice(0, 5));
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    if (open) {
      fetchHistory();
    }
  }, [open, orderOwnerId]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-3 rounded-full border border-orange-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-[0_16px_35px_rgba(15,23,42,0.12)] backdrop-blur transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50"
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </span>
        <span className="hidden sm:inline">Cart & orders</span>
      </button>

      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[200] transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
            aria-hidden={!open}
          >
            <div
              className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${
                open ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setOpen(false)}
            />

            <aside
              className={`absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-[0_24px_80px_rgba(15,23,42,0.24)] transition-transform duration-300 ${
                open ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="sticky top-0 z-10 border-b border-orange-100 bg-white/95 px-5 py-4 backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
                      Your cart
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Orders panel</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-slate-700 transition hover:bg-stone-200"
                    aria-label="Close cart"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-8 px-5 py-5">
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-950">Current selection</h3>
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                      {cartCount} items
                    </span>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-orange-200 bg-orange-50/50 p-5 text-sm leading-7 text-slate-600">
                      Your cart is empty. Add plats from the menu, then open this panel to review and confirm your order.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-[22px] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-950">{item.name}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-orange-500">
                                {item.size}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-slate-700">
                              <Price amount={item.lineTotal} from="MAD" />
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-slate-500">
                            {item.quantity} x <Price amount={item.price} from="MAD" />
                          </p>
                        </div>
                      ))}

                      <div className="rounded-[24px] bg-slate-950 p-5 text-white">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-white/70">Current total</p>
                          <p className="text-xl font-semibold">
                            <Price amount={cartTotal} from="MAD" />
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            onReview();
                          }}
                          className="mt-4 w-full rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                          {reviewLabel}
                        </button>
                      </div>
                    </div>
                  )}
                </section>

                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-950">Recent orders</h3>
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                      History
                    </span>
                  </div>

                  {loadingHistory ? (
                    <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-5 text-sm text-slate-500">
                      Loading your order history...
                    </div>
                  ) : history.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-stone-200 bg-stone-50 p-5 text-sm text-slate-500">
                      No previous orders found yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {history.map((order) => (
                        <div key={order.id} className="rounded-[22px] border border-stone-200 bg-white p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-950">
                                Order #{order.number || "--"}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {order.date?.toDate
                                  ? order.date.toDate().toLocaleString()
                                  : "Recently placed"}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                order.status === "Completed"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : order.status === "In Progress"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-orange-50 text-orange-600"
                              }`}
                            >
                              {order.status || "Pending"}
                            </span>
                          </div>
                          <p className="mt-3 text-sm font-medium text-slate-700">
                            Total: <Price amount={order.total || 0} from="MAD" />
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}
