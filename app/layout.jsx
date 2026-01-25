import "./globals.css";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import { Theme } from "@radix-ui/themes";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Sprout SACCO</title>
        <meta name="description" content="The SACCO for everyone" />
      </head>
      <body>
        <Toaster position="top-center" />
        <Analytics />
        <NextAuthProvider>
          <TanstackQueryProvider>
            <Theme>{children}</Theme>
          </TanstackQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
