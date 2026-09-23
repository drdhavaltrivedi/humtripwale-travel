import type { Metadata } from "next";
import { TOURS_DATA } from "@/data/toursData";
import { fetchToursFromDb } from "@/lib/supabaseService";
import { supabase } from "@/lib/supabaseClient";
import { absoluteUrl } from "@/lib/seo";

async function getTour(slug: string) {
  const live = await fetchToursFromDb().catch(() => []);
  const pool = live.length > 0 ? live : TOURS_DATA;
  return pool.find((t) => t.slug === slug) || TOURS_DATA.find((t) => t.slug === slug);
}

async function getReviews(tourTitle: string) {
  const { data } = await supabase.from("reviews").select("*").eq("tour_title", tourTitle).limit(10);
  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug);

  if (!tour) {
    return { title: "Tour Not Found" };
  }

  // Admin-set SEO Title/Description (from the CMS "SEO & Structured Data" panel)
  // take priority; otherwise auto-generate from the tour's own copy.
  const title = tour.seoTitle?.trim() || `${tour.title} — ${tour.duration} ${tour.destination} Package`;
  const description =
    tour.seoDescription?.trim() ||
    tour.tagline ||
    `Book ${tour.title}, a ${tour.duration} ${tour.category} trip to ${tour.destination} starting from ₹${tour.discountedPrice.toLocaleString("en-IN")}.`;
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
  const reviews = tour ? await getReviews(tour.title) : [];

  if (!tour) {
    return <>{children}</>;
  }

  const tourUrl = absoluteUrl(`/tours/${tour.slug}`);

  const touristTripJsonLd = {
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
      url: tourUrl,
    },
    aggregateRating: tour.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: tour.rating,
          reviewCount: tour.reviewCount || 1,
        }
      : undefined,
    review: reviews.length > 0
      ? reviews.map((r) => ({
          "@type": "Review",
          author: { "@type": "Person", name: r.author },
          reviewRating: { "@type": "Rating", ratingValue: r.rating },
          reviewBody: r.comment,
          datePublished: r.date,
        }))
      : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Tours", item: absoluteUrl("/tours") },
      { "@type": "ListItem", position: 3, name: tour.title, item: tourUrl },
    ],
  };

  const faqJsonLd =
    tour.faqs && tour.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tour.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      {children}
    </>
  );
}
