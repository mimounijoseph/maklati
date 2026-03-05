"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, query, where, writeBatch } from "firebase/firestore";
import { Eye, Package2, Receipt, Search } from "lucide-react";
import Sidebar from "./sidebar";
import Spinner from "../../../components/spinner";
import { db } from "../../../config/firebase";
import OrderModal from "../../../components/orderModal";
import ProtectedLayout from "@/guard/adminProtectedPage";
import { useAuth } from "@/context/useContext";

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
  status: string;
  docId?: string;
}

const statusOptions = ["All", "Pending", "In Progress", "Completed"];

const toTimestamp = (value: any) => {
  if (value?.toDate) return value.toDate().getTime();
  if (value?.seconds) return value.seconds * 1000;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const statusBadge = (status?: string) => {
  if (status === "Completed") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "In Progress") return "bg-orange-50 text-orange-700 ring-orange-200";
  return "bg-amber-50 text-amber-700 ring-amber-200";
};

const statusStep = (status?: string) => {
  if (status === "Completed") return 3;
  if (status === "In Progress") return 2;
  return 1;
};

const Orders: FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.uid) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ordersQuery = query(collection(db, "orders"), where("snackId", "==", user.uid));
    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const fetched: Order[] = snapshot.docs
          .map((docSnap) => ({ ...(docSnap.data() as any), docId: docSnap.id }))
          .sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date));

        setOrders(fetched);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const filteredOrders = useMemo(() => {
    const lowered = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" || (order.status || "Pending") === statusFilter;

      if (!matchesStatus) return false;
      if (!lowered) return true;

      const firstProduct = order.products?.[0];
      return (
        String(order.number).includes(lowered) ||
        order.userUID?.toLowerCase().includes(lowered) ||
        firstProduct?.name?.toLowerCase().includes(lowered)
      );
    });
  }, [orders, search, statusFilter]);

  const totalOrders = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalOrders / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [currentPage, filteredOrders, pageSize]);

  const visibleOrderIds = paginatedOrders.map((o) => o.docId!).filter(Boolean);
  const allVisibleSelected =
    visibleOrderIds.length > 0 && visibleOrderIds.every((id) => selected.includes(id));

  const toggleSelect = (docId: string) => {
    setSelected((prev) =>
      prev.includes(docId) ? prev.filter((x) => x !== docId) : [...prev, docId]
    );
  };

  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelected((prev) => prev.filter((id) => !visibleOrderIds.includes(id)));
      return;
    }
    setSelected((prev) => Array.from(new Set([...prev, ...visibleOrderIds])));
  };

  const deleteSelectedOrders = async () => {
    if (selected.length === 0) return;
    if (!window.confirm("Are you sure you want to delete the selected orders?")) return;

    try {
      const batch = writeBatch(db);
      selected.forEach((docId) => batch.delete(doc(db, "orders", docId)));
      await batch.commit();
      setSelected([]);
      setDropdownOpen(false);
    } catch (e) {
      console.error("Failed to delete orders:", e);
    }
  };

  const updateSelectedStatus = async (newStatus: string) => {
    if (selected.length === 0) return;

    try {
      const batch = writeBatch(db);
      selected.forEach((docId) => batch.update(doc(db, "orders", docId), { status: newStatus }));
      await batch.commit();
      setSelected([]);
      setDropdownOpen(false);
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  const startIndex = totalOrders === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = totalOrders === 0 ? 0 : Math.min(currentPage * pageSize, totalOrders);

  return (
    <ProtectedLayout>
      <div className="admin">
        <Sidebar />
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.12),transparent_30%),linear-gradient(180deg,#fff7ed_0%,#f8fafc_35%,#ffffff_100%)] sm:ml-64">
          <div className="mt-14 p-5 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-500">
                  Orders
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                  Manage incoming orders
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Track, filter, update, and review restaurant orders in real time.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/70 bg-white/85 px-4 py-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{orders.length}</p>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/85 px-4 py-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Open</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {orders.filter((order) => order.status !== "Completed").length}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/85 px-4 py-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Revenue</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {orders.reduce((sum, order) => sum + (order.total || 0), 0)} MAD
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by order number, customer UID, or plat"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setCurrentPage(1);
                        setSelected([]);
                      }}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        statusFilter === status
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-600"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
                  >
                    Bulk actions
                  </button>

                  {dropdownOpen && (
                    <div className="absolute left-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                      <button onClick={deleteSelectedOrders} disabled={selected.length === 0} className="block w-full px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40">Delete orders</button>
                      <button onClick={() => updateSelectedStatus("Pending")} disabled={selected.length === 0} className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Mark as Pending</button>
                      <button onClick={() => updateSelectedStatus("In Progress")} disabled={selected.length === 0} className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Mark as In Progress</button>
                      <button onClick={() => updateSelectedStatus("Completed")} disabled={selected.length === 0} className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Mark as Completed</button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-sm text-slate-500">
                    Showing <span className="font-semibold text-slate-900">{startIndex}</span>-
                    <span className="font-semibold text-slate-900">{endIndex}</span> of{" "}
                    <span className="font-semibold text-slate-900">{totalOrders}</span>
                  </p>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                      setSelected([]);
                    }}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                  >
                    <option value={10}>10 rows</option>
                    <option value={25}>25 rows</option>
                    <option value={50}>50 rows</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="py-16">
                  <Spinner />
                </div>
              ) : paginatedOrders.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-sm text-slate-500">
                  No orders found for this filter.
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedOrders.map((order) => {
                    const firstProduct = order.products?.[0];
                    const moreCount = (order.products?.length || 0) - 1;
                    const currentStep = statusStep(order.status);

                    return (
                      <article key={order.docId} className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                          <div className="flex items-start gap-4">
                            <input type="checkbox" checked={selected.includes(order.docId!)} onChange={() => toggleSelect(order.docId!)} className="mt-5 h-4 w-4 rounded border-slate-300" />
                            {firstProduct ? (
                              <img className="h-16 w-16 rounded-2xl object-cover" src={firstProduct.urlPhoto} alt={firstProduct.name} />
                            ) : (
                              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <Package2 className="h-5 w-5" />
                              </div>
                            )}

                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-lg font-semibold text-slate-950">Order #{order.number}</h2>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 transition-all duration-300 ${statusBadge(order.status)}`}>
                                  {order.status || "Pending"}
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-medium text-slate-700">
                                {firstProduct?.name || "No product"}{moreCount > 0 ? ` +${moreCount} more` : ""}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {order.date?.toDate ? order.date.toDate().toLocaleString() : "-"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-4 xl:min-w-[360px]">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2 text-slate-500">
                                <Receipt className="h-4 w-4" />
                                <span>{order.total} MAD</span>
                              </div>
                              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:text-orange-600" onClick={() => setActiveDocId(order.docId!)}>
                                <Eye className="h-4 w-4" />
                                Overview
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              {["Pending", "In Progress", "Completed"].map((stepLabel, index) => {
                                const active = currentStep >= index + 1;
                                return (
                                  <React.Fragment key={stepLabel}>
                                    <div className="flex items-center gap-2">
                                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-500 ${active ? stepLabel === "Completed" ? "bg-emerald-500 text-white" : stepLabel === "In Progress" ? "bg-orange-500 text-white" : "bg-amber-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                                        {index + 1}
                                      </span>
                                      <span className={`text-xs font-medium transition-colors duration-300 ${active ? "text-slate-900" : "text-slate-400"}`}>
                                        {stepLabel}
                                      </span>
                                    </div>
                                    {index < 2 && (
                                      <div className="h-[2px] flex-1 rounded-full bg-slate-100">
                                        <div className={`h-full rounded-full transition-all duration-500 ${currentStep > index + 1 ? "w-full bg-slate-900" : "w-0"}`} />
                                      </div>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              <nav className="mt-6 flex items-center justify-end gap-2" aria-label="Table navigation">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition disabled:opacity-40">Previous</button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`h-10 w-10 rounded-full border text-sm transition ${currentPage === i + 1 ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-600"}`}>
                    {i + 1}
                  </button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition disabled:opacity-40">Next</button>
              </nav>
            </div>
          </div>
        </div>

        {activeDocId && (
          <OrderModal
            docId={activeDocId}
            onClose={() => setActiveDocId(null)}
            onDeleted={(deletedId) => {
              setOrders((prev) => prev.filter((o) => o.docId !== deletedId));
              setSelected((prev) => prev.filter((id) => id !== deletedId));
            }}
          />
        )}
      </div>
    </ProtectedLayout>
  );
};

export default Orders;
