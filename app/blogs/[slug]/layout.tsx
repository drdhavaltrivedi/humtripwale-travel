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

  const title = blog.seoTitle?.trim() || blog.title;
  const description = blog.seoDescription?.trim() || blog.excerpt;
  const url = absoluteUrl(`/blogs/${blog.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: [{ url: blog.heroImage, width: 1200, height: 630, alt: blog.title }],
      publishedTime: blog.date,
      authors: [blog.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

  if (!blog) {
    return <>{children}</>;
  }

  const blogUrl = absoluteUrl(`/blogs/${blog.slug}`);

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.heroImage,
    author: { "@type": "Person", name: blog.author },
    datePublished: blog.date,
    mainEntityOfPage: blogUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Guides & Blogs", item: absoluteUrl("/blogs") },
      { "@type": "ListItem", position: 3, name: blog.title, item: blogUrl },
    ],
  };

  const faqJsonLd =
    blog.faqs && blog.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: blog.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      {children}
    </>
  );
}
