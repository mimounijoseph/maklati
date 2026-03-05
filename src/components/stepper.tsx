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
      className="mx-auto mb-8 flex max-w-4xl flex-col gap-3 px-4 pt-6 sm:px-6 md:flex-row md:justify-between"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {steps.map((label, index) => {
        const isActive = step === index + 1;
        const isCompleted = step > index + 1;

        return (
          <div
            key={index}
            className="flex flex-1 items-center gap-3 rounded-3xl border border-slate-200/70 bg-white/80 px-4 py-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)] backdrop-blur"
          >
            <div
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-semibold transition-all",
                isCompleted
                  ? "border-emerald-200 bg-emerald-500 text-white"
                  : isActive
                  ? "border-orange-200 bg-orange-500 text-white shadow-[0_12px_30px_rgba(249,115,22,0.24)]"
                  : "border-slate-200 bg-white text-slate-500",
              ].join(" ")}
              aria-current={isActive ? "step" : undefined}
              aria-label={`${index + 1} - ${label}`}
            >
              {index + 1}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{label}</p>
              <p className="text-xs text-slate-500">
                {isCompleted
                  ? "Completed"
                  : isActive
                  ? "Current step"
                  : "Upcoming"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
