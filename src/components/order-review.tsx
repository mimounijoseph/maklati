import { useAuth } from "@/context/useContext";
import { Product } from "./product-selection";

type OrderReviewProps = {
  next: () => void;
  prev: () => void;
};
export const OrderReview = ({ next, prev }: OrderReviewProps) => {
  const { selectedProducts } = useAuth();
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Vérifiez votre commande :</h2>
      <ul className="mb-4">
        {selectedProducts.map((product: any) => (
          <li key={product.id}>
            ✅ {product.name}
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
          </li>

        ))}
      </ul>
      <div className="flex space-x-2">
        <button onClick={prev} className="bg-gray-300 px-4 py-2 rounded">
          Retour
        </button>
        <button
          onClick={next}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Confirmer
        </button>
      </div>
    </div>
  );
};
