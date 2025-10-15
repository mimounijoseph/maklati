// Card.tsx
import React, { useEffect, useState } from "react";
import { SpotlightCard } from "@/components/ui/spotlightcard";
import { Product } from "./product-selection";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/useContext";
import { Price, useCurrency } from "@/context/currencyContext";

type CardTypes = {
  product?: any;
  isOrderForm?: boolean;
};

function Card({ product, isOrderForm }: CardTypes) {
  const { selectedProducts, setSelectedProducts } = useAuth();
  const { toast } = useToast();
  const [sizes, setSizes] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState(product?.cost[0]?.size);
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(product?.cost[0].price);
  const [totalProduct, setTotalProduct] = useState(0);
  const { currency } = useCurrency();
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

  useEffect(() => {
    let categorys: any = product?.cost.map((e: any) => e.size);
    setSizes(categorys);
  }, []);

  useEffect(() => {
    let prod = selectedProducts.find((p: any) => p.id == product?.id);
    if (prod) {
      setTotalProduct(
        prod?.cost.reduce((sum: any, item: any) => sum + item.quantity, 0)
      );
    }
  }, []);

  useEffect(() => {}, [selectedProducts]);

  function decrement(): void {
    if (qty > 0) setQty(qty - 1);
  }

  function increment(): void {
    setQty(qty + 1);
  }

  function toggleSize(s: any): void {
    setSelectedSize(s);
    let price = product?.cost.find((e: any) => e.size == s)?.price;
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
            if (e.size == selectedSize) {
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
          if (e.size == selectedSize) {
            return { ...e, quantity: qty }; // Initialize quantity for the selected type
          }
          return e;
        }),
      };
      setSelectedProducts([...selectedProducts, newProduct]);
    }
    setTotalProduct(totalProduct + qty);

    showToast(
      `${product?.name}`,
      `${qty} of type ${selectedSize} was added successfully to your order`,
      "success"
    );
  }

  if (product.status)
    return (
      <SpotlightCard
        className={`w-44 rounded-2xl bg-white/70 backdrop-blur-md
              ring-1 ring-slate-200 shadow-[0_10px_30px_rgba(17,24,39,0.12)]
              hover:shadow-[0_16px_40px_rgba(17,24,39,0.15)] transition-shadow
              ${isOrderForm ? "h-auto" : "h-auto"}`}
        spotlightColor="34, 211, 238"
      >
        <div className="w-full h-full flex flex-col ">
          <div className="relative flex items-center justify-center">
            <img
              src={product.urlPhoto ?? "/images.jpg"}
              alt={product?.name ?? "Product"}
              className="w-full h-48 object-cover rounded-2xl ring-1 ring-slate-200"
            />
            <span
              className="absolute -bottom-2 right-4 rounded-full px-3 py-1
                           text-sm font-semibold bg-white text-slate-900
                           shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
            >
              <span className="opacity-70">
                <Price amount={price} from={currency} />
              </span>
            </span>
          </div>

          <div className="mt-5 text-center px-2 h-16 overflow-auto no-scrollbar">
            <h3 className="text-sm text-start font-semibold text-slate-900">
              {product?.name}
            </h3>
              <p className="text-xs text-start leading-6 text-slate-600 ">
                {"this is a delicious " + product?.name + " to try! It's built using bio-organic ingredients and it is very tasty"}
              </p>
          </div>

          {isOrderForm && (
            <>
              <div className=" bg-white ">
                <div className="mt-4 flex items-center  gap-2">
                  {sizes.map((s: any) => {
                    const active = selectedSize === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSize(s)}
                        className={`relative inline-flex items-center justify-center rounded-md px-2  text-sm font-medium transition-all
                      ring-2 focus:outline-none focus-visible:ring-2
                      ${
                        active
                          ? "bg-slate-900 text-white "
                          : "bg-white/80 text-slate-800 ring-slate-200 hover:bg-slate-100"
                      }`}
                        aria-pressed={active}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 flex items-center justify-between bg-gray-100 p-1  w-full rounded-full ">
                  <button
                    onClick={decrement}
                    className="w-8 h-8 text-md font-bold text-gray-900 bg-white rounded-full
                           hover:bg-whiteactive:scale-95 transition"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="min-w-4 text-md font-bold text-slate-900 text-center">
                    {qty}
                  </span>
                  <button
                    onClick={increment}
                    className="w-8 h-8 text-md font-bold text-white bg-orange-500 rounded-full
                           hover:bg-orange-600 active:scale-95 transition"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* CTA */}
                <div className="mt-2 flex justify-center">
                  <button
                    onClick={addToCart}
                    className="inline-flex items-center justify-center  rounded-md px-4 py-2 w-full
                           bg-orange-500 text-white text-sm font-semibold
                          
                           hover:bg-orange-600 active:scale-[0.98] transition focus-visible:outline-none
                            "
                  >
                    Add to order
                  </button>
                </div>
              </div>
              {/* <div className="absolute top-1 right-1">
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
              </div> */}
            </>
          )}
        </div>
      </SpotlightCard>
    );
}

export default Card;
