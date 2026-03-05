import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

function getCookie(req: any, name: string): string | null {
  const cookie = req?.headers?.cookie;
  if (!cookie) return null;
  const match = cookie
    .split(";")
    .map((c: string) => c.trim())
    .find((c: string) => c.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export default class MyDocument extends Document<{ lang: string; dir: "ltr" | "rtl" }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const lng = getCookie(ctx.req, "i18next") || "en";
    const dir = lng === "ar" ? "rtl" : "ltr";
    return { ...initialProps, lang: lng, dir };
  }
  

  render() {
    const { lang, dir } = (this.props as any);
    return (
      <Html lang={lang} dir={dir} suppressHydrationWarning>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Sacramento&family=Sansita+Swashed:wght@300..900&display=swap&family=Tajawal:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
          <script src="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"></script>
        </body>
      </Html>
    );
  }
}



