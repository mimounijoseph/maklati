import { useEffect, useState } from "react";
import Card from "./card";
import { useAuth } from "@/context/useContext";
// import { Category } from "@/enums/category";
import { ProductService } from "@/services/product";
import { CategoryService } from "@/services/CategoryService";

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

type Category  = {
  id:string,
  name:string,
  icon:string
}

const productService = new ProductService();

type ProductSelectionProps = {
  next: () => void;
  snackId: any;
};
export const ProductSelection = ({ next, snackId }: ProductSelectionProps) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Pizza");
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const { selectedProducts } = useAuth();
  const categoryService = new CategoryService();

  function updateProductsDisplay() {
    let data = products.filter((p: any) => p?.category == selectedCategory);
    setFilteredProducts(data);
  }

  function fetchProducts() {
    let data = productService.getBySnackId(snackId).then((response: any) => {
      setProducts(response);
      // updateProductsDisplay();
      setLoading(false);
    });
  }


  async function fetchCategories() {
      const data = await categoryService.getAll();
      setCategories(data);  
    }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    updateProductsDisplay();
  }, [selectedCategory, loading]);

  useEffect(() => {}, [filteredProducts]);

  return (
  <div>
      <div className="text-white p-2">
        <header className="text-center mb-10">
          <h1
            className="text-5xl text-red-500
               font-bold mb-2 hidden"
          >
            Menu
          </h1>
        </header>

     {/* Categories Section */}
    <h2 className="text-gray-800" style={{ fontFamily: "Inter, sans-serif" }}>Menu categories</h2>
<div className="flex justify-center gap-3 mb-4 border-y-2 border-gray-100 py-4 ">
  <div className="flex justify-center w-full max-w-[450px] sm:max-w-full px-4  ">
    <ul className="flex overflow-x-auto no-scrollbar text-xs font-medium text-gray-600 dark:text-black space-x-4  ">
      {categories.map((cat) => {
        // truncate long category names
        const displayName =
          cat.name.length > 10 ? cat.name.slice(0, 8) + "..." : cat.name;

        return (
          <li
            key={cat.id}
            className="flex-shrink-0 w-[70px] flex flex-col items-center cursor-pointer"
            onClick={() => setSelectedCategory(cat.id)}
          >
            {/* Circle with Icon */}
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full shadow-md transition-all duration-200 ${
                selectedCategory === cat.id
                  ? ""
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="text-2xl">{cat.icon || "🍽️"}</span>
            </div>

            {/* Category Name */}
            <p
              className={`mt-2 text-center text-xs  ${
                selectedCategory === cat.id ? "text-amber-600" : "text-gray-600"
              }`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {displayName}
            </p>
          </li>
        );
      })}
    </ul>
  </div>
</div>


    {/* the section below is displaying the selected category plats */}
      </div>
      <div className="flex gap-2 justify-center items-start flex-wrap h-screen ">
        {filteredProducts.map((product, index) => (
          <Card key={product.id} isOrderForm={true} product={product} />
        ))}
      </div>
      <button
        onClick={next}
        className="bg-red-500 text-white px-4 py-2 rounded block m-auto mt-10 cursor-pointer"
        disabled={selectedProducts.length == 0}
      >
        Valider les produits
      </button>
    </div>
  );
};
