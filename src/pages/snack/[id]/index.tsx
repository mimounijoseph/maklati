"use client";

import Card from "@/components/card";
import CustomerCartDrawer from "@/components/customerCartDrawer";
import { Loader } from "@/components/ui/loader";
import { CategoryService } from "@/services/CategoryService";
import { ProductService } from "@/services/product";
import { SnackService } from "@/services/snack";
import Layout from "@/pages/core/layout";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  icon: string;
};

type SnackDetails = {
  id: string;
  name?: string;
  description?: string;
  image?: string;
  address?: string;
  ownerUID?: string;
};

const productService = new ProductService();
const snackService = new SnackService();
const categoryService = new CategoryService();

function Products() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { id } = router.query;

  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState<SnackDetails | null>(null);
  const [ownerUID, setOwnerUID] = useState<string | null>(null);

  async function fetchCategories() {
    const data = await categoryService.getAll();
    const formatted = data.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon || "🍽️",
    }));

    setCategories(formatted);
  }

  function updateProductsDisplay() {
    const data =
      selectedCategory === ""
        ? products
        : products.filter((p: any) => p?.category === selectedCategory);

    setFilteredProducts(data);
  }

  async function fetchProducts() {
    try {
      if (typeof id !== "string") {
        return;
      }

      const snackResponse = await snackService.getById(id);
      setSnack((snackResponse as SnackDetails) || null);
      setOwnerUID(snackResponse?.ownerUID || null);

      if (!snackResponse?.ownerUID) {
        setProducts([]);
        return;
      }

      const response = await productService.getBySnackId(snackResponse.ownerUID);
      setProducts(response || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    updateProductsDisplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, products]);

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[70vh] items-center justify-center bg-[radial-gradient(circle_at_top,#fff7ed_0%,#fff_45%,#f5f5f4_100%)]">
          <div className="rounded-[2rem] border border-orange-100 bg-white/80 px-8 py-7 shadow-[0_30px_80px_rgba(234,88,12,0.12)] backdrop-blur-xl">
            <Loader>
              <span className="font-['Sora',ui-sans-serif] text-slate-800">
                {t("products.loading")}
              </span>
            </Loader>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="min-h-screen bg-[radial-gradient(circle_at_top,#fff1e6_0%,#fff7ed_28%,#ffffff_62%,#f6f6f4_100%)] text-slate-900"
        style={{ fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif" }}
      >
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          <div className="sticky top-3 z-20 mb-6">
            <div className="overflow-visible rounded-[26px] border border-white/70 bg-white/75 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/snack")}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-orange-600 transition hover:scale-[1.03] hover:bg-orange-100"
                    aria-label="Go back"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-orange-500">
                      Digital Menu
                    </p>
                    <h1 className="text-lg font-semibold text-slate-950 sm:text-xl">
                      {snack?.name || t("products.title")}
                    </h1>
                  </div>
                </div>

                <CustomerCartDrawer
                  orderOwnerId={ownerUID}
                  onReview={() => router.push(`/client/order/${id}?step=2`)}
                  reviewLabel="Review and confirm"
                />
              </div>
            </div>
          </div>

          <section className="relative overflow-hidden rounded-[34px] border border-white/70 bg-slate-950 text-white shadow-[0_30px_90px_rgba(15,23,42,0.22)]">
            <div className="absolute inset-0">
              {snack?.image ? (
                <img
                  src={snack.image}
                  alt={snack?.name || "Snack cover"}
                  className="h-full w-full object-cover opacity-30"
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.94)_0%,rgba(120,53,15,0.78)_55%,rgba(234,88,12,0.6)_100%)]" />
            </div>

            <div className="relative grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
              <div className="max-w-2xl">
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-orange-100 backdrop-blur">
                    {snack?.address || "Freshly prepared"}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-orange-100 backdrop-blur">
                    {products.length} plats
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-orange-100 backdrop-blur">
                    {categories.length} categories
                  </span>
                </div>

                <h2
                  className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  {snack?.name || t("products.title")}
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-orange-50/90 sm:text-base">
                  {snack?.description || t("products.subtitle")}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-orange-200">
                    Browse
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">Choose any plat directly</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-orange-200">
                    Cart
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">Open the side cart anytime</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-orange-200">
                    History
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">Track recent orders and status</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-500">
                  Explore
                </p>
                <h3
                  className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  Browse the menu
                </h3>
              </div>

              <div className="hidden text-sm text-slate-500 sm:block">
                {filteredProducts.length} item{filteredProducts.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-orange-100/70 bg-white/85 p-3 shadow-[0_24px_70px_rgba(148,163,184,0.14)] backdrop-blur">
              <ul className="flex gap-3 overflow-x-auto no-scrollbar px-1 py-1">
                <li className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("")}
                    className={`inline-flex min-w-[110px] items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                      selectedCategory === ""
                        ? "bg-slate-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)]"
                        : "bg-stone-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    <span className="text-base">✦</span>
                    All
                  </button>
                </li>

                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  const displayName = cat.name.length > 12 ? `${cat.name.slice(0, 10)}...` : cat.name;

                  return (
                    <li key={cat.id} className="flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`inline-flex min-w-[130px] items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                          isActive
                            ? "bg-orange-500 text-white shadow-[0_12px_28px_rgba(249,115,22,0.28)]"
                            : "bg-stone-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      >
                        <span className="text-lg">{cat.icon || "🍽️"}</span>
                        <span>{displayName}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <section className="mt-8">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} isOrderForm={true} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border border-dashed border-orange-200 bg-white/80 px-6 py-16 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur">
                <p
                  className="text-3xl font-semibold tracking-[-0.03em] text-slate-900"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  {t("products.empty")}
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                  Pick another category or open the cart to review your selection.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default Products;
