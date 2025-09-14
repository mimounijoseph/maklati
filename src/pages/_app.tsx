import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "./core/layout";
import { AuthProvider } from "@/context/useContext";
import { Tajawal, Changa, Cairo } from "next/font/google";
import { useEffect, useState } from "react";
import i18n from "@/i18n.client";

export const tajawal = Tajawal({
  subsets: ["arabic", "latin"], 
  weight: ["400", "500", "700"], 
  variable: "--font-arabic",    
  display: "swap"
}); 

export default function App({ Component, pageProps }: AppProps) {
 const [lang, setLang] = useState("en");

  useEffect(() => {
    setLang(i18n.language); 
  }, []);

  return (
    <AuthProvider>
      <main className={lang === "ar" ? tajawal.className : ""}>
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
