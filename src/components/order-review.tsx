import { useAuth } from "@/context/useContext";
import { Product } from "./product-selection";
import { useEffect, useState } from "react";
import { useToast } from "./ui/toast";


type OrderReviewProps = {
  next: () => void;
  prev: () => void;
};
export const OrderReview = ({ next, prev }: OrderReviewProps) => {
  const { selectedProducts, setSelectedProducts } = useAuth();
  const [total, setTotal] = useState(0);
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

  function calculTotal() {
    let total = selectedProducts.reduce(
      (sum1: any, prod: any) =>
        sum1 +
        prod?.cost.reduce(
          (sum: any, item: any) => sum + item.quantity * item.price,
          0
        ),
      0
    );
    setTotal(total);
  }
  useEffect(() => {
    calculTotal();
  }, [selectedProducts]);

  function decrement(product: any, index: number): void {
    if (product.cost[index].quantity > 0) {
      let myProduct = selectedProducts.find((p: any) => p.id == product.id);
      if (myProduct) {
        const updatedProducts = selectedProducts.map((p: any) => {
          if (p.id == product?.id) {
            const updatedCost = p.cost.map((e: any,index1:number) => {
              if (index==index1) {
                e.quantity--; // Update the quantity
              }
              return e;
            });
            return { ...p, cost: updatedCost };
          }
          return p;
        });
        setSelectedProducts(updatedProducts);
      }
    }
  }

  function increment(product: any, index: number): void {
    
      let myProduct = selectedProducts.find((p: any) => p.id == product.id);
      if (myProduct) {
        const updatedProducts = selectedProducts.map((p: any) => {
          if (p.id == product?.id) {
            const updatedCost = p.cost.map((e: any,index1:number) => {
              if (index==index1) {
                
                e.quantity++;
              }
              return e;
            });
            return { ...p, cost: updatedCost };
          }
          return p;
        });
        setSelectedProducts(updatedProducts);
    }
  }

  return (
    <div className="bg-white/70 text-black md:w-[60%] m-auto md:rounded-2xl px-10 py-5">
      <h1 className="text-2xl font-semibold mb-2 text-center">
        Your order details
      </h1>
      <ul className="mb-4">
        {selectedProducts.map((product: any) =>
          product?.cost.map((p: any, index: number) => (
            <>
              {p.quantity > 0 && (
                // <li key={product.id}>
                //   ✅ {product.name}
                // </li>
                <div key={index} className="mt-6 border-t border-black/40">
                  <dl className="divide-y divide-gray/10">
                    <div className="px-4 py-6 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:px-0">
                      <img src="/plat.png" alt="product image" width={"50px"} />
                      <dt className="text-sm font-medium text-black">
                        {product?.name}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-700 sm:mt-0">
                        {p.quantity} unity * {p.price} MAD
                      </dd>
                      <div className="flex sm:flex-col md:flex-row justify-end items-center sm:mt-3 md:mt-0 sm:gap-5 md:gap-0">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => decrement(product, index)}
                          className="w-8 h-8 text-lg font-bold text-white bg-red-500 rounded-full hover:bg-red-600 transition cursor-pointer"
                        >
                          −
                        </button>
                        <span className="text-lg font-medium text-black">
                          {p.quantity}
                        </span>
                        <button
                          onClick={() => increment(product, index)}
                          className="w-8 h-8 text-lg font-bold text-white bg-green-500 rounded-full hover:bg-green-600 transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="ml-2">{p.quantity * p.price} MAD</span>
                      </div>
                    </div>
                  </dl>
                </div>
              )}
            </>
          ))
        )}
      </ul>
      <div className="flex flex-col space-e-2 justify-between items-end  md:flex-row md:justify-center">
        <div className="flex gap-5 items-center justify-center">
          <button
            onClick={prev}
            className="bg-black text-white px-4 py-2 rounded block m-auto mt-10 cursor-pointer"
          >
            Retour
          </button>
          <button
            onClick={()=>{
              showToast('Confirmed','Your order will be prepared as soon as possible 😊','success')
              next()
            }}
            className="bg-red-500 text-white px-4 py-2 rounded block m-auto mt-10 cursor-pointer"
          >
            Confirmer
          </button>
        </div>
        <p className="text-red-700 text-2xl">Total : {total} MAD</p>
      </div>
    </div>
  );
};
