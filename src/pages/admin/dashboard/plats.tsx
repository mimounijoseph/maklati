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
import PlatModal from "../../../components/PlatModalProps ";
import { Eye } from "lucide-react";

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
  docId?: string; // Firestore document ID
}

const Plats: FC = () => {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]); // store docIds
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 search state

  // 🔽 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPlats = async () => {
      try {
        const q = query(collection(db, "plat"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const platsData: Plat[] = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          return {
            id: data.id,
            name: data.name,
            price: data.price,
            cost: data.cost,
            status: data.status,
            urlPhoto: data.urlPhoto,
            docId: docSnap.id,
          };
        });
        setPlats(platsData);
      } catch (error) {
        console.error("Error fetching plats: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlats();
  }, []);

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

    if (!window.confirm("Are you sure you want to delete the selected plats?")) {
      return;
    }

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

  // 🔍 Filter plats by search term
  const filteredPlats = plats.filter((plat) =>
    plat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔽 Pagination slice
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlats = filteredPlats.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPlats.length / itemsPerPage);

  return (
    <div className="admin" style={{ fontFamily: "sans-serif" }}>
      <Sidebar />
      <div className="bg-gray-50 sm:ml-64">
        <div className="min-h-screen p-8 dark:border-gray-700 mt-14">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Plats</h1>
            <p className="text-gray-500 text-sm">Manage your plats below.</p>
          </div>
          <div className="bg-white overflow-x-auto rounded-2xl shadow-lg border border-gray-100 p-4 space-y-8 mx-auto relative mt-10">
            {/* Top bar */}
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 p-4">
              {/* Actions */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 cursor-pointer"
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
                          onClick={() => setAvailabilityForSelected(true)}
                          disabled={selected.length === 0}
                          className={`w-full text-sm text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
                            selected.length === 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Set Available
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setAvailabilityForSelected(false)}
                          disabled={selected.length === 0}
                          className={`w-full text-sm text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
                            selected.length === 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Set Unavailable
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={deleteSelectedPlats}
                          disabled={selected.length === 0}
                          className={`w-full text-sm text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-600 dark:hover:text-red-400 ${
                            selected.length === 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
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
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search-users"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // reset to first page when searching
                  }}
                  className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search for plats"
                />
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          selected.length === plats.length && plats.length > 0
                        }
                        onChange={toggleAll}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                      />
                    </div>
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
                currentPlats.map((plat) => (
                  <tbody key={plat.docId}>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selected.includes(plat.docId!)}
                            onChange={() => toggleSelect(plat.docId!)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                          />
                        </div>
                      </td>
                      <th
                        scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <img
                          className="w-10 h-10 rounded-full object-cover"
                          src={plat.urlPhoto}
                          alt={plat.name}
                        />
                        <div className="ps-3">
                          <div className="text-base font-semibold text-center">
                            {plat.name}
                          </div>
                        </div>
                      </th>
                      <td className="px-6 py-4"><p className=" w-12 border border-gray-200 rounded-md py-1 text-center text-gray-800 ">${plat.cost[0].price}</p></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`h-2.5 w-2.5 rounded-full me-2 text-center ${
                              plat.status ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {plat.status ? "Available" : "Unavailable"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
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
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "border-2 border-orange-500 text-gray-900"
                      : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
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
          onDeleted={(deletedId) => {
            setPlats((prev) => prev.filter((p) => p.docId !== deletedId));
          }}
        />
      )}
    </div>
  );
};

export default Plats;
