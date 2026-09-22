import { createClient } from "@supabase/supabase-js";
import { TOURS_DATA } from "../data/toursData";
import { BLOGS_DATA } from "../data/blogsData";
import { REVIEWS_DATA } from "../data/reviewsData";

const supabaseUrl = "https://cpuozescydngqeopjncm.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdW96ZXNjeWRuZ3Flb3BqbmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzgzOTYsImV4cCI6MjEwNTY1NDM5Nn0.wQ7Wp_CUeFdV2v3ZNcrtE_jf4eIJTyYrOBkJ2yo33uU";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log("=== Seeding Supabase Database for HumTripWale ===");

  // 1. Seed Tours
  console.log(`Seeding ${TOURS_DATA.length} tours...`);
  for (const t of TOURS_DATA) {
    const { error: tourError } = await supabase.from("tours").upsert({
      id: t.id,
      slug: t.slug,
      title: t.title,
      tagline: t.tagline,
      destination: t.destination,
      category: t.category,
      duration: t.duration,
      duration_days: t.durationDays,
      starting_point: t.startingPoint,
      ending_point: t.endingPoint,
      min_age: t.minAge,
      group_size: t.groupSize,
      difficulty: t.difficulty,
      original_price: t.originalPrice,
      discounted_price: t.discountedPrice,
      rating: t.rating || 4.9,
      review_count: t.reviewCount || 25,
      hero_image: t.heroImage,
      gallery_images: t.galleryImages || [],
      departure_dates: t.departureDates || [],
      highlights: t.highlights || [],
      inclusions: t.inclusions || [],
      exclusions: t.exclusions || [],
      stay_details: t.stayDetails || {},
      transport_details: t.transportDetails || "",
      meal_details: t.mealDetails || "",
      packing_list: t.packingList || [],
      faqs: t.faqs || [],
      is_featured: Boolean(t.isFeatured),
      is_trending: Boolean(t.isTrending),
    });

    if (tourError) {
      console.error(`Error inserting tour ${t.id}:`, tourError.message);
      continue;
    }

    if (t.itinerary && t.itinerary.length > 0) {
      await supabase.from("itinerary_days").delete().eq("tour_id", t.id);
      const days = t.itinerary.map((d) => ({
        tour_id: t.id,
        day: d.day,
        title: d.title,
        description: d.description,
        meals: d.meals || "",
        stay: d.stay || "",
        activities: d.activities || [],
      }));

      const { error: daysError } = await supabase.from("itinerary_days").insert(days);
      if (daysError) {
        console.error(`Error inserting days for tour ${t.id}:`, daysError.message);
      }
    }
  }
  console.log("✓ Tours & Itineraries seeded.");

  // 2. Seed Bookings
  const bookings = [
    {
      id: "BK-8841",
      tour_id: "spiti-full-circuit",
      tour_title: "Full Circuit Spiti – The Trans-Himalayan Odyssey",
      departure_date: "15 Oct 2026",
      travelers_count: 2,
      traveler_names: ["Aman Sharma", "Pooja Sharma"],
      contact_email: "aman.traveler@example.com",
      contact_phone: "+91 97552 16100",
      base_price: 39998,
      add_ons_total: 4000,
      discount_amount: 3999,
      total_amount: 39999,
      payment_status: "Confirmed",
      payment_id: "pay_HTW_99812401",
      invoice_number: "INV-2026-0891",
    },
    {
      id: "BK-8842",
      tour_id: "ladakh-road-trip",
      tour_title: "Ladakh High Passes & Pangong Tso Odyssey",
      departure_date: "25 Oct 2026",
      travelers_count: 1,
      traveler_names: ["Vikramaditya Chauhan"],
      contact_email: "vikram.c@gmail.com",
      contact_phone: "+91 98110 55442",
      base_price: 25999,
      add_ons_total: 6000,
      discount_amount: 2599,
      total_amount: 29400,
      payment_status: "Confirmed",
      payment_id: "pay_HTW_99812488",
      invoice_number: "INV-2026-0892",
    },
  ];

  for (const b of bookings) {
    const { error: bError } = await supabase.from("bookings").upsert(b);
    if (bError) console.error("Error inserting booking:", bError.message);
  }
  console.log("✓ Bookings seeded.");

  // 3. Seed Blogs
  for (const blog of BLOGS_DATA) {
    const { error: blogError } = await supabase.from("blogs").upsert({
      id: blog.id,
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content.join("\n\n"),
      cover_image: blog.heroImage,
      author: blog.author,
      published_date: blog.date,
      read_time: blog.readTime,
      category: blog.category,
      tags: [blog.category],
    });
    if (blogError) console.error("Error inserting blog:", blogError.message);
  }
  console.log("✓ Blogs seeded.");

  // 4. Seed Reviews
  for (const rev of REVIEWS_DATA) {
    const { error: revError } = await supabase.from("reviews").upsert({
      id: rev.id,
      author: rev.author,
      avatar: rev.avatar,
      tour_title: rev.tripName,
      rating: rev.rating,
      comment: rev.comment,
      date: rev.date,
      verified: rev.verified,
    });
    if (revError) console.error("Error inserting review:", revError.message);
  }
  console.log("✓ Reviews seeded.");

  console.log("=== All Supabase data successfully seeded! ===");
}

main().catch(console.error);
