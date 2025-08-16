import { ReactNode } from "react";
import Header from "../header";
import Footer from "../footer";
import { ThemeProvider } from "@/components/theme-provider";
import {Sansita_Swashed} from "next/font/google";

type LayoutProps = {
  children: ReactNode;
};

const sansita_swashed  = Sansita_Swashed({ subsets: ['latin'] });

export default function Layout({ children }: LayoutProps) {
  return (
    <>
              <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            
          >
                    <Header/>
      <main className={sansita_swashed.className}>{children}</main>
        <Footer />
          </ThemeProvider>
    </>
  );
}
