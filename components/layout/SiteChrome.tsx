"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuickInquiryWidget from "@/components/common/QuickInquiryWidget";

// Routes that are not the consumer marketing site — internal staff console
// and bare auth screens — should never show the customer nav/footer/wishlist
// widget. They render their own dedicated chrome (or none at all).
const BARE_ROUTE_PREFIXES = ["/admin", "/login", "/signup"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBareRoute = BARE_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isBareRoute) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <QuickInquiryWidget />
    </>
  );
}
