import React, { FC, useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import Spinner from "./spinner";

interface PlatModalProps {
  docId: string | null;
  onClose: () => void;
  onDeleted: (docId: string) => void;
}

interface Plat {
  id: number;
  name: string;
  price: number;
  cost: { price: number; size: string; quantity: number }[];
  status: boolean;
  urlPhoto: string;
  category?: string;
  description?: string;
}

const PlatModal: FC<PlatModalProps> = ({ docId, onClose, onDeleted }) => {
  const [plat, setPlat] = useState<Plat | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!docId) return;
    const fetchPlat = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "plat", docId));
        if (snap.exists()) {
          setPlat(snap.data() as Plat);
        }
      } catch (err) {
        console.error("Error fetching plat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlat();
  }, [docId]);

  const handleDelete = async () => {
    if (!docId) return;
    if (!confirm("Are you sure you want to delete this plat?")) return;

    try {
      await deleteDoc(doc(db, "plat", docId));
      onDeleted(docId);
      onClose();
    } catch (err) {
      console.error("Error deleting plat:", err);
    }
  };

  if (!docId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {plat?.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Body with scroll */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          ) : (
            plat && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Image */}
                <div className="flex justify-center">
                  <img
                    src={plat.urlPhoto}
                    alt={plat.name}
                    className="w-64 h-64 object-cover rounded-xl shadow-md"
                  />
                </div>

                {/* Details */}
                <div>
                  {/* Show first cost as "starts from ..." */}
                  {plat.cost && plat.cost.length > 0 && (
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      Starts from ${plat.cost[0].price}
                      {plat.cost[0].size ? ` (${plat.cost[0].size})` : ""}
                    </p>
                  )}

                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {plat.description ?? "No description provided."}
                  </p>

                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Category
                      </dt>
                      <dd className="text-base font-semibold text-gray-900 dark:text-white">
                        {plat.category ?? "Uncategorized"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </dt>
                      <dd>
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${
                            plat.status
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {plat.status ? "Available" : "Unavailable"}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Cost Breakdown
                      </dt>
                      <dd className="text-sm text-gray-700 dark:text-gray-300">
                        {plat.cost && plat.cost.length > 0 ? (
                          <ul className="space-y-2 mt-2">
                            {plat.cost.map((c, idx) => (
                              <li
                                key={idx}
                                className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm"
                              >
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {c.size}
                                </span>
                                <span className="text-gray-700 dark:text-gray-300">
                                  ${c.price}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "No cost details"
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center border-t p-6">
          <div className="flex gap-3">
            <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition">
              Edit
            </button>
            <button className="px-5 py-2.5 text-sm font-medium border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Preview
            </button>
          </div>
          <button
            onClick={handleDelete}
            className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlatModal;
