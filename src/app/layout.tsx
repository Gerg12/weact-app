import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Headless Storefront",
  description: "A headless WordPress storefront",
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
