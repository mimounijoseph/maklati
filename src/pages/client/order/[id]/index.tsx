import { OrderConfirmation } from "@/components/order-confirmation";
import { OrderReview } from "@/components/order-review";
import { ProductSelection } from "@/components/product-selection";
import ProtectedPage from "@/guard/protectedPage";
import { Stepper } from "@/components/stepper";
import Layout from "@/pages/core/layout";
import { useRouter } from "next/router";
import { useState } from "react";

const OrderPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [step, setStep] = useState(1);


  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);

  return (
    <Layout>
      <ProtectedPage>
        <div className=" bg-white">
          <h1 className="text-2xl font-bold  text-center"></h1>
          <Stepper step={step} />

          {step === 1 && <ProductSelection next={next} snackId={id} />}
          {step === 2 && <OrderReview next={next} prev={prev} snackId={id} />}
          {step === 3 && <OrderConfirmation />}
        </div>
      </ProtectedPage>
    </Layout>
  );
};

export default OrderPage;
