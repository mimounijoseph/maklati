import { ReactNode } from "react";
import Header from "../header";
import Footer from "../footer";
import { ThemeProvider } from "@/components/theme-provider";

type LayoutProps = {
  children: ReactNode;
};

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
      <main>{children}</main>
        <Footer />
          </ThemeProvider>
    </>
  );
}
