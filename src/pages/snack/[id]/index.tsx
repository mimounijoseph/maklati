"use client";

import Card from "@/components/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import router, { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Layout from "@/pages/core/layout";
import { Loader } from "@/components/ui/loader";
import { ProductService } from "@/services/product";
import { Category } from "@/enums/category";
import { useTranslation } from "react-i18next";

const productService = new ProductService();

function Products() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { id } = router.query;

  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Pizza");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🏷️ خريطة الفئات + إيموجي + ترجمة
  const categories: Array<{ key: keyof typeof Category; emoji: string }> = useMemo(
    () => [
      { key: "pizza", emoji: "🍕" },
      { key: "tacos", emoji: "🌮" },
      { key: "burger", emoji: "🍔" },
      { key: "drinks", emoji: "🍹" },
      { key: "dessert", emoji: "🍰" }
    ],
    []
  );

  function updateProductsDisplay() {
// <<<<<<< HEAD
    const data = products.filter((p: any) => p?.category == selectedCategory);
    setFilteredProducts(data);
  }

  async function fetchProducts() {
    try {
      const response = await productService.getBySnackId(id);
// =======
//     let data = products?.filter((p: any) => p?.category == selectedCategory);
//     setFilteredProducts(data);
//   }

//   function fetchProducts() {
//     console.log(id);
    
//     let data = productService.getBySnackId(id).then((response: any) => {
// >>>>>>> f06d193130d2fa889d4319b682836ee5ee9ae30b
      setProducts(response!);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    updateProductsDisplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, loading, products]);

  if (loading) {
    return (
      <Layout>
        <div className="h-[60vh] flex justify-center items-center">
          <Loader>
            <span className="text-black dark:text-white">
              {t("products.loading")}
            </span>
          </Loader>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        style={{ fontFamily: "serif" }}
        className="min-h-screen w-screen p-6 m-auto text-slate-900 bg-gradient-to-b from-amber-400 to-yellow-300"
      >
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-black mb-1">
            {t("products.title")}
          </h1>
          <p className="text-slate-700">{t("products.subtitle")}</p>
        </header>

        {/* Tabs / Categories */}
        <div className="flex justify-center gap-3 mb-12">
          <ul className="flex sm:w-[100%] md:w-fit sm:overflow-auto -mb-px text-sm font-medium text-center text-gray-700 dark:text-black">
            {categories.map(({ key, emoji }) => {
              const keyStr = key as string;
              const label = t(`products.categories.${keyStr}`);
              const isActive = selectedCategory === Category[key];

              return (
                <li
                  key={keyStr}
                  className="me-2 cursor-pointer border-b border-gray-700"
                  onClick={() => setSelectedCategory(Category[key])}
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

{/* <<<<<<< HEAD */}
        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div className="flex gap-4 justify-center items-center flex-wrap">
            {filteredProducts.map((product) => (
              <Card key={product.id} isOrderForm={false} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-800 my-16">
            {t("products.empty")}
          </div>
        )}


        <AnimatedButton
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[200px]
                 bg-emerald-600 text-white hover:bg-emerald-700
                 shadow-[0_0_0_2px_rgba(16,185,129,0.35),0_10px_40px_rgba(16,185,129,0.45)]"
          variant="default"
          size="default"
          glow={false}
          textEffect="normal"
          uppercase={true}
          rounded="custom"
          shimmerColor="#34d399"
          shimmerSize="0.12em"
          shimmerDuration="2.6s"
          borderRadius="100px"
          background="rgba(16, 185, 129, 1)"
          onClick={() => router.push(`/client/order/${id}`)}
        >
          {t("products.order_now")}
        </AnimatedButton>
      </div>
    </Layout>
  );
}

export default Products;
