// Card.tsx
import React, { useEffect, useState } from "react";
import { SpotlightCard } from "@/components/ui/spotlightcard";
import { Product } from "./product-selection";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/useContext";


type CardTypes = {
  product?: Product;
  isOrderForm?: boolean;
};

function Card({ product, isOrderForm }: CardTypes) {
  const { selectedProducts, setSelectedProducts } = useAuth();
  const { toast } = useToast();
  const sizes: any = ["M", "L", "XL"];
  const [selectedSize, setSelectedSize] = useState(product?.cost[0].type);
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(product?.cost[0].price);
  const [totalProduct,setTotalProduct] = useState(0)
  function showToast(
    title: string,
    message: string,
    variant:
      | "success"
      | "default"
      | "destructive"
      | "warning"
      | "info"
      | undefined
  ) {
    toast({
      title: title,
      description: message,
      variant: variant,
      duration: 2500,
    });
  }

  useEffect(()=>{
     let prod = selectedProducts.find((p:any)=>p.id==product?.id)
     if(prod){
      setTotalProduct(prod?.cost.reduce((sum:any, item:any) => sum + item.quantity, 0))
     }
  },[])

  useEffect(() => {
  }, [selectedProducts]);

  function decrement(): void {
    if (qty > 0) setQty(qty - 1);
  }

  function increment(): void {
    setQty(qty + 1);
  }

  function toggleSize(s: any): void {
    setSelectedSize(s);
    let price = product?.cost.find((e: any) => e.type == s)?.price;
    setPrice(price);
  }

  function addToCart(): void {
    let selectedProduct = selectedProducts.find(
      (p: any) => p.id == product?.id
    );

    if (selectedProduct) {
      // If the product already exists, update the quantity of the selected type
      const updatedProducts = selectedProducts.map((p: any) => {
        if (p.id == product?.id) {
          const updatedCost = p.cost.map((e: any) => {
            if (e.type == selectedSize) {
              return { ...e, quantity: qty }; // Update the quantity
            }
            return e;
          });
          return { ...p, cost: updatedCost };
        }
        return p;
      });
      setSelectedProducts(updatedProducts);
    } else {
      // If the product does not exist, add it to the selected products array
      const newProduct = {
        ...product,
        cost: product?.cost.map((e: any) => {
          if (e.type == selectedSize) {
            return { ...e, quantity: qty }; // Initialize quantity for the selected type
          }
          return e;
        }),
      };
      setSelectedProducts([...selectedProducts, newProduct]);
    }
    setTotalProduct(totalProduct+qty)

    showToast(
      `${product?.name}`,
      `${qty} of type ${selectedSize} was added successfully to your order`,
      "success"
    );
  }

  return (
    <SpotlightCard
      className={`w-80 rounded-2xl bg-white/70 backdrop-blur-md
              ring-1 ring-slate-200 shadow-[0_10px_30px_rgba(17,24,39,0.12)]
              hover:shadow-[0_16px_40px_rgba(17,24,39,0.15)] transition-shadow
              ${isOrderForm ? "h-[520px]" : "h-[350px]"}`}
      spotlightColor="34, 211, 238"
    >
      <div className="w-full h-full flex flex-col p-4">
        <div className="relative flex items-center justify-center">
          <img
            src={product?.image ?? "/images.jpg"}
            alt={product?.name ?? "Product"}
            className="w-full h-48 object-cover rounded-2xl ring-1 ring-slate-200"
          />
          <span
            className="absolute -bottom-2 right-4 rounded-full px-3 py-1
                           text-sm font-semibold bg-white text-slate-900
                           shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
          >
            <span className="opacity-70">{price} MAD</span>
          </span>
        </div>

        <div className="mt-5 text-center px-2">
          <h3 className="text-lg font-semibold text-slate-900">
            {product?.name}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {product?.description}
          </p>
        </div>

        {isOrderForm && (
          <>
            <div className="mt-auto">
              <div className="mt-4 flex items-center justify-center gap-2">
                {sizes.map((s: any) => {
                  const active = selectedSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`relative inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition-all
                      ring-1 focus:outline-none focus-visible:ring-2
                      ${
                        active
                          ? "bg-slate-900 text-white ring-slate-900 shadow-[0_6px_20px_rgba(17,24,39,0.35)]"
                          : "bg-white/80 text-slate-800 ring-slate-200 hover:bg-slate-100"
                      }`}
                      aria-pressed={active}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  onClick={decrement}
                  className="w-9 h-9 text-lg font-bold text-white bg-red-500 rounded-full
                           hover:bg-red-600 active:scale-95 transition"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-8 text-lg font-semibold text-slate-900 text-center">
                  {qty}
                </span>
                <button
                  onClick={increment}
                  className="w-9 h-9 text-lg font-bold text-white bg-emerald-600 rounded-full
                           hover:bg-emerald-700 active:scale-95 transition"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* CTA */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={addToCart}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5
                           bg-emerald-600 text-white font-semibold
                           shadow-[0_0_0_2px_rgba(16,185,129,0.25),0_10px_30px_rgba(16,185,129,0.4)]
                           hover:bg-emerald-700 active:scale-[0.98] transition focus-visible:outline-none
                           focus-visible:ring-2 focus-visible:ring-emerald-400/70"
                >
                  Add to order
                </button>
              </div>
            </div>
            <div className="absolute top-1 right-1">
              <button className="relative inline-flex items-center  text-sm font-medium text-center text-white  focus:ring-4 focus:outline-none">
                <img
                  src="/plat.png"
                  alt="add plat icon"
                  width={"40px"}
                  className=""
                />
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-1 dark:border-gray-900">
                  {totalProduct}
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </SpotlightCard>
  );
}

export default Card;
