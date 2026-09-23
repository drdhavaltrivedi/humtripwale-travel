import type { Metadata } from "next";
import { BLOGS_DATA } from "@/data/blogsData";
import { fetchBlogsFromDb } from "@/lib/supabaseService";
import { absoluteUrl } from "@/lib/seo";

async function getBlog(slug: string) {
  const live = await fetchBlogsFromDb().catch(() => []);
  const pool = live.length > 0 ? live : BLOGS_DATA;
  return pool.find((b) => b.slug === slug) || BLOGS_DATA.find((b) => b.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return { title: "Article Not Found" };
  }

  const url = absoluteUrl(`/blogs/${blog.slug}`);

  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: blog.title,
      description: blog.excerpt,
      url,
      images: [{ url: blog.heroImage, width: 1200, height: 630, alt: blog.title }],
      publishedTime: blog.date,
      authors: [blog.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.heroImage],
    },
  };
}

export default async function BlogDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  const jsonLd = blog
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blog.title,
        description: blog.excerpt,
        image: blog.heroImage,
        author: { "@type": "Person", name: blog.author },
        datePublished: blog.date,
        mainEntityOfPage: absoluteUrl(`/blogs/${blog.slug}`),
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
