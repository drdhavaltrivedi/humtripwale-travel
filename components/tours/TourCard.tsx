"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, 
  Star, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Users
} from "lucide-react";
import { TourPackage } from "@/data/toursData";
import { useApp } from "@/context/AppContext";

interface TourCardProps {
  tour: TourPackage;
}

export default function TourCard({ tour }: TourCardProps) {
  const { isWishlisted, toggleWishlist } = useApp();
  const wishlisted = isWishlisted(tour.id);

  const discountPercent = Math.round(
    ((tour.originalPrice - tour.discountedPrice) / tour.originalPrice) * 100
  );

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover-lift flex flex-col justify-between transition-all duration-300">
      <div>
        {/* Card Image Banner */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-900">
          <Image
            src={tour.heroImage}
            alt={tour.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Crisp photo contrast overlay */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
            {tour.isTrending && (
              <span className="bg-[#FFA429] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                Trending
              </span>
            )}
            <span className="bg-[#0A192F]/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full">
              {tour.category}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(tour.id);
            }}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#FFA429] transition-colors"
            title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                wishlisted ? "text-[#FFA429] fill-[#FFA429] hover:text-white hover:fill-white" : "text-white"
              }`}
            />
          </button>

          {/* Bottom Overlay Info on Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1.5 font-medium bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{tour.duration}</span>
            </div>

            <div className="flex items-center gap-1 font-bold bg-black/50 backdrop-blur-md px-2 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{tour.rating}</span>
              <span className="text-slate-300 text-[10px]">({tour.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Destination */}
          <div className="flex items-center gap-1 text-xs font-semibold text-[#FFA429] uppercase tracking-wider mb-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{tour.destination}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-normal">{tour.startingPoint}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#FFA429] transition-colors leading-snug line-clamp-2">
            <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
          </h3>

          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {tour.tagline}
          </p>

          {/* Highlights pills */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
            {tour.highlights.slice(0, 2).map((hl, i) => (
              <span
                key={i}
                className="inline-block bg-[#FAF7F2] text-slate-700 text-[11px] px-2.5 py-1 rounded-lg border border-slate-200/60 truncate max-w-[240px]"
              >
                ✓ {hl}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-0 mt-2 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">
              ₹{tour.discountedPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{tour.originalPrice.toLocaleString("en-IN")}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">
            Save {discountPercent}% OFF
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/tours/${tour.slug}`}
            className="text-xs font-bold text-slate-700 hover:text-[#FFA429] px-3 py-2 rounded-xl transition-colors"
          >
            Details
          </Link>
          <Link
            href={`/booking/${tour.id}`}
            className="bg-[#0A192F] hover:bg-[#FFA429] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md group-hover:shadow-lg"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
