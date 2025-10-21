import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Strapi Debug Frontend",
  description: "Minimal frontend to inspect Strapi API responses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
