// Card.tsx
import React from "react";
import CheckboxDropdown from "./checkbox-dropdown";
import { SpotlightCard } from "@/components/ui/spotlightcard";
import { Product } from "./product-selection";

type CardTypes = {
  product?: Product;
  selectedProducts?: Product[];
  setSelectedProducts: (products: Product[]) => void;
  isOrderForm?: boolean;
};

function Card({
  product,
  selectedProducts,
  setSelectedProducts,
  isOrderForm,
}: CardTypes) {
  return (
    <SpotlightCard
      className="w-80 h-96 bg-white/70"
      spotlightColor="34, 211, 238"
    >
      <div className="w-full h-full flex flex-col items-center justify-start text-center p-4">
        <img
          src="/snack1.png"
          alt="Product"
          className="w-32 h-32 object-cover rounded-xl mb-4"
        />
        <h3 className="text-lg text-black font-semibold mb-1">
          {product?.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          هذا وصف قصير للمنتج يوضح الميزات الأساسية بطريقة بسيطة.
        </p>
        <span className="text-2xl font-bold  text-black ">
          {product?.price} MAD
        </span>
      </div>
      {isOrderForm ? (
        <>
                  <div className="flex justify-center items-center">
          <button className="inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg  outline from-red-200 via-red-300 to-yellow-200  dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
            <span className="px-3 py-1  ease-in duration-75 bg-transparent text-black rounded-md ">
              M
            </span>
          </button>
          <button className="inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg  outline from-red-200 via-red-300 to-yellow-200  dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
            <span className="px-3 py-1  ease-in duration-75 bg-transparent text-black rounded-md ">
              L
            </span>
          </button>
          <button className="inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg  outline from-red-200 via-red-300 to-yellow-200  dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
            <span className="px-3 py-1  ease-in duration-75 bg-transparent text-black rounded-md ">
              XL
            </span>
          </button>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              // onClick={decrement}
              className="w-8 h-8 text-lg font-bold text-white bg-red-500 rounded-full hover:bg-red-600 transition"
            >
              −
            </button>
            <span className="text-lg font-medium text-black">
              {product?.quantity}
            </span>
            <button
              // onClick={increment}
              className="w-8 h-8 text-lg font-bold text-white bg-green-500 rounded-full hover:bg-green-600 transition"
            >
              +
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
    </SpotlightCard>
  );
}

export default Card;
