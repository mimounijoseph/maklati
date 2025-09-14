"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const Stepper = ({ step }: { step: number }) => {
  const { t, i18n } = useTranslation("common");
  const steps = useMemo(
    () => (t("checkout.steps", { returnObjects: true }) as string[]) ?? [],
    [t, i18n.language]
  );

  return (
    <div
      className="flex justify-around mb-6 md:w-[60%] md:mx-auto"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {steps.map((label, index) => {
        const isActive = step === index + 1;
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={[
                "w-8 h-8 flex items-center justify-center rounded-full",
                isActive ? "bg-amber-600 text-white" : "bg-white text-black",
                "border border-amber-600/40"
              ].join(" ")}
              aria-current={isActive ? "step" : undefined}
              aria-label={`${index + 1} — ${label}`}
            >
              {index + 1}
            </div>
            <span className="text-sm mt-2 text-black/80">{label}</span>
          </div>
        );
      })}
    </div>
  );
};
