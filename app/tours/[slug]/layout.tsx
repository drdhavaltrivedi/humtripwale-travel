import type { Metadata } from "next";
import { TOURS_DATA } from "@/data/toursData";
import { fetchToursFromDb } from "@/lib/supabaseService";
import { absoluteUrl } from "@/lib/seo";

async function getTour(slug: string) {
  const live = await fetchToursFromDb().catch(() => []);
  const pool = live.length > 0 ? live : TOURS_DATA;
  return pool.find((t) => t.slug === slug) || TOURS_DATA.find((t) => t.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug);

  if (!tour) {
    return { title: "Tour Not Found" };
  }

  const title = `${tour.title} — ${tour.duration} ${tour.destination} Package`;
  const description = tour.tagline || `Book ${tour.title}, a ${tour.duration} ${tour.category} trip to ${tour.destination} starting from ₹${tour.discountedPrice.toLocaleString("en-IN")}.`;
  const url = absoluteUrl(`/tours/${tour.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images: [{ url: tour.heroImage, width: 1200, height: 630, alt: tour.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [tour.heroImage],
    },
  };
}

export default async function TourDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTour(slug);

  const jsonLd = tour
    ? {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: tour.title,
        description: tour.tagline,
        image: [tour.heroImage, ...(tour.galleryImages || [])],
        touristType: tour.category,
        itinerary: {
          "@type": "ItemList",
          itemListElement: (tour.itinerary || []).map((day, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `Day ${day.day}: ${day.title}`,
            description: day.description,
          })),
        },
        offers: {
          "@type": "Offer",
          price: tour.discountedPrice,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: absoluteUrl(`/tours/${tour.slug}`),
        },
        aggregateRating: tour.rating
          ? {
              "@type": "AggregateRating",
              ratingValue: tour.rating,
              reviewCount: tour.reviewCount || 1,
            }
          : undefined,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      {children}
    </>
  );
}
