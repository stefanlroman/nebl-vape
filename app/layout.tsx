import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AgeGateProvider } from "@/lib/age-gate";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import LoadingScreen from "@/components/LoadingScreen";
import VaporCursorTrail from "@/components/VaporCursorTrail";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEBL — 50 Geschmäcker im Nebel",
  description:
    "Einweg-Vapes und E-Liquids in 50 Geschmäckern. Verkauf ausschließlich an Personen ab 18 Jahren.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${inter.variable} ${ibmPlexMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <LoadingScreen />
        <AgeGateProvider>
          <CartProvider>
            <div className="ambient-glow" />
            <div className="noise" />
            <VaporCursorTrail />
            <Header />
            <CartDrawer />
            <main className="relative z-10">{children}</main>
            <Footer />
          </CartProvider>
        </AgeGateProvider>
      </body>
    </html>
  );
}
