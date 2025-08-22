export type Product = {
  id: number;
  name: string;
};
type ProductSelectionProps = {
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
  next: () => void;
};
export const ProductSelection = ({ selectedProducts, setSelectedProducts, next }: ProductSelectionProps) => {
  const products = [
    { id: 1, name: "Produit A" },
    { id: 2, name: "Produit B" },
    { id: 3, name: "Produit C" },
  ];

  const toggleProduct = (product: { id: number; name: string; }) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(selectedProducts.filter((p:any) => p !== product));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Choisissez vos produits :</h2>
      <ul className="mb-4">
        {products.map((product) => (
          <li key={product.id}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product)}
                onChange={() => toggleProduct(product)}
              />
              <span>{product.name}</span>
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={next}
        disabled={selectedProducts.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Valider les produits
      </button>
    </div>
  );
};
