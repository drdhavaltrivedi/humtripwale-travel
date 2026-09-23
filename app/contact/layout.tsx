import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us — 24/7 Travel Helpline & Office Locations",
  description: "Reach HumTripWale's travel desk for bookings, custom itineraries, and 24/7 emergency trip support. Call, WhatsApp, or visit our offices.",
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
