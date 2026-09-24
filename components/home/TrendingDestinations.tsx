"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { DESTINATIONS_DATA } from "@/data/destinationsData";
import { useApp } from "@/context/AppContext";

export default function TrendingDestinations() {
  const { destinations } = useApp();
  const destinationsList = destinations && destinations.length > 0 ? destinations : DESTINATIONS_DATA;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-widest text-[#FFA429] mb-1.5">
            Top Himalayan & Coastal Circuits
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Trending Destinations
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            From the high mountain monasteries of Spiti to the tropical beaches of Bali, choose your next journey.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinationsList.map((dest, idx) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className={`group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all block ${
                idx === 0 || idx === 3 ? "sm:col-span-2 lg:col-span-2 h-80" : "h-80"
              }`}
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Solid dark contrast overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />

              {/* Badges and details */}
              <div className="absolute top-4 left-4">
                <span className="bg-[#0A192F] text-white text-xs font-semibold px-3 py-1 rounded-md">
                  {dest.tourCount} Curated Tours
                </span>
              </div>

              <div className="absolute top-4 right-4 bg-white/20 group-hover:bg-[#FFA429] w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="text-xs text-slate-200 font-semibold tracking-wider uppercase mb-1">
                  {dest.idealDuration} • Best: {dest.bestTime}
                </div>
                <h3 className="font-serif text-2xl font-bold tracking-tight mb-1 text-white group-hover:text-[#FFA429] transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-200 line-clamp-2 font-normal">
                  {dest.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
