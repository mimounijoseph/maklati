"use client";

import { useEffect, useState } from "react";
import Card from "./card";
import { ProductService } from "@/services/product";
import { CategoryService } from "@/services/CategoryService";
import { useTranslation } from "react-i18next";
import CustomerCartDrawer from "./customerCartDrawer";

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  image?: string;
  cost: {
    type: string;
    price: number;
    quantity: number;
  }[];
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

const productService = new ProductService();

type ProductSelectionProps = {
  next: () => void;
  snackId: any;
};

export const ProductSelection = ({ next, snackId }: ProductSelectionProps) => {
  const { t } = useTranslation("common");
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const categoryService = new CategoryService();

  const updateProductsDisplay = () => {
    const data =
      selectedCategory === ""
        ? products
        : products.filter((p: any) => p?.category === selectedCategory);
    setFilteredProducts(data);
  };

  const fetchProducts = async () => {
    if (!snackId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const response = await productService.getBySnackId(snackId);
    setProducts(response || []);
    setLoading(false);
  };

  async function fetchCategories() {
    const data = await categoryService.getAll();
    const formatted = data.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon || "🍽️",
    }));

    setCategories(formatted);
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [snackId]);

  useEffect(() => {
    updateProductsDisplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, products]);

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-500">
              Menu
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              Order from the menu
            </h1>
          </div>

          <CustomerCartDrawer
            orderOwnerId={snackId}
            onReview={next}
            reviewLabel="Review and confirm"
          />
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
              const displayName =
                cat.name.length > 12 ? `${cat.name.slice(0, 10)}...` : cat.name;
              const active = selectedCategory === cat.id;

              return (
                <li key={cat.id} className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex min-w-[130px] items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                      active
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

        <div className="mt-8">
          {loading ? (
            <div className="rounded-[28px] border border-dashed border-orange-200 bg-white/75 px-6 py-14 text-center text-sm text-slate-500">
              {t("products.loading")}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} isOrderForm={true} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-orange-200 bg-white/75 px-6 py-14 text-center text-sm text-slate-500">
              {t("products.empty")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
