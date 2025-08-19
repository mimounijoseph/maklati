import { Product } from "./product-selection";

type OrderReviewProps = {
  products: Product[];
  next: () => void;
  prev: () => void;
};
export const OrderReview = ({ products, next, prev }: OrderReviewProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Vérifiez votre commande :</h2>
      <ul className="mb-4">
        {products.map((product) => (
          <li key={product.id}>✅ {product.name}</li>
        ))}
      </ul>
      <div className="flex space-x-2">
        <button onClick={prev} className="bg-gray-300 px-4 py-2 rounded">
          Retour
        </button>
        <button onClick={next} className="bg-green-500 text-white px-4 py-2 rounded">
          Confirmer
        </button>
      </div>
    </div>
  );
};
