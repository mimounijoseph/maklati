"use client"; // 👈 Important: makes sure hooks like useToast work properly on the client

import "flowbite";
import { ReactNode } from "react";
import Header from "../header";
import Footer from "../footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast"; // ✅ Correct import
import { CurrencyProvider } from "@/context/currencyContext";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <ToastProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CurrencyProvider>
          <Header />
          <main className="main-layout">{children}</main>
          <Footer />
        </CurrencyProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}
