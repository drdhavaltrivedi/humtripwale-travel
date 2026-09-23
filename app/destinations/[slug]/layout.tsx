import type { Metadata } from "next";
import { DESTINATIONS_DATA } from "@/data/destinationsData";
import { absoluteUrl } from "@/lib/seo";

function getDestination(slug: string) {
  return DESTINATIONS_DATA.find((d) => d.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) {
    return { title: "Destination Not Found" };
  }

  const title = `${destination.name} Travel Guide — Best Time, Tours & Attractions`;
  const description = destination.tagline || destination.description;
  const url = absoluteUrl(`/destinations/${destination.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images: [{ url: destination.image, width: 1200, height: 630, alt: destination.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [destination.image],
    },
  };
}

export default async function DestinationDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestination(slug);

  if (!destination) {
    return <>{children}</>;
  }

  const destUrl = absoluteUrl(`/destinations/${destination.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.description,
    image: destination.image,
    url: destUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Destinations", item: absoluteUrl("/destinations") },
      { "@type": "ListItem", position: 3, name: destination.name, item: destUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
