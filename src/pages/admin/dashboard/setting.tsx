"use client";

import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { db } from "@/config/firebase";
import ProtectedLayout from "@/guard/adminProtectedPage";
import Sidebar from "./sidebar";
import { useAuth } from "@/context/useContext";

const defaultCategories = [
  { name: "Salads & Soups", icon: "🥗" },
  { name: "Traditional Dishes", icon: "🍗" },
  { name: "Sandwiches & Burgers", icon: "🍔" },
  { name: "Pizzas & Pastas", icon: "🍕" },
  { name: "Fish & Seafood", icon: "🐟" },
  { name: "Side Dishes", icon: "🍟" },
  { name: "Desserts", icon: "🍰" },
  { name: "Hot Drinks", icon: "☕" },
  { name: "Cold Drinks", icon: "🥤" },
];

type Category = {
  id: string;
  name: string;
  icon?: string;
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const snap = await getDocs(collection(db, "categories"));
    const next = snap.docs.map((item) => ({
      id: item.id,
      ...(item.data() as Omit<Category, "id">),
    }));
    setCategories(next.sort((a, b) => a.name.localeCompare(b.name)));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const seedDefaults = async () => {
    try {
      setLoading(true);
      const existingNames = new Set(categories.map((item) => item.name.toLowerCase()));

      for (const category of defaultCategories) {
        if (!existingNames.has(category.name.toLowerCase())) {
          await addDoc(collection(db, "categories"), category);
        }
      }

      await fetchCategories();
      setStatus("Default categories synced successfully.");
    } catch (error) {
      console.error("Error seeding categories:", error);
      setStatus("Failed to sync default categories.");
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      await addDoc(collection(db, "categories"), {
        name: name.trim(),
        icon: icon.trim() || "🍽️",
      });
      setName("");
      setIcon("");
      await fetchCategories();
      setStatus("Category added successfully.");
    } catch (error) {
      console.error("Error adding category:", error);
      setStatus("Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (categoryId: string) => {
    const linkedPlats = await getDocs(query(collection(db, "plat"), where("category", "==", categoryId)));
    if (!linkedPlats.empty) {
      setStatus("This category is already used by existing plats.");
      return;
    }

    try {
      await deleteDoc(doc(db, "categories", categoryId));
      await fetchCategories();
      setStatus("Category removed.");
    } catch (error) {
      console.error("Error deleting category:", error);
      setStatus("Failed to remove category.");
    }
  };

  const summary = useMemo(
    () => ({
      totalCategories: categories.length,
      defaultCategories: defaultCategories.length,
      restaurantReady: !!user?.uid,
    }),
    [categories.length, user?.uid]
  );

  return (
    <ProtectedLayout>
      <div className="admin min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.12),transparent_30%),linear-gradient(180deg,#fff7ed_0%,#f8fafc_35%,#ffffff_100%)]">
        <Sidebar />
        <div className="p-5 sm:ml-64 sm:p-8">
          <div className="mt-14">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-500">
                  Settings
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                  Menu and admin configuration
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Keep categories organized and manage the menu structure used by your products.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-3xl border border-white/70 bg-white/85 px-4 py-4 shadow-sm"><p className="text-xs uppercase tracking-[0.22em] text-slate-400">Categories</p><p className="mt-2 text-2xl font-semibold text-slate-950">{summary.totalCategories}</p></div>
                <div className="rounded-3xl border border-white/70 bg-white/85 px-4 py-4 shadow-sm"><p className="text-xs uppercase tracking-[0.22em] text-slate-400">Defaults</p><p className="mt-2 text-2xl font-semibold text-slate-950">{summary.defaultCategories}</p></div>
                <div className="rounded-3xl border border-white/70 bg-white/85 px-4 py-4 shadow-sm"><p className="text-xs uppercase tracking-[0.22em] text-slate-400">Admin</p><p className="mt-2 text-2xl font-semibold text-slate-950">{summary.restaurantReady ? "Ready" : "Off"}</p></div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
                <h2 className="text-xl font-semibold text-slate-950">Category tools</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Sync the default menu structure or create categories specific to your snack.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button onClick={seedDefaults} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
                    <RefreshCw className="h-4 w-4" />
                    Sync default categories
                  </button>
                </div>

                <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-slate-950">Create a custom category</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-[1fr_120px]">
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" />
                    <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Icon" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-300" />
                  </div>
                  <button onClick={createCategory} disabled={loading || !name.trim()} className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
                    <Plus className="h-4 w-4" />
                    Add category
                  </button>
                </div>

                {status && <p className="mt-4 text-sm text-slate-600">{status}</p>}
              </section>

              <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
                <h2 className="text-xl font-semibold text-slate-950">Current categories</h2>
                <p className="mt-2 text-sm text-slate-500">
                  These categories are used by the add-product and edit-product flows.
                </p>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {categories.map((category) => (
                    <article key={category.id} className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon || "🍽️"}</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{category.name}</p>
                          <p className="text-xs text-slate-400">{category.id.slice(0, 8)}</p>
                        </div>
                      </div>
                      <button onClick={() => removeCategory(category.id)} className="rounded-full border border-rose-200 p-2 text-rose-600 hover:bg-rose-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
