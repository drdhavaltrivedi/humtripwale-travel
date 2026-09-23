import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Travel Guides & Blogs — Itineraries, Packing Lists & Budget Travel Tips",
  description:
    "Travel guides, day-by-day itineraries, food recommendations, and budget travel tips for Spiti, Ladakh, Himachal, Kashmir, and beyond.",
  alternates: { canonical: absoluteUrl("/blogs") },
  openGraph: {
    title: "Travel Guides & Blogs | HumTripWale",
    description: "Itineraries, packing lists, and travel tips from our expedition teams.",
    url: absoluteUrl("/blogs"),
  },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
