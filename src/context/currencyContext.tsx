"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

/*
  CurrencyHeader.tsx
  ------------------
  Fichier prêt à l'emploi qui contient :
   - CurrencyProvider : contexte + récupération des taux (client-side)
   - Header : select box pour changer la devise (à placer dans votre header)
   - Price : petit composant pour afficher un prix converti et formaté
   - CurrencyHeaderDemo : export par défaut pour prévisualiser

  Notes d'intégration :
   - Avec le router "pages" : importez CurrencyProvider et wrappez <Component/> dans _app.tsx
   - Avec le router "app" (Next 13+) : placez CurrencyProvider dans app/layout.tsx *dans un composant client*
   - Le composant utilise localStorage pour garder la devise choisie
   - Il récupère les taux depuis exchangerate.host (pas de clé requise). Il y a aussi des valeurs de secours (fallback)
*/

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
  convert: (a) => a,
  format: (a) => String(a),
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>("MAD");
  const [rates, setRates] = useState<Record<Currency, number>>(defaultRates);

  // Lecture du choix précédent + fetch des taux (client-side)
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("currency") : null;
    if (stored && ["USD", "EUR", "MAD"].includes(stored)) setCurrency(stored as Currency);

    async function fetchRates() {
      try {
        const res = await fetch("https://api.exchangerate.host/latest?base=MAD&symbols=USD,EUR,MAD");
        if (!res.ok) throw new Error("Erreur réseau");
        const data = await res.json();
        setRates({
          USD: data.rates["USD"] ?? 1,
          EUR: data.rates["EUR"] ?? defaultRates.EUR,
          MAD: data.rates["MAD"] ?? defaultRates.MAD,
        });
      } catch (e) {
        console.warn("Impossible de récupérer les taux — fallback utilisé", e);
      }
    }

    fetchRates();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("currency", currency);
    } catch (e) {
      // ignore
    }
  }, [currency]);

  const convert = (amount: number, from: Currency = "MAD") => {
    // conversion : amount (from) -> USD -> target currency
    const rateFrom = rates["MAD"] ?? 1;
    const targetRate = rates[from] ?? 1;
    const amountInMAD = amount / rateFrom;
    console.log(amount,currency);
    
    return amountInMAD * targetRate;
  };

  const format = (amount: number, curr: Currency = currency) => {
    try {
        console.log(new Intl.NumberFormat(undefined, { style: "currency", currency: curr }).format(amount));
        
      return new Intl.NumberFormat(undefined, { style: "currency", currency: curr }).format(amount);
    } catch (e) {
      return `${amount.toFixed(2)} ${curr}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// ---------------- Header (select box) ----------------
// export function Header() {
//   const { currency, setCurrency } = useCurrency();
//   return (
//     <header className="flex items-center justify-between p-4 bg-white shadow-sm">
//       <div className="text-xl font-semibold">My Shop</div>
//       <div>
//         <label htmlFor="currency" className="sr-only">
//           Devise
//         </label>
//         <select
//           id="currency"
//           value={currency}
//           onChange={(e) => setCurrency(e.target.value as Currency)}
//           className="border rounded p-2"
//         >
//           <option value="USD">USD - $</option>
//           <option value="EUR">EUR - €</option>
//           <option value="MAD">MAD - د.م</option>
//         </select>
//       </div>
//     </header>
//   );
// }

// ---------------- Price helper ----------------
export function Price({ amount, from = "USD" }: { amount: number; from?: Currency }) {
  const {convert, format } = useCurrency();
  const converted = convert(amount, from);
  return <span>{format(converted)}</span>;
}

// Export par défaut : petit demo qui permet de prévisualiser localement
// export default function CurrencyHeaderDemo() {
//   return (
//     <CurrencyProvider>
//       <Header />
//       <main className="p-4">
//         <h2 className="text-lg mb-2">Exemples de prix</h2>
//         <div className="space-y-2">
//           <div>
//             Prix original: 10 USD → <Price amount={10} from="USD" />
//           </div>
//           <div>
//             Prix original: 50 EUR → <Price amount={50} from="EUR" />
//           </div>
//           <div>
//             Prix original: 100 MAD → <Price amount={100} from="MAD" />
//           </div>
//         </div>
//       </main>
//     </CurrencyProvider>
//   );
// }

/*
  Intégration rapide :
  - pages router (_app.tsx) :
    import { CurrencyProvider } from '@/components/CurrencyHeader';
    export default function App({ Component, pageProps }) {
      return (
        <CurrencyProvider>
          <Component {...pageProps} />
        </CurrencyProvider>
      );
    }

  - app router (app/layout.tsx) :
    // créez un composant client qui wrappe les children
    'use client';
    import { CurrencyProvider } from '@/components/CurrencyHeader';
    export default function RootLayout({ children }) {
      return (
        <html>
          <body>
            <CurrencyProvider>{children}</CurrencyProvider>
          </body>
        </html>
      );
    }

  Remarques :
  - Pour éviter des problèmes de SSR / hydratation, ce fichier est 100% client-side ("use client").
  - Si vous préférez récupérer les taux sur votre serveur (pour cacher une clé ou centraliser), créez une API route /api/rates qui appelle l'API externe et retournez les taux au client.
*/
