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
    default: "Singam Crackers — Premium Sivakasi Fireworks",
    template: "%s | Singam Crackers",
  },
  description:
    "Shop premium Sivakasi crackers and fireworks online. Factory direct quality, secure packaging, and fast delivery. One-sound crackers, fancy shots, sparklers, combo packs and more.",
  keywords: [
    "Sivakasi crackers",
    "fireworks online",
    "Diwali crackers",
    "sparklers",
    "fancy shots",
    "combo packs",
    "flower pots",
    "Singam Crackers",
  ],
  openGraph: {
    title: "Singam Crackers — Premium Sivakasi Fireworks",
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
