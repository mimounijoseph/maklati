import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "./core/layout";
import { AuthProvider } from "@/context/useContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
