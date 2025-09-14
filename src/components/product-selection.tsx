"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "./card";
import { useAuth } from "@/context/useContext";
import { Category } from "@/enums/category";
import { ProductService } from "@/services/product";
import { useTranslation } from "react-i18next";

const productService = new ProductService();

type ProductSelectionProps = {
  next: () => void;
  snackId: any;
};

export const ProductSelection = ({ next, snackId }: ProductSelectionProps) => {
  const { t } = useTranslation("common");
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(Category.pizza);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const { selectedProducts } = useAuth();

  const categories = useMemo(
    () => [
      { key: "pizza" as const, emoji: "🍕" },
      { key: "tacos" as const, emoji: "🌮" },
      { key: "burger" as const, emoji: "🍔" },
      { key: "drinks" as const, emoji: "🍹" },
      { key: "dessert" as const, emoji: "🍰" }
    ],
    []
  );

  const updateProductsDisplay = () => {
    const data = products.filter((p: any) => p?.category === selectedCategory);
    setFilteredProducts(data);
  };

  const fetchProducts = async () => {
    const response = await productService.getBySnackId(snackId);
    setProducts(response);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snackId]);

  useEffect(() => {
    updateProductsDisplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, loading, products]);

  return (
    <div>
      <div className="text-white p-6">
        <header className="text-center mb-10">
          <h1 className="text-5xl text-red-500 font-bold mb-2">
            {t("products.title")}
          </h1>
        </header>


        <div className="flex justify-center gap-3 mb-12">
          <ul className="flex sm:w-[100%] md:w-fit sm:overflow-auto -mb-px text-sm font-medium text-center text-gray-500 dark:text-black">
            {categories.map(({ key, emoji }) => {
              const label = t(`products.categories.${key}`);
              const value = Category[key]; 
              const isActive = selectedCategory === value;
              return (
                <li
                  key={key}
                  className="me-2 cursor-pointer border-b border-gray-700"
                  onClick={() => setSelectedCategory(value)}
                >
                  <p
                    className={
                      isActive
                        ? "inline-flex items-center justify-center p-4 text-amber-600 border-b-2 border-amber-600 rounded-t-lg active group"
                        : "inline-flex items-center justify-center p-4 rounded-t-lg active group"
                    }
                  >
                    {emoji} {label}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

   
      <div className="flex gap-4 justify-center items-center flex-wrap">
        {filteredProducts.map((product) => (
          <Card key={product.id} isOrderForm={true} product={product} />
        ))}
      </div>


      <button
        onClick={next}
        className="bg-red-500 text-white px-4 py-2 rounded block m-auto mt-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={selectedProducts.length === 0}
        aria-disabled={selectedProducts.length === 0}
        title={selectedProducts.length === 0 ? t("checkout.select_one_hint") : ""}
      >
        {t("checkout.validate_products")}
      </button>
    </div>
  );
};
