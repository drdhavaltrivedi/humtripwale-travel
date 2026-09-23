import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Plan a Custom Trip — Tailored Itineraries for Families, Couples & Groups",
  description: "Tell us your destination, dates, and budget — our travel desk builds a personalized itinerary and sends a quote within hours.",
  alternates: { canonical: absoluteUrl("/custom-trip") },
};

export default function CustomTripLayout({ children }: { children: React.ReactNode }) {
  return children;
}
