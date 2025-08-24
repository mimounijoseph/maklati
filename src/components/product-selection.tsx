import { useEffect, useState } from "react";
import Card from "./card";
import { useAuth } from "@/context/useContext";

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  cost: {
    type: string;
    price: number;
    quantity: number;
  }[];
};
type ProductSelectionProps = {
  next: () => void;
};
export const ProductSelection = ({ next }: ProductSelectionProps) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Produit A",
      description: "produit de bon quality",
      category: "tacos",
      cost: [
        { type: "M", price: 10, quantity: 0 },
        { type: "L", price: 15, quantity: 0 },
        { type: "XL", price: 20, quantity: 0 },
      ],
    },
    {
      id: 2,
      name: "Produit B",
      description: "produit de bon quality",
      category: "tacos",
      cost: [
        { type: "M", price: 10, quantity: 0 },
        { type: "L", price: 15, quantity: 0 },
        { type: "XL", price: 20, quantity: 0 },
      ],
    },
    {
      id: 3,
      name: "Produit C",
      description: "produit de bon quality",
      category: "tacos",
      cost: [
        { type: "M", price: 10, quantity: 0 },
        { type: "L", price: 15, quantity: 0 },
        { type: "XL", price: 20, quantity: 0 },
      ],
    },
    {
      id: 4,
      name: "Produit d",
      description: "produit de bon quality",
      category: "drinks",
      cost: [
        { type: "M", price: 10, quantity: 0 },
        { type: "L", price: 15, quantity: 0 },
        { type: "XL", price: 20, quantity: 0 },
      ],
    },
    {
      id: 5,
      name: "Produit e",
      description: "produit de bon quality",
      category: "pizza",
      cost: [
        { type: "M", price: 10, quantity: 0 },
        { type: "L", price: 15, quantity: 0 },
        { type: "XL", price: 20, quantity: 0 },
      ],
    },
    {
      id: 6,
      name: "Produit f",
      description: "produit de bon quality",
      category: "pizza",
      cost: [
        { type: "M", price: 10, quantity: 0 },
        { type: "L", price: 15, quantity: 0 },
        { type: "XL", price: 20, quantity: 0 },
      ],
    },
    {
      id: 7,
      name: "Produit g",
      description: "produit de bon quality",
      category: "desserts",
      cost: [
        { type: "M", price: 10, quantity: 0 },
        { type: "L", price: 15, quantity: 0 },
        { type: "XL", price: 20, quantity: 0 },
      ],
    },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("tacos");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
const {selectedProducts} = useAuth();
  function updateProductsDisplay() {
    let data = products.filter((p) => p.category == selectedCategory);
    setFilteredProducts(data);
  }

  useEffect(() => {
    updateProductsDisplay();
  }, [selectedCategory]);

  useEffect(() => {}, [filteredProducts]);

  return (
    <div>
      <div className="min-h-screen text-white p-6">
        <header className="text-center mb-10">
          <h1
            className="text-5xl text-red-500
               font-bold mb-2"
          >
            Menu
          </h1>
        </header>

        <div className="flex justify-center gap-3 mb-12">
          <div className="">
            <ul className="flex sm:w-[100%] md:w-fit sm:overflow-auto -mb-px text-sm font-medium text-center text-gray-500  dark:text-black">
              <li
                className="me-2 cursor-pointer border-b border-gray-700"
                onClick={() => setSelectedCategory("pizza")}
              >
                <p
                  className={
                    selectedCategory == "pizza"
                      ? "inline-flex items-center justify-center p-4 text-amber-600 border-b-2 border-amber-600 rounded-t-lg active  group"
                      : "inline-flex items-center justify-center p-4 rounded-t-lg active  group"
                  }
                >
                  <svg
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
                  </svg>
                  Pizza
                </p>
              </li>
              <li
                className="me-2 cursor-pointer border-b border-gray-700"
                onClick={() => setSelectedCategory("tacos")}
              >
                <p
                  className={
                    selectedCategory == "tacos"
                      ? "inline-flex items-center justify-center p-4 text-amber-600 border-b-2 border-amber-600 rounded-t-lg active  group"
                      : "inline-flex items-center justify-center p-4 rounded-t-lg active  group"
                  }
                  aria-current="page"
                >
                  <svg
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
                  </svg>
                  Tacos
                </p>
              </li>
              <li
                className="me-2 cursor-pointer border-b border-gray-700"
                onClick={() => setSelectedCategory("drinks")}
              >
                <p
                  className={
                    selectedCategory == "drinks"
                      ? "inline-flex items-center justify-center p-4 text-amber-600 border-b-2 border-amber-600 rounded-t-lg active  group"
                      : "inline-flex items-center justify-center p-4 rounded-t-lg active  group"
                  }
                >
                  <svg
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
                  </svg>
                  Drinks
                </p>
              </li>
              <li
                className="me-2 cursor-pointer border-b border-gray-700"
                onClick={() => setSelectedCategory("desserts")}
              >
                <p
                  className={
                    selectedCategory == "desserts"
                      ? "inline-flex items-center justify-center p-4 text-amber-600 border-b-2 border-amber-600 rounded-t-lg active  group"
                      : "inline-flex items-center justify-center p-4 rounded-t-lg active  group"
                  }
                >
                  <svg
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
                  </svg>
                  Desserts
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4 justify-center items-center flex-wrap">
          {filteredProducts.map((product, index) => (
            <Card key={product.id} isOrderForm={true} product={product} />
          ))}
        </div>
        <button
          onClick={next}
          className="bg-red-500 text-white px-4 py-2 rounded block m-auto mt-10 cursor-pointer"
          disabled={selectedProducts.length==0}
        >
          Valider les produits
        </button>
      </div>
    </div>
  );
};
