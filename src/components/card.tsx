// Card.tsx
import React, { useEffect, useState } from "react";
import CheckboxDropdown from "./checkbox-dropdown";
import { SpotlightCard } from "@/components/ui/spotlightcard";
import { Product } from "./product-selection";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/useContext";

type CardTypes = {
  product?: Product;
  isOrderForm?: boolean;
};

function Card({
  product,
  isOrderForm,
}: CardTypes) {
   const {selectedProducts, setSelectedProducts} = useAuth();
  const [selectedTypes, setSelectedTypes] = useState<any[]>([]);
  const { toast } = useToast();
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

  function addProduct(product: any, type: string) {
    if (!selectedTypes.includes(type)) {
      setSelectedTypes([...selectedTypes, type]);
    }

    let selectedProduct = selectedProducts.find((p: any) => p.id == product.id);

    if (selectedProduct) {
      // If the product already exists, update the quantity of the selected type
      const updatedProducts = selectedProducts.map((p: any) => {
        if (p.id == product.id) {
          const updatedCost = p.cost.map((e: any) => {
            if (e.type == type) {
              return { ...e, quantity: e.quantity + 1 }; // Update the quantity
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
        cost: product.cost.map((e: any) => {
          if (e.type == type) {
            return { ...e, quantity: 1 }; // Initialize quantity for the selected type
          }
          return e;
        })
      };
      setSelectedProducts([...selectedProducts, newProduct]);
    }

    showToast(
      `${product?.name}`,
      `${product?.name} of type ${type} was added successfully to your order`,
      "success"
    );
}

useEffect(()=>{
  setSelectedTypes([])
  let myProduct:any = selectedProducts.find((p:any)=>p.id==product?.id)
  if(myProduct){
      let newSelectedTypes:any[] = []
    myProduct.cost.map((c:any)=>{
      if(c.quantity>0){
        newSelectedTypes.push(c.type)
      }
    })
    setSelectedTypes(newSelectedTypes)
  }
  
},[selectedProducts])

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
        <p className="text-sm text-gray-600 mb-3">{product?.description}</p>
        {/* <span className="text-2xl font-bold  text-black ">
          {product?.price} MAD
        </span> */}
      </div>
      {isOrderForm ? (
        <>
          <div className="flex flex-col justify-center items-center">
            <button
              onClick={() => addProduct(product, "M")}
              className={
                selectedTypes.includes("M")
                  ? "inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg  outline from-red-200 via-red-300 to-yellow-200   focus:ring-4 focus:outline-none ring-4 ring-red-400  cursor-pointer"
                  : "inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg  outline from-red-200 via-red-300 to-yellow-200   focus:ring-4 focus:outline-none focus:ring-red-400  cursor-pointer"
              }
            >
              <span className="px-3 py-1  ease-in duration-75 bg-transparent text-black rounded-md ">
                M | {product?.cost[0].price} MAD
              </span>
            </button>
            <button
              onClick={() => addProduct(product, "L")}
              className={
                selectedTypes.includes("L")
                  ? "inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg  outline from-red-200 via-red-300 to-yellow-200   focus:ring-4 focus:outline-none ring-4 ring-red-400  cursor-pointer"
                  : "inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg  outline from-red-200 via-red-300 to-yellow-200   focus:ring-4 focus:outline-none focus:ring-red-400  cursor-pointer"
              }
            >
              <span className="px-3 py-1  ease-in duration-75 bg-transparent text-black rounded-md ">
                L | {product?.cost[1].price} MAD
              </span>
            </button>
            <button
              onClick={() => addProduct(product, "XL")}
              className={
                selectedTypes.includes("XL")
                  ? "inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg  outline from-red-200 via-red-300 to-yellow-200   focus:ring-4 focus:outline-none ring-4 ring-red-400  cursor-pointer"
                  : "inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg  outline from-red-200 via-red-300 to-yellow-200   focus:ring-4 focus:outline-none focus:ring-red-400  cursor-pointer"
              }
            >
              <span className="px-3 py-1  ease-in duration-75 bg-transparent text-black rounded-md ">
                XL | {product?.cost[2].price} MAD
              </span>
            </button>
          </div>
          <div className="absolute top-1 right-1">
            <button className="relative inline-flex items-center  text-sm font-medium text-center text-white  focus:ring-4 focus:outline-none">
              <img
                src="/plat.png"
                alt="add plat icon"
                width={"50px"}
                className=""
              />
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-1 dark:border-gray-900">
                {selectedTypes.length}
              </div>
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
