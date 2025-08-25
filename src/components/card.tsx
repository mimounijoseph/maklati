// Card.tsx

import React, { useState } from "react";
import CheckboxDropdown from "./checkbox-dropdown";
import { SpotlightCard } from "@/components/ui/spotlightcard";
import { Product } from "./product-selection";
import { useToast } from "@/components/ui/toast";



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
const [count,setCount] = useState(0)
const { toast } = useToast();
function showToast(title: string, message: string, variant: "success" | "default" | "destructive" | "warning" | "info" | undefined) {
        toast({
            title: title,
            description: message,
            variant: variant,
            duration: 2500,
        });
    }

    function addProduct(type:string){
        setCount(count+1)
        const order = {
            ...product,
            type
        }
        showToast(`${product?.name}`,`${product?.name} of type ${type} was added successfully to your order`,"success")
        
    }



  return (
    <SpotlightCard
      className="w-80 h-96 bg-white/70"
      spotlightColor="34, 211, 238"
    >
        {/* <span className="text-3xl absolute top-1 right-1 z-50">🍽️</span> */}
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
          <button onClick={()=>addProduct('M')} className="inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg  outline from-red-200 via-red-300 to-yellow-200  dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
            <span className="px-3 py-1  ease-in duration-75 bg-transparent text-black rounded-md ">
              M
            </span>
          </button>
          <button onClick={()=>addProduct('L')} className="inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg  outline from-red-200 via-red-300 to-yellow-200  dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
            <span className="px-3 py-1  ease-in duration-75 bg-transparent text-black rounded-md ">
              L
            </span>
          </button>
          <button onClick={()=>addProduct('XL')} className="inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg  outline from-red-200 via-red-300 to-yellow-200  dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
            <span className="px-3 py-1  ease-in duration-75 bg-transparent text-black rounded-md ">
              XL
            </span>
          </button>
          </div>
          <div className="absolute top-1 right-1">
          <button className="relative inline-flex items-center  text-sm font-medium text-center text-white  focus:ring-4 focus:outline-none">
            <img src="/plat.png" alt="add plat icon" width={'50px'} className="" />
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-1 dark:border-gray-900">{count}</div>
          </button>
          </div>

          {/* <div className="flex items-center justify-center gap-4">
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
          </div> */}
        </>
      ) : (
        <></>
      )}
    </SpotlightCard>
  );
}

export default Card;
