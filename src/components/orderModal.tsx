import React, { FC, useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
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
  status: boolean;
  createdAt: any; // Firestore timestamp
  snackId: string;
}

interface Order {
  date: any; // Firestore timestamp
  number: number;
  products: Product[];
  total: number;
  userUID: string;
  snackId: string;
}

const OrderModal: FC<OrderModalProps> = ({ docId, onClose, onDeleted }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!docId) return;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "orders", docId));
        if (snap.exists()) {
          setOrder(snap.data() as Order);
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
      await deleteDoc(doc(db, "orders", docId));
      onDeleted(docId);
      onClose();
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  if (!docId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order #{order?.number}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-900 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          ) : (
            order && (
              <div className="space-y-6">
                {/* Order info */}
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Date:</span>{" "}
                    {order.date?.toDate
                      ? order.date.toDate().toLocaleString()
                      : "Unknown"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">User UID:</span>{" "}
                    {order.userUID}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Vendor:</span>{" "}
                    {order.snackId}
                  </p>
                  <p className="text-xl font-bold mt-2 text-gray-950">
                    Total:  {order.total} MAD
                  </p>
                </div>

                {/* Products list */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Products
                  </h3>
                  <ul className="space-y-4">
                    {order.products.map((product, idx) => (
                      <li
                        key={idx}
                        className="flex gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm"
                      >
                        <img
                          src={product.urlPhoto}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {product.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Category: {product.category}
                          </p>

                          {/* Cost breakdown */}
                          {product.cost && product.cost.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {product.cost.map((c, i) => (
                                <li
                                  key={i}
                                  className="flex justify-between text-sm text-gray-950 bg-white/50 dark:bg-gray-700/50 px-3 py-1 rounded"
                                >
                                  <span>
                                    {c.size} × {c.quantity}
                                  </span>
                                  <span>{c.price} MAD</span>
                                </li>
                              ))}
                            </ul>
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

        {/* Footer */}
        <div className="flex justify-between items-center border-t p-6">
          <button
            onClick={handleDelete}
            className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow transition"
          >
            Delete Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
