import React, { FC, useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Spinner from "../../../components/spinner";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { h1 } from "framer-motion/client";

interface Plat {
  id: number;
  name: string;
  price: number;
  status: boolean;
  urlPhoto: string;
}

const Plats: FC = () => {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);

  // Fetch plats from Firebase
  useEffect(() => {
    const fetchPlats = async () => {
      try {
        const q = query(collection(db, "plat"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const platsData: Plat[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.id,
            name: data.name,
            price: data.price,
            status: data.status, // boolean
            urlPhoto: data.urlPhoto,
          };
        });
        setPlats(platsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plats: ", error);
      }
    };

    fetchPlats();
  }, []);

  // toggle single checkbox
  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // toggle all checkboxes
  const toggleAll = () => {
    if (selected.length === plats.length) {
      setSelected([]);
    } else {
      setSelected(plats.map((p) => p.id));
    }
  };

  return (
    <div className="bg-white h-screen">
      <Sidebar />
      <div className="sm:ml-64">
        <div className="p-4 dark:border-gray-700 mt-14">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {/* Top bar: Actions + Search */}
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 p-4">
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
                  <div className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Reward
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Promote
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Activate
                        </a>
                      </li>
                    </ul>
                    <div className="py-1">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Delete
                      </a>
                    </div>
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
                        checked={selected.length === plats.length}
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
                    Action
                  </th>
                </tr>
              </thead>
                {
                    loading?(
                          <tfoot>
                            <tr>
                              <td colSpan={100} className="text-center py-6">
                                <Spinner />
                              </td>
                            </tr>
                          </tfoot>
                    ):(
                        plats.map((plat) => (
                <tbody>
                  <tr
                    key={plat.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
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
                        <div className="text-base font-semibold">
                          {plat.name}
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4">${plat.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`h-2.5 w-2.5 rounded-full me-2 ${
                            plat.status ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        {plat.status ? "Available" : "Unavailable"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit plat
                      </a>
                    </td>
                  </tr>
                </tbody>
                ))
                    )
                }
             


             
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plats;
