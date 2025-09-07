import Card from "@/components/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/pages/core/layout";
import { Loader } from "@/components/ui/loader";
import { ProductService } from "@/services/product";
import { Category } from "@/enums/category";

const productService = new ProductService();

function Products() {
  const router = useRouter();
  const { id } = router.query;
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Pizza");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  function updateProductsDisplay() {
    let data = products?.filter((p: any) => p?.category == selectedCategory);
    setFilteredProducts(data);
  }

  function fetchProducts() {
    console.log(id);
    
    let data = productService.getBySnackId(id).then((response: any) => {
      setProducts(response);
      // updateProductsDisplay();
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    updateProductsDisplay();
  }, [selectedCategory,loading]);

  useEffect(() => {}, [filteredProducts]);

  if (loading) {
    return (
      <Layout>
        <div className="h-[60vh] flex justify-center items-center">
          <Loader>
            <span className="text-black dark:text-white">
              Getting things ready…
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
          <h1 className="text-5xl font-bold text-black mb-1">Menu</h1>
          <p className="text-slate-700">Choose your favorite category</p>
        </header>
        <div className="flex justify-center gap-3 mb-12">
          <div className="">
            <ul className="flex sm:w-[100%] md:w-fit sm:overflow-auto -mb-px text-sm font-medium text-center text-gray-500  dark:text-black">
              <li
                className="me-2 cursor-pointer border-b border-gray-700"
                onClick={() => setSelectedCategory(Category.pizza)}
              >
                <p
                  className={
                    selectedCategory == Category.pizza
                      ? "inline-flex items-center justify-center p-4 text-amber-600 border-b-2 border-amber-600 rounded-t-lg active  group"
                      : "inline-flex items-center justify-center p-4 rounded-t-lg active  group"
                  }
                >
                  {/* <svg
                    className={
                      selectedCategory == "pizza"
                        ? "w-4 h-4 me-2 text-amber-600 "
                        : "w-4 h-4 me-2 text-black"
                    }
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                  </svg> */}
                  🍕 {Category.pizza}
                </p>
              </li>
              <li
                className="me-2 cursor-pointer border-b border-gray-700"
                onClick={() => setSelectedCategory(Category.tacos)}
              >
                <p
                  className={
                    selectedCategory == Category.tacos
                      ? "inline-flex items-center justify-center p-4 text-amber-600 border-b-2 border-amber-600 rounded-t-lg active  group"
                      : "inline-flex items-center justify-center p-4 rounded-t-lg active  group"
                  }
                  aria-current="page"
                >
                  {/* <svg
                    className={
                      selectedCategory == "tacos"
                        ? "w-4 h-4 me-2 text-amber-600 "
                        : "w-4 h-4 me-2 text-black"
                    }
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 18"
                  >
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                  </svg> */}
                  🌮 {Category.tacos}
                </p>
              </li>
              <li
                className="me-2 cursor-pointer border-b border-gray-700"
                onClick={() => setSelectedCategory(Category.burger)}
              >
                <p
                  className={
                    selectedCategory == Category.burger
                      ? "inline-flex items-center justify-center p-4 text-amber-600 border-b-2 border-amber-600 rounded-t-lg active  group"
                      : "inline-flex items-center justify-center p-4 rounded-t-lg active  group"
                  }
                >
                  {/* <svg
                    className={
                      selectedCategory == "desserts"
                        ? "w-4 h-4 me-2 text-amber-600 "
                        : "w-4 h-4 me-2 text-black"
                    }
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                  </svg> */}
                  🍔 {Category.burger}
                </p>
              </li>
              <li
                className="me-2 cursor-pointer border-b border-gray-700"
                onClick={() => setSelectedCategory(Category.drinks)}
              >
                <p
                  className={
                    selectedCategory == Category.drinks
                      ? "inline-flex items-center justify-center p-4 text-amber-600 border-b-2 border-amber-600 rounded-t-lg active  group"
                      : "inline-flex items-center justify-center p-4 rounded-t-lg active  group"
                  }
                >
                  {/* <svg
                    className={
                      selectedCategory == "drinks"
                        ? "w-4 h-4 me-2 text-amber-600 "
                        : "w-4 h-4 me-2 text-black"
                    }
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z" />
                  </svg> */}
                  🍹 {Category.drinks}
                </p>
              </li>
              <li
                className="me-2 cursor-pointer border-b border-gray-700"
                onClick={() => setSelectedCategory(Category.dessert)}
              >
                <p
                  className={
                    selectedCategory == Category.dessert
                      ? "inline-flex items-center justify-center p-4 text-amber-600 border-b-2 border-amber-600 rounded-t-lg active  group"
                      : "inline-flex items-center justify-center p-4 rounded-t-lg active  group"
                  }
                >
                  {/* <svg
                    className={
                      selectedCategory == "desserts"
                        ? "w-4 h-4 me-2 text-amber-600 "
                        : "w-4 h-4 me-2 text-black"
                    }
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                  </svg> */}
                  🍰 {Category.dessert}
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4 justify-center items-center flex-wrap">
          {filteredProducts?.map((product, index) => (
            <Card key={product.id} isOrderForm={false} product={product} />
          ))}
        </div>

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
          Order now
        </AnimatedButton>
      </div>
    </Layout>
  );
}

export default Products;
