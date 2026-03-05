import React, { useEffect, useMemo, useState } from "react";
import { SpotlightCard } from "@/components/ui/spotlightcard";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/useContext";
import { Price } from "@/context/currencyContext";

type CardTypes = {
  product?: any;
  isOrderForm?: boolean;
};

function Card({ product, isOrderForm }: CardTypes) {
  const { selectedProducts, setSelectedProducts } = useAuth();
  const { toast } = useToast();
  const [sizes, setSizes] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState(product?.cost?.[0]?.size || "");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(product?.cost?.[0]?.price || 0);

  const selectedProduct = useMemo(
    () => selectedProducts.find((p: any) => p.id === product?.id),
    [product?.id, selectedProducts]
  );

  const totalProduct = useMemo(() => {
    if (!selectedProduct) return 0;
    return selectedProduct.cost.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }, [selectedProduct]);

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
      title,
      description: message,
      variant,
      duration: 2500,
    });
  }

  useEffect(() => {
    const allSizes = product?.cost?.map((e: any) => e.size) || [];
    setSizes(allSizes);
  }, [product]);

  useEffect(() => {
    const sizeConfig = product?.cost?.find((e: any) => e.size === selectedSize);
    setPrice(sizeConfig?.price || product?.cost?.[0]?.price || 0);

    const currentQty =
      selectedProduct?.cost?.find((e: any) => e.size === selectedSize)?.quantity || 1;
    setQty(currentQty > 0 ? currentQty : 1);
  }, [product, selectedProduct, selectedSize]);

  function decrement(): void {
    setQty((prev) => Math.max(1, prev - 1));
  }

  function increment(): void {
    setQty((prev) => prev + 1);
  }

  function toggleSize(s: any): void {
    setSelectedSize(s);
  }

  function addToCart(): void {
    if (!product || !setSelectedProducts || !selectedSize) {
      return;
    }

    const safeQty = Math.max(1, qty);
    const existingProduct = selectedProducts.find((p: any) => p.id === product.id);

    if (existingProduct) {
      const updatedProducts = selectedProducts.map((p: any) => {
        if (p.id !== product.id) {
          return p;
        }

        const updatedCost = p.cost.map((e: any) => {
          if (e.size === selectedSize) {
            return { ...e, quantity: safeQty };
          }
          return e;
        });

        return { ...p, cost: updatedCost };
      });

      setSelectedProducts(updatedProducts);
    } else {
      const newProduct = {
        ...product,
        cost: product.cost.map((e: any) => {
          if (e.size === selectedSize) {
            return { ...e, quantity: safeQty };
          }
          return { ...e, quantity: 0 };
        }),
      };

      setSelectedProducts([...selectedProducts, newProduct]);
    }

    showToast(
      `${product?.name}`,
      `${safeQty} of type ${selectedSize} was added successfully to your order`,
      "success"
    );
  }

  if (product?.status)
    return (
      <SpotlightCard
        className={`relative w-full rounded-2xl bg-white/70 backdrop-blur-md ring-1 ring-slate-200 shadow-[0_10px_30px_rgba(17,24,39,0.12)] hover:shadow-[0_16px_40px_rgba(17,24,39,0.15)] transition-shadow ${
          isOrderForm ? "h-auto" : "h-auto"
        }`}
        spotlightColor="34, 211, 238"
      >
        <div className="flex h-full w-full flex-col">
          <div className="relative flex items-center justify-center">
            <img
              src={product.urlPhoto ?? "/images.jpg"}
              alt={product?.name ?? "Product"}
              className="h-48 w-full rounded-2xl object-cover ring-1 ring-slate-200"
            />

            <span className="absolute -bottom-2 right-4 rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
              <Price amount={price} from="MAD" />
            </span>

            {isOrderForm && totalProduct > 0 && (
              <span className="absolute left-4 top-4 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-orange-500 px-2 text-xs font-bold text-white shadow-[0_10px_20px_rgba(249,115,22,0.35)]">
                {totalProduct}
              </span>
            )}
          </div>

          <div className="mt-5 h-16 overflow-auto px-2 text-center no-scrollbar">
            <h3 className="text-start text-sm font-semibold text-slate-900">
              {product?.name}
            </h3>
            <p className="text-start text-xs leading-6 text-slate-600">
              {"this is a delicious " +
                product?.name +
                " to try! It's built using bio-organic ingredients and it is very tasty"}
            </p>
          </div>

          {isOrderForm && (
            <div className="bg-white">
              <div className="mt-4 flex items-center gap-2">
                {sizes.map((s: any) => {
                  const active = selectedSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`relative inline-flex items-center justify-center rounded-md px-2 text-sm font-medium transition-all ring-2 focus:outline-none focus-visible:ring-2 ${
                        active
                          ? "bg-slate-900 text-white"
                          : "bg-white/80 text-slate-800 ring-slate-200 hover:bg-slate-100"
                      }`}
                      aria-pressed={active}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 flex w-full items-center justify-between rounded-full bg-gray-100 p-1">
                <button
                  onClick={decrement}
                  className="h-8 w-8 rounded-full bg-white text-md font-bold text-gray-900 transition hover:bg-stone-100 active:scale-95"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="min-w-4 text-center text-md font-bold text-slate-900">
                  {qty}
                </span>
                <button
                  onClick={increment}
                  className="h-8 w-8 rounded-full bg-orange-500 text-md font-bold text-white transition hover:bg-orange-600 active:scale-95"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="mt-2 flex justify-center">
                <button
                  onClick={addToCart}
                  className="inline-flex w-full items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-[0.98] focus-visible:outline-none"
                >
                  Add to order
                </button>
              </div>
            </div>
          )}
        </div>
      </SpotlightCard>
    );
}

export default Card;
