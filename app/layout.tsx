import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

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

const DEFAULT_TITLE = "HumTripWale | Premium Travel Experience Platform";
const DEFAULT_DESCRIPTION =
  "Curated luxury and group travel experiences across Spiti, Ladakh, Kashmir, Himachal, Goa, Rajasthan, Thailand, and Bali.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "HumTripWale",
    "Spiti Valley Trip",
    "Ladakh Road Trip",
    "Group Trips India",
    "Kashmir Tour Packages",
    "Himachal Backpacking",
    "Luxury Holidays",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  telephone: "+91-97552-16100",
  email: "contact@humtripwale.com",
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900 selection:bg-amber-100 selection:text-amber-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AuthProvider>
          <AppProvider>
            <SiteChrome>{children}</SiteChrome>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
