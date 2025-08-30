import React, { FC, useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Spinner from "../../../components/spinner";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import OrderModal from "../../../components/orderModal";
import { Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  urlPhoto: string;
}

interface Order {
  number: number;
  products: Product[];
  total: number;
  date: any;
  userUID: string;
  docId?: string; // Firestore document ID
}

const Orders: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const ordersData: Order[] = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          return {
            number: data.number,
            products: data.products,
            total: data.total,
            date: data.date,
            userUID: data.userUID,
            docId: docSnap.id,
          };
        });
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleSelect = (docId: string) => {
    setSelected((prev) =>
      prev.includes(docId) ? prev.filter((x) => x !== docId) : [...prev, docId]
    );
  };

  const toggleAll = () => {
    if (selected.length === orders.length) {
      setSelected([]);
    } else {
      setSelected(orders.map((o) => o.docId!));
    }
  };

  // Delete selected orders
  const deleteSelectedOrders = async () => {
    if (selected.length === 0) return;

    if (!window.confirm("Are you sure you want to delete the selected orders?")) {
      return;
    }

    const selectedSet = new Set(selected);
    const prevOrders = orders;
    const nextOrders = orders.filter((o) => !selectedSet.has(o.docId!));
    setOrders(nextOrders);

    try {
      const batch = writeBatch(db);
      selected.forEach((docId) => {
        batch.delete(doc(db, "orders", docId));
      });
      await batch.commit();
      setSelected([]);
      setDropdownOpen(false);
    } catch (e) {
      console.error("Failed to delete orders:", e);
      setOrders(prevOrders); // rollback
    }
  };

  return (
    <div className="admin" style={{ fontFamily: "sans-serif" }}>
      <Sidebar />
      <div className="bg-gray-50 sm:ml-64">
        <div className="min-h-screen p-8 dark:border-gray-700 mt-14">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
            <p className="text-gray-500 text-sm">Manage your orders below.</p>
          </div>

          <div className="bg-white overflow-x-auto rounded-2xl shadow-lg border border-gray-100 p-4 space-y-8 mx-auto relative mt-10">
            {/* Top bar */}
            <div className="flex items-center justify-between flex-wrap space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 p-4">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="inline-flex items-center text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
                  type="button"
                >
                  Action
                  <svg
                    className="w-2.5 h-2.5 ms-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-56 dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                      <li>
                        <button
                          onClick={deleteSelectedOrders}
                          disabled={selected.length === 0}
                          className={`w-full text-sm text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-600 dark:hover:text-red-400 ${
                            selected.length === 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Delete Orders
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <input
                      type="checkbox"
                      checked={selected.length === orders.length && orders.length > 0}
                      onChange={toggleAll}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Order
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total ($)
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Overview
                  </th>
                </tr>
              </thead>

              {loading ? (
                <tfoot>
                  <tr>
                    <td colSpan={100} className="text-center py-6">
                      <Spinner />
                    </td>
                  </tr>
                </tfoot>
              ) : (
                orders.map((order) => {
                  const firstProduct = order.products[0];
                  const moreCount = order.products.length - 1;

                  return (
                    <tbody key={order.docId}>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="w-4 p-4">
                          <input
                            type="checkbox"
                            checked={selected.includes(order.docId!)}
                            onChange={() => toggleSelect(order.docId!)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                          />
                        </td>
                        <th
                          scope="row"
                          className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {firstProduct && (
                            <img
                              className="w-10 h-10 rounded-full object-cover"
                              src={firstProduct.urlPhoto}
                              alt={firstProduct.name}
                            />
                          )}
                          <div className="ps-3">
                            <div className="text-base font-semibold">
                              {firstProduct?.name}{" "}
                              <span className="text-gray-500 text-sm">
                                ({firstProduct?.category})
                              </span>
                            </div>
                            {moreCount > 0 && (
                              <div className="text-sm text-gray-500">
                                +{moreCount} more product
                                {moreCount > 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        </th>
                        <td className="px-6 py-4">${order.total}</td>
                        <td className="px-6 py-4">
                          {order.date?.toDate
                            ? order.date.toDate().toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="text-blue-600 dark:text-blue-500 hover:underline"
                            onClick={() => setActiveDocId(order.docId!)}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  );
                })
              )}
            </table>
          </div>
        </div>
      </div>

      {activeDocId && (
        <OrderModal
          docId={activeDocId}
          onClose={() => setActiveDocId(null)}
          onDeleted={(deletedId) => {
            setOrders((prev) => prev.filter((o) => o.docId !== deletedId));
          }}
        />
      )}
    </div>
  );
};

export default Orders;
