import React, { FC, useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, query, where, writeBatch } from "firebase/firestore";
import { Eye, Search } from "lucide-react";
import Sidebar from "./sidebar";
import Spinner from "../../../components/spinner";
import { db } from "../../../config/firebase";
import PlatModal from "../../../components/PlatModalProps";
import ProtectedLayout from "@/guard/adminProtectedPage";
import { useAuth } from "@/context/useContext";
import { deleteImageFileByUrl } from "@/utils/uploadImage";

interface Plat {
  id: number;
  name: string;
  price: number;
  cost: { price: number; size: string; quantity: number }[] | [];
  status: boolean;
  urlPhoto: string;
  createdAt?: any;
  docId?: string;
}

const itemsPerPage = 6;

const toTimestamp = (value: any) => {
  if (value?.toDate) return value.toDate().getTime();
  if (value?.seconds) return value.seconds * 1000;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const Plats: FC = () => {
  const { user } = useAuth();
  const [plats, setPlats] = useState<Plat[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Available" | "Unavailable">("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!user?.uid) {
      setPlats([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const platsQuery = query(collection(db, "plat"), where("snackId", "==", user.uid));
    const unsubscribe = onSnapshot(
      platsQuery,
      (snapshot) => {
        const platsData: Plat[] = snapshot.docs
          .map((docSnap) => ({ ...(docSnap.data() as any), docId: docSnap.id }))
          .sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt));

        setPlats(platsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching plats:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const filteredPlats = useMemo(
    () =>
      plats.filter((plat) => {
        const matchesSearch = plat.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Available" ? plat.status : !plat.status);
        return matchesSearch && matchesStatus;
      }),
    [plats, searchTerm, statusFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredPlats.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedPlats = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPlats.slice(start, start + itemsPerPage);
  }, [currentPage, filteredPlats]);

  const visiblePlatIds = paginatedPlats.map((p) => p.docId!).filter(Boolean);
  const allVisibleSelected =
    visiblePlatIds.length > 0 && visiblePlatIds.every((id) => selected.includes(id));

  const toggleSelect = (docId: string) => {
    setSelected((prev) => (prev.includes(docId) ? prev.filter((x) => x !== docId) : [...prev, docId]));
  };

  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelected((prev) => prev.filter((id) => !visiblePlatIds.includes(id)));
      return;
    }
    setSelected((prev) => Array.from(new Set([...prev, ...visiblePlatIds])));
  };

  const setAvailabilityForSelected = async (available: boolean) => {
    if (selected.length === 0) return;
    try {
      const batch = writeBatch(db);
      plats.forEach((p) => {
        if (selected.includes(p.docId!)) {
          batch.update(doc(db, "plat", p.docId!), { status: available });
        }
      });
      await batch.commit();
      setSelected([]);
      setDropdownOpen(false);
    } catch (e) {
      console.error("Failed to update availability:", e);
    }
  };

  const deleteSelectedPlats = async () => {
    if (selected.length === 0) return;
    if (!window.confirm("Are you sure you want to delete the selected plats?")) return;

    try {
      const selectedPlats = plats.filter((plat) => selected.includes(plat.docId!));
      const batch = writeBatch(db);
      selected.forEach((docId) => batch.delete(doc(db, "plat", docId)));
      await batch.commit();
      await Promise.allSettled(
        selectedPlats.map((plat) => deleteImageFileByUrl(plat.urlPhoto))
      );
      setSelected([]);
      setDropdownOpen(false);
    } catch (e) {
      console.error("Failed to delete plats:", e);
    }
  };

  return (
    <ProtectedLayout>
      <div className="admin">
        <Sidebar />
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.12),transparent_32%),linear-gradient(180deg,#fff7ed_0%,#f8fafc_32%,#ffffff_100%)] sm:ml-64">
          <div className="mt-14 p-5 sm:p-8">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-500">
                  Plats
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                  Manage your products
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Organize availability, review visuals, and keep your menu clean.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-3xl border border-white/70 bg-white/85 px-4 py-4 shadow-sm"><p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total</p><p className="mt-2 text-2xl font-semibold text-slate-950">{plats.length}</p></div>
                <div className="rounded-3xl border border-white/70 bg-white/85 px-4 py-4 shadow-sm"><p className="text-xs uppercase tracking-[0.22em] text-slate-400">Available</p><p className="mt-2 text-2xl font-semibold text-slate-950">{plats.filter((item) => item.status).length}</p></div>
                <div className="rounded-3xl border border-white/70 bg-white/85 px-4 py-4 shadow-sm"><p className="text-xs uppercase tracking-[0.22em] text-slate-400">Hidden</p><p className="mt-2 text-2xl font-semibold text-slate-950">{plats.filter((item) => !item.status).length}</p></div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder="Search products" className="w-full bg-transparent text-sm text-slate-700 outline-none" />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {["All", "Available", "Unavailable"].map((status) => (
                    <button key={status} onClick={() => { setStatusFilter(status as any); setCurrentPage(1); }} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${statusFilter === status ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-600"}`}>
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5 flex items-center justify-between">
                <div className="relative">
                  <button onClick={() => setDropdownOpen((prev) => !prev)} className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-orange-200 hover:text-orange-600">
                    Bulk actions
                  </button>
                  {dropdownOpen && (
                    <div className="absolute left-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                      <button onClick={() => setAvailabilityForSelected(true)} disabled={selected.length === 0} className="block w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40">Set available</button>
                      <button onClick={() => setAvailabilityForSelected(false)} disabled={selected.length === 0} className="block w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40">Set unavailable</button>
                      <button onClick={deleteSelectedPlats} disabled={selected.length === 0} className="block w-full px-4 py-3 text-left text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-40">Delete selected</button>
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-3 text-sm text-slate-500">
                  <input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300" />
                  Select all on page
                </label>
              </div>

              {loading ? (
                <div className="py-16"><Spinner /></div>
              ) : paginatedPlats.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-sm text-slate-500">
                  No plats found for this filter.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedPlats.map((plat) => (
                    <article key={plat.docId} className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <label className="inline-flex items-center gap-2 text-sm text-slate-500">
                          <input type="checkbox" checked={selected.includes(plat.docId!)} onChange={() => toggleSelect(plat.docId!)} className="h-4 w-4 rounded border-slate-300" />
                          Select
                        </label>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${plat.status ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {plat.status ? "Available" : "Unavailable"}
                        </span>
                      </div>

                      <img src={plat.urlPhoto} alt={plat.name} className="h-52 w-full rounded-[24px] object-cover" loading="lazy" />

                      <div className="mt-4">
                        <h2 className="text-lg font-semibold text-slate-950">{plat.name}</h2>
                        <p className="mt-2 text-sm text-slate-500">
                          {plat.cost.length} size option{plat.cost.length === 1 ? "" : "s"}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Starts from</p>
                          <p className="mt-1 text-lg font-semibold text-slate-950">
                            {plat.cost[0]?.price ?? plat.price} MAD
                          </p>
                        </div>
                        <button onClick={() => setActiveDocId(plat.docId!)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-orange-200 hover:text-orange-600">
                          <Eye className="h-4 w-4" />
                          Overview
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-2">
                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 disabled:opacity-40">
                  Previous
                </button>
                <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-slate-950 bg-slate-950 px-3 text-sm font-medium text-white">
                  {currentPage}
                </span>
                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 disabled:opacity-40">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {activeDocId && (
          <PlatModal
            docId={activeDocId}
            onClose={() => setActiveDocId(null)}
            onDeleted={(deletedId) => {
              setPlats((prev) => prev.filter((p) => p.docId !== deletedId));
              setSelected((prev) => prev.filter((id) => id !== deletedId));
            }}
          />
        )}
      </div>
    </ProtectedLayout>
  );
};

export default Plats;
