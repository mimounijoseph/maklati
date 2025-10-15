import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "./core/layout";
import { AuthProvider } from "@/context/useContext";
import { Tajawal, Changa, Cairo } from "next/font/google";
import { useEffect, useState } from "react";
import i18n from "@/i18n.client";

// ✅ Import your providers
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/context/currencyContext";

export const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    setLang(i18n.language);
  }, []);

  return (
    <ToastProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CurrencyProvider>
          <AuthProvider>
            <main className={lang === "ar" ? tajawal.className : ""}>
              {/* <Layout> */}
                <Component {...pageProps} />
              {/* </Layout> */}
            </main>
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}
