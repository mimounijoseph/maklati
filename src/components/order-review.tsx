import { useAuth } from "@/context/useContext";
import { Product } from "./product-selection";
import { useEffect, useState } from "react";
import { useToast } from "./ui/toast";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { Order } from "@/interfaces/order";
import { Price, useCurrency } from "@/context/currencyContext";

type OrderReviewProps = {
  next: () => void;
  prev: () => void;
  snackId: any;
};
export const OrderReview = ({ next, prev, snackId }: OrderReviewProps) => {
  const { selectedProducts, setSelectedProducts } = useAuth();
  const [total, setTotal] = useState(0);
  const { toast } = useToast();
  const { currency } = useCurrency();
  const [formData, setFormData] = useState<Order>({
    number: null,
    date: new Date(),
    products: [],
    total: null,
    userUID: null,
    snackId: snackId,
    status: "Pending",
  });

  async function addOrder() {
    try {
      const ordersRef = collection(db, "orders");

      // Étape 1 : Récupérer le dernier document par order décroissant sur le champ `number`
      const q = query(ordersRef, orderBy("number", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      let newNumber = 0;
      if (!querySnapshot.empty) {
        const lastOrder = querySnapshot.docs[0].data();
        newNumber = lastOrder.number + 1;
      } else {
        newNumber = 1;
      }

      // Étape 2 : Créer le nouveau document avec `number`
      const newOrder = {
        ...formData,
        products: selectedProducts,
        total: total,
        userUID: auth.currentUser?.uid,
        number: newNumber,
      };

      // ✅ Ajouter la commande
      const docRef = await addDoc(ordersRef, newOrder);

      showToast(
        "Confirmed",
        "Your order will be prepared as soon as possible 😊",
        "success"
      );

      // ✅ Créer la notification directement dans Firestore
      await addDoc(collection(db, "notifications"), {
        orderId: docRef.id, // ID du document de la commande
        restaurantId: newOrder.snackId,
        title: `New Order #${newOrder.number}`,
        message: `${
          auth.currentUser?.displayName || "Client"
        } ordered, total: ${newOrder.total}`,
        createdAt: new Date(), // serveur local timestamp
        read: false,
        type: "order",
      });
    } catch (error) {
      console.error("Error adding order: ", error);
    }
  }

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
            const updatedCost = p.cost.map((e: any, index1: number) => {
              if (index == index1) {
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
          const updatedCost = p.cost.map((e: any, index1: number) => {
            if (index == index1) {
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
          product?.cost.map((p: any, index: number) => {
            return (
              p.quantity > 0 && (
                // <li key={product.id}>
                //   ✅ {product.name}
                // </li>
                <div key={index} className="mt-6 border-t border-black/40">
                  <dl className="divide-y divide-gray/10">
                    <div className="px-4 py-6 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:px-0">
                      <img
                        src={product.urlPhoto}
                        alt="product image"
                        width={"50px"}
                      />
                      <dt className="text-sm font-medium text-black">
                        {product?.name}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-700 sm:mt-0">
                        {p.quantity} unity *{" "}
                        <Price amount={p.price} from={currency} />
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
                        <span className="ml-2">
                          <Price
                            amount={p.quantity * p.price}
                            from={currency}
                          />
                        </span>
                      </div>
                    </div>
                  </dl>
                </div>
              )
            );
          })
        )}
      </ul>
      <div className="flex flex-col-reverse space-e-2 justify-between items-center mt-5 md:mt-0  md:flex-row md:justify-between md:items-end">
        <div className="flex gap-5 items-center justify-center">
          <button
            onClick={prev}
            className="bg-black text-white px-4 py-2 rounded block m-auto mt-10 cursor-pointer"
          >
            Retour
          </button>
          <button
            onClick={() => {
              addOrder();
              next();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded block m-auto mt-10 cursor-pointer"
          >
            Confirmer
          </button>
        </div>
        <p className="text-red-700 text-2xl">
          Total : <Price amount={total} from={currency} />
        </p>
      </div>
    </div>
  );
};
