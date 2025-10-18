import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter, playfair } from "@/lib/fonts";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: {
    default: "Editorial Modern Portfolio",
    template: "%s · Editorial Modern",
  },
  description:
    "Portafolio editorial contemporáneo con diseños escenográficos de alto impacto visual, organizados por categorías y tags.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    siteName: "Editorial Modern",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-bg text-text">
        {/* @ts-expect-error Async Server Component */}
        <Navbar />
        <main className="mx-auto min-h-[60vh] max-w-6xl px-6 py-12">{children}</main>
        {/* @ts-expect-error Async Server Component */}
        <Footer />
      </body>
    </html>
  );
}
