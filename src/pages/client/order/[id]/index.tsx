import { OrderConfirmation } from "@/components/order-confirmation";
import { OrderReview } from "@/components/order-review";
import { ProductSelection } from "@/components/product-selection";
import ProtectedPage from "@/guard/protectedPage";
import { Stepper } from "@/components/stepper";
import Layout from "@/pages/core/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SnackService } from "@/services/snack";

const snackService = new SnackService();

const OrderPage = () => {
  const router = useRouter();
  const { id, step: stepQuery } = router.query;
  const [step, setStep] = useState(1);
  const [ownerUID, setOwnerUID] = useState<string | null>(null);

  useEffect(() => {
    if (typeof stepQuery !== "string") {
      return;
    }

    const parsedStep = Number(stepQuery);
    if (parsedStep >= 1 && parsedStep <= 3) {
      setStep(parsedStep);
    }
  }, [stepQuery]);

  useEffect(() => {
    const fetchSnackOwner = async () => {
      if (typeof id !== "string") {
        return;
      }

      const snack = await snackService.getById(id);
      setOwnerUID(snack?.ownerUID || null);
    };

    fetchSnackOwner();
  }, [id]);

  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);

  return (
    <Layout>
      <ProtectedPage>
        <div className=" bg-white">
          <h1 className="text-2xl font-bold  text-center"></h1>
          <Stepper step={step} />

          {step === 1 && <ProductSelection next={next} snackId={ownerUID} />}
          {step === 2 && <OrderReview next={next} prev={prev} snackId={ownerUID} />}
          {step === 3 && <OrderConfirmation />}
        </div>
      </ProtectedPage>
    </Layout>
  );
};

export default OrderPage;
