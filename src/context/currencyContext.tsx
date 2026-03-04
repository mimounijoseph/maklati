"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Currency = "USD" | "EUR" | "MAD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Record<Currency, number>;
  convert: (amount: number, from?: Currency) => number;
  format: (amount: number, currency?: Currency) => string;
}

const defaultRates: Record<Currency, number> = { MAD: 1, USD: 0.1, EUR: 0.092 };

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "MAD",
  setCurrency: () => {},
  rates: defaultRates,
  convert: (amount) => amount,
  format: (amount) => String(amount),
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>("MAD");
  const [rates, setRates] = useState<Record<Currency, number>>(defaultRates);

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("currency") : null;

    if (stored && ["USD", "EUR", "MAD"].includes(stored)) {
      setCurrency(stored as Currency);
    }

    const controller = new AbortController();

    const fetchRates = async () => {
      try {
        const res = await fetch(
          "https://api.exchangerate.host/latest?base=MAD&symbols=USD,EUR,MAD",
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch rates");
        }

        const data = await res.json();
        setRates({
          USD: data?.rates?.USD ?? defaultRates.USD,
          EUR: data?.rates?.EUR ?? defaultRates.EUR,
          MAD: data?.rates?.MAD ?? defaultRates.MAD,
        });
      } catch (error: any) {
        if (error?.name === "AbortError") return;
        console.warn("Failed to fetch currency rates, using fallback values.", error);
      }
    };

    fetchRates();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("currency", currency);
    } catch {
      // Ignore localStorage write errors.
    }
  }, [currency]);

  const convert = (amount: number, from: Currency = "MAD") => {
    const sourceRate = rates[from] ?? 1;
    const targetRate = rates[currency] ?? 1;
    const amountInMad = from === "MAD" ? amount : amount / sourceRate;
    return currency === "MAD" ? amountInMad : amountInMad * targetRate;
  };

  const format = (amount: number, curr: Currency = currency) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: curr,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${curr}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export function Price({
  amount,
  from = "USD",
}: {
  amount: number;
  from?: Currency;
}) {
  const { convert, format } = useCurrency();
  const converted = convert(amount, from);
  return <span>{format(converted)}</span>;
}
