import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tour Packages — Himalayan Road Trips, International Getaways & Group Tours",
  description:
    "Browse curated tour packages across Spiti, Ladakh, Himachal, Kashmir, Goa, Rajasthan, Bali, and Thailand. Filter by budget, duration, difficulty, and trip type.",
  alternates: { canonical: absoluteUrl("/tours") },
  openGraph: {
    title: "Tour Packages | HumTripWale",
    description: "Curated group trips and road expeditions across India and international destinations.",
    url: absoluteUrl("/tours"),
  },
};

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
