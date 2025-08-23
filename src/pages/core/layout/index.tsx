import 'flowbite';
import { ReactNode } from "react";
import Header from "../header";
import Footer from "../footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

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
       <Header/>
      <main className='main-layout'>{children}</main>
        <Footer />
          </ThemeProvider>
    </ToastProvider>
  );
}
