import type { MetadataRoute } from "next";
import { TOURS_DATA } from "@/data/toursData";
import { BLOGS_DATA } from "@/data/blogsData";
import { DESTINATIONS_DATA } from "@/data/destinationsData";
import { fetchToursFromDb, fetchBlogsFromDb } from "@/lib/supabaseService";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600; // Regenerate hourly so newly-added CMS tours/blogs surface without a redeploy.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [liveTours, liveBlogs] = await Promise.all([
    fetchToursFromDb().catch(() => []),
    fetchBlogsFromDb().catch(() => []),
  ]);

  const tours = liveTours.length > 0 ? liveTours : TOURS_DATA;
  const blogs = liveBlogs.length > 0 ? liveBlogs : BLOGS_DATA;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/tours`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/blogs`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/destinations`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/custom-trip`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/signup`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const tourRoutes: MetadataRoute.Sitemap = tours.map((t) => ({
    url: `${SITE_URL}/tours/${t.slug}`,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${SITE_URL}/blogs/${b.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const destinationRoutes: MetadataRoute.Sitemap = DESTINATIONS_DATA.map((d) => ({
    url: `${SITE_URL}/destinations/${d.slug}`,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...tourRoutes, ...blogRoutes, ...destinationRoutes];
}
