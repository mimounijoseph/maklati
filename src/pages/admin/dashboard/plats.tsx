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
import { Eye } from "lucide-react";

interface Plat {
  id: number;
  name: string;
  price: number;
  status: boolean;
  urlPhoto: string;
  docId?: string; // Firestore document ID
}

const Plats: FC = () => {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);

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

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === plats.length) {
      setSelected([]);
    } else {
      setSelected(plats.map((p) => p.id));
    }
  };

  // Set availability for all selected plats
  const setAvailabilityForSelected = async (available: boolean) => {
    if (selected.length === 0) return;

    // optimistic UI
    const selectedSet = new Set(selected);
    const prevPlats = plats;
    const nextPlats = plats.map((p) =>
      selectedSet.has(p.id) ? { ...p, status: available } : p
    );
    setPlats(nextPlats);

    try {
      const batch = writeBatch(db);
      plats.forEach((p) => {
        if (selectedSet.has(p.id) && p.docId) {
          batch.update(doc(db, "plat", p.docId), { status: available });
        }
      });
      await batch.commit();
      setSelected([]);
      setDropdownOpen(false);
    } catch (e) {
      console.error("Failed to update availability:", e);
      // rollback UI if DB update fails
      setPlats(prevPlats);
    }
  };

  return (
    <div className="admin min-h-full bg-gray-50 " style={{ fontFamily: "sans-serif" }}>
      <Sidebar />
      <div className="sm:ml-64">
        <div className="p-4 dark:border-gray-700 mt-14 ">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Add New Plat</h1>
            <p className="text-gray-500 text-sm">Fill in the details below to create a new plat.</p>
          </div>
          <div className="bg-white overflow-x-auto  sm:rounded-lg rounded-2xl shadow-lg border border-gray-100 p-8 space-y-8 max-w-4xl mx-auto relative">
            {/* Top bar */}
            <div className=" flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 p-4">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
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
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
                            selected.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          Set Available
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setAvailabilityForSelected(false)}
                          disabled={selected.length === 0}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
                            selected.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          Set Unavailable
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Search */}
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
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
                        checked={selected.length === plats.length && plats.length > 0}
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
                plats.map((plat) => (
                  <tbody key={plat.id}>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selected.includes(plat.id)}
                            onChange={() => toggleSelect(plat.id)}
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
                          <div className="text-base font-semibold">{plat.name}</div>
                        </div>
                      </th>
                      <td className="px-6 py-4">${plat.price}</td>
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
                        <button className="text-blue-600 dark:text-blue-500 hover:underline">
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                ))
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plats;
