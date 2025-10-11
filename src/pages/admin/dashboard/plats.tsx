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
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import PlatModal from "../../../components/PlatModalProps ";
import { Eye } from "lucide-react";
import ProtectedLayout from "@/guard/protectedPage";

interface Plat {
  id: number;
  name: string;
  price: number;
  cost: {
    price: number;
    size: string;
    quantity: number;
  }[] | [];
  status: boolean;
  urlPhoto: string;
  docId?: string;
}

const itemsPerPage = 5;

const Plats: FC = () => {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // pagination state
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [pageHistory, setPageHistory] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]); // keep history of cursors
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPlats(); // initial load
  }, []);

  const fetchPlats = async (direction: "next" | "prev" | "first" = "first") => {
    try {
      setLoading(true);

      let q;
      if (direction === "first") {
        q = query(
          collection(db, "plat"),
          orderBy("createdAt", "desc"),
          limit(itemsPerPage)
        );
      } else if (direction === "next" && lastVisible) {
        q = query(
          collection(db, "plat"),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(itemsPerPage)
        );
      } else if (direction === "prev" && pageHistory.length > 1) {
        const prevCursor = pageHistory[pageHistory.length - 2];
        q = query(
          collection(db, "plat"),
          orderBy("createdAt", "desc"),
          startAfter(prevCursor),
          limit(itemsPerPage)
        );
        setPageHistory((h) => h.slice(0, -1)); // step back in history
        setCurrentPage((p) => Math.max(p - 1, 1));
      } else {
        return;
      }

      const snapshot = await getDocs(q);
      const docs = snapshot.docs;

      if (docs.length > 0) {
        const platsData: Plat[] = docs.map((docSnap) => {
          const data = docSnap.data() as any;
          return {
            id: data.id,
            name: data.name,
            price: data.price,
            cost: data.cost || [],
            status: data.status,
            urlPhoto: data.urlPhoto,
            docId: docSnap.id,
          };
        });

        setPlats(platsData);
        setLastVisible(docs[docs.length - 1]);

        if (direction === "next" || direction === "first") {
          setPageHistory((prev) => [...prev, docs[0]]);
          setCurrentPage((p) => (direction === "first" ? 1 : p + 1));
        }

        setHasMore(docs.length === itemsPerPage);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching plats:", err);
    } finally {
      setLoading(false);
    }
  };

  // selection toggle
  const toggleSelect = (docId: string) => {
    setSelected((prev) =>
      prev.includes(docId) ? prev.filter((x) => x !== docId) : [...prev, docId]
    );
  };

  const toggleAll = () => {
    if (selected.length === plats.length) {
      setSelected([]);
    } else {
      setSelected(plats.map((p) => p.docId!));
    }
  };

  // batch updates
  const setAvailabilityForSelected = async (available: boolean) => {
    if (selected.length === 0) return;
    const selectedSet = new Set(selected);
    const prevPlats = plats;
    const nextPlats = plats.map((p) =>
      selectedSet.has(p.docId!) ? { ...p, status: available } : p
    );
    setPlats(nextPlats);

    try {
      const batch = writeBatch(db);
      plats.forEach((p) => {
        if (selectedSet.has(p.docId!)) {
          batch.update(doc(db, "plat", p.docId!), { status: available });
        }
      });
      await batch.commit();
      setSelected([]);
      setDropdownOpen(false);
    } catch (e) {
      console.error("Failed to update availability:", e);
      setPlats(prevPlats);
    }
  };

  const deleteSelectedPlats = async () => {
    if (selected.length === 0) return;
    if (!window.confirm("Are you sure you want to delete the selected plats?"))
      return;

    const selectedSet = new Set(selected);
    const prevPlats = plats;
    const nextPlats = plats.filter((p) => !selectedSet.has(p.docId!));
    setPlats(nextPlats);

    try {
      const batch = writeBatch(db);
      selected.forEach((docId) => {
        batch.delete(doc(db, "plat", docId));
      });
      await batch.commit();
      setSelected([]);
      setDropdownOpen(false);
    } catch (e) {
      console.error("Failed to delete plats:", e);
      setPlats(prevPlats);
    }
  };

  // 🔍 filter plats client-side
  const filteredPlats = plats.filter((plat) =>
    plat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div className="admin" style={{ fontFamily: "sans-serif" }}>
      <Sidebar />
      <div className="bg-gray-50 sm:ml-64">
        <div className="min-h-screen p-8 dark:border-gray-700 mt-14">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Plats</h1>
            <p className="text-gray-500 text-sm">Manage your plats below.</p>
          </div>

          <div className="bg-white overflow-x-auto rounded-2xl shadow-lg border border-gray-100 p-4 space-y-8 mx-auto relative mt-10">
            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 bg-white dark:bg-gray-900 p-4">
              {/* Dropdown actions */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5"
                >
                  Action
                  <svg
                    className="w-2.5 h-2.5 ms-2.5"
                    aria-hidden="true"
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
                  <div className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-56">
                    <ul className="py-1 text-sm text-gray-700">
                      <li>
                        <button
                          onClick={() => setAvailabilityForSelected(true)}
                          disabled={selected.length === 0}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Set Available
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setAvailabilityForSelected(false)}
                          disabled={selected.length === 0}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Set Unavailable
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={deleteSelectedPlats}
                          disabled={selected.length === 0}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          Delete Plat
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  placeholder="Search for plats"
                  className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50"
                />
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="p-4">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === plats.length && plats.length > 0
                      }
                      onChange={toggleAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Plat
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price ($)
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
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
                filteredPlats.map((plat) => (
                  <tbody key={plat.docId}>
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td className="w-4 p-4">
                        <input
                          type="checkbox"
                          checked={selected.includes(plat.docId!)}
                          onChange={() => toggleSelect(plat.docId!)}
                        />
                      </td>
                      <td className="flex items-center px-6 py-4">
                        <img
                          className="w-10 h-10 rounded-full object-cover"
                          src={plat.urlPhoto}
                          alt={plat.name}
                          loading="lazy" // 👈 lazy load
                        />
                        <div className="ps-3">
                          <div className="text-base font-semibold">
                            {plat.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="w-12 border rounded-md py-1 text-center">
                          ${plat.cost[0]?.price ?? plat.price}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`h-2.5 w-2.5 rounded-full me-2 ${
                              plat.status ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {plat.status ? "Available" : "Unavailable"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => setActiveDocId(plat.docId!)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                ))
              )}
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => fetchPlats("prev")}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 border-3 border-orange-500 rounded  text-gray-900 ">
                {currentPage}
              </span>
              <button
                onClick={() => fetchPlats("next")}
                disabled={!hasMore}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
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
          onDeleted={(deletedId) =>
            setPlats((prev) => prev.filter((p) => p.docId !== deletedId))
          }
        />
      )}
    </div>
    
  );
};

export default Plats;
