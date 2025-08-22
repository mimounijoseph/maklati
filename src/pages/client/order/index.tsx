import { OrderConfirmation } from "@/components/order-confirmation";
import { OrderReview } from "@/components/order-review";
import { ProductSelection } from "@/components/product-selection";
import { Stepper } from "@/components/stepper";
import { useState } from "react";

const OrderPage = () => {
  const [step, setStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Passer une commande</h1>

      <Stepper step={step} />

      {step === 1 && (
        <ProductSelection
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          next={next}
        />
      )}
      {step === 2 && (
        <OrderReview
          products={selectedProducts}
          next={next}
          prev={prev}
        />
      )}
      {step === 3 && <OrderConfirmation />}
    </div>
  );
};

export default OrderPage;
