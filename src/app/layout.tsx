import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";

export const metadata: Metadata = {
  title: {
    default: "ATM Crackers — Premium Sivakasi Fireworks",
    template: "%s | ATM Crackers",
  },
  description:
    "Shop premium Sivakasi crackers and fireworks online at ATM Crackers. Factory direct wholesale rates, secure packaging, and fast pan-India delivery.",
  keywords: [
    "ATM Crackers",
    "Sivakasi crackers",
    "fireworks online",
    "Diwali crackers",
    "sparklers",
    "fancy shots",
    "combo packs",
    "flower pots",
  ],
  openGraph: {
    title: "ATM Crackers — Premium Sivakasi Fireworks",
    description: "Premium Sivakasi crackers for unforgettable celebrations.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-warm-white antialiased font-sans">
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
