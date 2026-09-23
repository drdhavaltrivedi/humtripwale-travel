import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HumTripWale | Premium Travel Experience Platform",
  description:
    "Curated luxury and group travel experiences across Spiti, Ladakh, Kashmir, Himachal, Goa, Rajasthan, Thailand, and Bali.",
  keywords: [
    "HumTripWale",
    "Spiti Valley Trip",
    "Ladakh Road Trip",
    "Group Trips India",
    "Kashmir Tour Packages",
    "Himachal Backpacking",
    "Luxury Holidays",
  ],
  icons: {
    icon: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900 selection:bg-amber-100 selection:text-amber-900">
        <AuthProvider>
          <AppProvider>
            <SiteChrome>{children}</SiteChrome>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
