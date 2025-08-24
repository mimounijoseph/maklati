import { useState } from "react";
import Card from "./card";
import { preloadModule } from "react-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  Briefcase,
  Pizza,
  Book,
  Sandwich,
  Salad,
  CupSoda,
} from "lucide-react";
export type Product = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};
type ProductSelectionProps = {
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
  next: () => void;
};

export const ProductSelection = ({
  selectedProducts,
  setSelectedProducts,
  next,
}: ProductSelectionProps) => {
  // const products = [
  //   { id: 1, name: "Produit A",quantity:0,price:10 },
  //   { id: 2, name: "Produit B",quantity:0,price:15 },
  //   { id: 3, name: "Produit C",quantity:0,price:20 },
  // ];
  const [products, setProducts] = useState([
    { id: 1, name: "Produit A", quantity: 0, price: 10 },
    { id: 2, name: "Produit B", quantity: 0, price: 15 },
    { id: 3, name: "Produit C", quantity: 0, price: 20 },
  ]);
  // var selectedCategory:"drink"|"pizza"|"dessert"|"tacos" = "tacos"
  const [selectedCategory, setSelectedCategory] = useState("tacos");
    const [activeTab, setActiveTab] = useState("all");
 const categories = [
    {
      id: "Sandwiches & Paninis",
      label: "Sandwiches & Paninis",
      icon: Sandwich,
    },
    { id: "Soda", label: "Soda", icon: CupSoda },
    { id: "Pizza", label: "Pizza", icon: Pizza },
    { id: "Salads", label: "Salads", icon: Salad },
  ];
  const updateQuantity = (
    product: { id: number; name: string; quantity: number; price: number },
    operation: "+" | "-"
  ) => {
    if (operation == "+") {
      setProducts([
        ...products.map((p) => {
          if (product.id == p.id) {
            p.quantity++;
          }
          return p;
        }),
      ]);
    }
  };

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

         <div className="w-full flex justify-center">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        
        <div className="inline-flex items-center rounded-2xl p-1.5
                        bg-slate-900/90 ring-1 ring-slate-800
                        shadow-[inset_0_-2px_0_rgba(255,255,255,0.06),0_8px_20px_rgba(17,24,39,0.35)]">
          <TabsList className="bg-transparent p-0 gap-1 flex">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="group relative flex items-center gap-2 rounded-xl
                             px-4 py-2 text-sm font-medium transition-all
                             data-[state=active]:bg-white data-[state=active]:text-slate-900
                             data-[state=inactive]:text-slate-200 hover:data-[state=inactive]:bg-slate-800/60
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
                >
                  <Icon size={18} className="opacity-80 group-data-[state=active]:opacity-100" />
                  <span className="tracking-wide">{cat.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
      </Tabs>
    </div>

        <div className="flex mt-9 gap-4 justify-center items-center flex-wrap">
          {products.map((product, index) => (
            <Card
              setSelectedProducts={setSelectedProducts}
              isOrderForm={true}
              product={product}
            />
          ))}
        </div>
        <button
          onClick={next}
          // disabled={selectedProducts.length === 0}
          className="bg-red-500 text-white px-4 py-2 rounded block m-auto mt-10 cursor-pointer"
        >
          Valider les produits
        </button>
      </div>
    </div>
  );
};
