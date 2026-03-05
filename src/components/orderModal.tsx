import React, { FC, useEffect, useState } from "react";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { Clock3, Trash2, X } from "lucide-react";
import Spinner from "./spinner";

interface OrderModalProps {
  docId: string | null;
  onClose: () => void;
  onDeleted: (docId: string) => void;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  cost: { price: number; size: string; quantity: number }[];
  urlPhoto: string;
  snackId: string;
}

interface Order {
  date: any;
  number: number;
  products: Product[];
  total: number;
  userUID: string;
  snackId: string;
  status?: string;
}

const stepIndex = (status?: string) => {
  if (status === "Completed") return 3;
  if (status === "In Progress") return 2;
  return 1;
};

const OrderModal: FC<OrderModalProps> = ({ docId, onClose, onDeleted }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [customerName, setCustomerName] = useState("Unknown customer");
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) return;
    const fetchOrder = async () => {
      setLoading(true);
      setCustomerName("Unknown customer");
      try {
        const snap = await getDoc(doc(db, "orders", docId));
        if (snap.exists()) {
          const data = snap.data() as Order;
          if (data.snackId === auth.currentUser?.uid) {
            setOrder(data);

            if (data.userUID) {
              const userSnap = await getDoc(doc(db, "users", data.userUID));
              if (userSnap.exists()) {
                const userData = userSnap.data() as { displayName?: string; email?: string };
                setCustomerName(
                  userData.displayName || userData.email || data.userUID
                );
              } else {
                setCustomerName(data.userUID);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [docId]);

  const handleDelete = async () => {
    if (!docId) return;
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      if (order?.snackId !== auth.currentUser?.uid) return;
      await deleteDoc(doc(db, "orders", docId));
      onDeleted(docId);
      onClose();
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!docId || !order || updatingStatus === status) return;

    try {
      setUpdatingStatus(status);
      await updateDoc(doc(db, "orders", docId), { status });
      setOrder((prev) => (prev ? { ...prev, status } : prev));
    } catch (err) {
      console.error("Error updating order status:", err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (!docId) return null;

  const currentStep = stepIndex(order?.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
              Order details
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Order #{order?.number}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner />
            </div>
          ) : (
            order && (
              <div className="space-y-8">
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 className="h-4 w-4" />
                      <span>
                        {order.date?.toDate ? order.date.toDate().toLocaleString() : "Unknown"}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-900">Customer:</span>{" "}
                        {customerName}
                      </p>
                    </div>
                    <p className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                      {order.total} MAD
                    </p>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                      Progress
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      {["Pending", "In Progress", "Completed"].map((label, index) => (
                        <React.Fragment key={label}>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(label)}
                            disabled={updatingStatus !== null}
                            className="flex items-center gap-2 disabled:cursor-not-allowed"
                          >
                            <span
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all duration-500 ${
                                currentStep >= index + 1
                                  ? label === "Completed"
                                    ? "bg-emerald-500 text-white"
                                    : label === "In Progress"
                                    ? "bg-orange-500 text-white"
                                    : "bg-amber-500 text-white"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <span
                              className={`text-xs font-medium transition-colors duration-300 ${
                                currentStep >= index + 1 ? "text-slate-900" : "text-slate-400"
                              }`}
                            >
                              {label}
                            </span>
                          </button>
                          {index < 2 && (
                            <div className="h-[2px] flex-1 rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full bg-slate-900 transition-all duration-500 ${
                                  currentStep > index + 1 ? "w-full" : "w-0"
                                }`}
                              />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-slate-950">Products</h3>
                  <ul className="space-y-4">
                    {order.products.map((product, idx) => (
                      <li
                        key={idx}
                        className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
                      >
                        <img
                          src={product.urlPhoto}
                          alt={product.name}
                          className="h-24 w-full rounded-2xl object-cover sm:w-24"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-slate-950">{product.name}</h4>
                          <p className="mt-1 text-sm text-slate-500">{product.description}</p>
                          <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                            {product.category}
                          </p>

                          {product.cost?.length > 0 && (
                            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                              {product.cost.map((c, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                                >
                                  <span>
                                    {c.size} x {c.quantity}
                                  </span>
                                  <span className="font-semibold">{c.price} MAD</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-5">
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
