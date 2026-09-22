"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TOURS_DATA } from "@/data/toursData";
import TourCard from "@/components/tours/TourCard";

export default function FeaturedTours() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Curated Tours" },
    { id: "Adventure", label: "Himalayan Expeditions" },
    { id: "Weekend Trips", label: "Delhi Weekend Getaways" },
    { id: "International", label: "International Holidays" },
    { id: "Group", label: "Group Trips" },
  ];

  const filteredTours =
    activeTab === "all"
      ? TOURS_DATA.slice(0, 6)
      : TOURS_DATA.filter((t) => t.category === activeTab || (activeTab === "Adventure" && (t.destination === "Spiti" || t.destination === "Ladakh")));

  return (
    <section className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#FFA429] mb-1.5">
              Handpicked Expeditions
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              Featured Tour Packages
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-xl">
              Each package includes handpicked stays, sanitized transport, and experienced HumTripWale trip captains.
            </p>
          </div>

          <Link
            href="/tours"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-[#FFA429] transition-colors"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === cat.id
                  ? "bg-[#0A192F] text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tours Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
