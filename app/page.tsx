import HeroSection from "@/components/home/HeroSection";
import UpcomingDepartures from "@/components/home/UpcomingDepartures";
import TrendingDestinations from "@/components/home/TrendingDestinations";
import FeaturedTours from "@/components/home/FeaturedTours";
import WhyUsSection from "@/components/home/WhyUsSection";
import CustomerReviewsSection from "@/components/home/CustomerReviewsSection";
import InstagramWall from "@/components/home/InstagramWall";
import TravelBlogsSection from "@/components/home/TravelBlogsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* 1. Full Screen Immersive Hero Banner & Search Engine */}
      <HeroSection />

      {/* 2. Upcoming Fixed Group Departures & Countdowns */}
      <UpcomingDepartures />

      {/* 3. Trending Curated Circuits (Spiti, Ladakh, Kashmir, Himachal, Bali, etc.) */}
      <TrendingDestinations />

      {/* 4. Filterable Featured Experiences & Bestsellers */}
      <FeaturedTours />

      {/* 5. Why HumTripWale: High Altitude Safety, Curated Micro-groups, Handpicked Stays */}
      <WhyUsSection />

      {/* 6. Customer Testimonials & Verified Ratings */}
      <CustomerReviewsSection />

      {/* 7. Instagram Community Wall */}
      <InstagramWall />

      {/* 8. Travel Blogs, Guides & Packing Tips */}
      <TravelBlogsSection />
    </div>
  );
}
