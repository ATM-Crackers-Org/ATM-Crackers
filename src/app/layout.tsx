import type { Metadata } from "next";
import { Playfair_Display, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${plusJakarta.variable}`}
    >
      <body className="min-h-screen bg-[#FAFAF9] font-[var(--font-inter)] antialiased">
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
