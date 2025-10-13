// src/pages/core/layout/index.tsx
"use client";

import "flowbite";
import { ReactNode } from "react";
import Header from "../header";
import Footer from "../footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
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
          {/* ✅ Header is inside ToastProvider */}
          <Header />
          <main className="main-layout">{children}</main>
          <Footer />
        </CurrencyProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}
