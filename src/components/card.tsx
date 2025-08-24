// Card.tsx
import React from "react";
import CheckboxDropdown from "./checkbox-dropdown";
import { SpotlightCard } from "@/components/ui/spotlightcard";
import { Product } from "./product-selection";
import { useState } from "react";

type CardTypes = {
  product: { id: string; name: string; price: number; quantity?: number; image?: string };
  selectedProducts?: any;
  setSelectedProducts?: (updater: any) => void;
  isOrderForm?: boolean;
};

function Card({
  product,
  selectedProducts,
  setSelectedProducts,
  isOrderForm,
}: CardTypes) {
  const [selectedSize, setSelectedSize] = useState<"M" | "L" | "XL">("M");
  const [qty, setQty] = useState<number>(product?.quantity ?? 1);

  const sizes: Array<"M" | "L" | "XL"> = ["M", "L", "XL"];

  const increment = () => {
    setQty((q) => Math.min(q + 1, 99));
    // مثال ربط مع ستايت خارجي:
    // setSelectedProducts?.((prev) => ({ ...prev, [product.id]: { ...prev[product.id], qty: Math.min((prev[product.id]?.qty ?? 0) + 1, 99) }}));
  };

  const decrement = () => {
    setQty((q) => Math.max(q - 1, 1));
    // مثال ربط مع ستايت خارجي:
    // setSelectedProducts?.((prev) => ({ ...prev, [product.id]: { ...prev[product.id], qty: Math.max((prev[product.id]?.qty ?? 1) - 1, 1) }}));
  };

  const addToCart = () => {
    // اربط حسب حاجتك:
    // setSelectedProducts?.((prev) => ({ ...prev, [product.id]: { ...product, size: selectedSize, qty } }));
  };

  return (
    <SpotlightCard
      className="w-80 h-[500px] rounded-2xl bg-white/70 backdrop-blur-md
                 ring-1 ring-slate-200 shadow-[0_10px_30px_rgba(17,24,39,0.12)]
                 hover:shadow-[0_16px_40px_rgba(17,24,39,0.15)] transition-shadow"
      spotlightColor="34, 211, 238"
    >
      <div className="w-full h-full flex flex-col p-4">
        {/* صورة + بادج السعر */}
        <div className="relative flex items-center justify-center">
          <img
            src={product?.image ?? "/snack1.png"}
            alt={product?.name ?? "Product"}
            className="w-32 h-32 object-cover rounded-2xl ring-1 ring-slate-200"
          />
          <span className="absolute -bottom-2 right-4 rounded-full px-3 py-1
                           text-sm font-semibold bg-white text-slate-900
                           shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
            {product?.price} <span className="opacity-70">MAD</span>
          </span>
        </div>
       
        <div className="mt-5 text-center px-2">
          <h3 className="text-lg font-semibold text-slate-900">{product?.name}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            هذا وصف قصير للمنتج يوضح الميزات الأساسية بطريقة بسيطة.
          </p>
        </div>

        {isOrderForm ? (
          <div className="mt-auto">
            <div className="mt-4 flex items-center justify-center gap-2">
              {sizes.map((s) => {
                const active = selectedSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`relative inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition-all
                      ring-1 focus:outline-none focus-visible:ring-2
                      ${active
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
        ) : (
          <div className="mt-auto flex justify-center">
            <button
              onClick={addToCart}
              className="rounded-full px-5 py-2.5 bg-slate-900 text-white font-semibold
                         hover:bg-slate-800 transition focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-emerald-400/70"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}

export default Card;
