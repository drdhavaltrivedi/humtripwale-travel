"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Users, ArrowRight, MapPin, Clock } from "lucide-react";
import { TOURS_DATA } from "@/data/toursData";

export default function UpcomingDepartures() {
  const departures = [
    {
      tour: TOURS_DATA.find((t) => t.id === "spiti-full-circuit")!,
      date: "12 Oct 2026",
      seatsLeft: 4,
      batchTag: "Limited Seats",
      startingFrom: "Delhi (Majnu Ka Tila)",
      routeSummary: "Delhi - Narkanda - Chitkul - Kaza - Chandratal - Manali",
    },
    {
      tour: TOURS_DATA.find((t) => t.id === "jibhi-tirthan-weekend")!,
      date: "Every Friday",
      seatsLeft: 6,
      batchTag: "Weekend Special",
      startingFrom: "Delhi ISBT / Majnu Ka Tila",
      routeSummary: "Delhi - Jibhi - Jalori Pass - Serolsar Lake - Tirthan",
    },
    {
      tour: TOURS_DATA.find((t) => t.id === "ladakh-road-trip")!,
      date: "15 Oct 2026",
      seatsLeft: 3,
      batchTag: "Umling La Batch",
      startingFrom: "Leh Airport Hub",
      routeSummary: "Leh - Nubra - Pangong Tso - Hanle - Umling La",
    },
    {
      tour: TOURS_DATA.find((t) => t.id === "bali-tropical-odyssey")!,
      date: "15 Oct 2026",
      seatsLeft: 5,
      batchTag: "International Villa",
      startingFrom: "Denpasar (DPS) Airport",
      routeSummary: "Ubud - Nusa Penida - Seminyak - Uluwatu",
    },
  ];

  return (
    <section className="py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#FFA429] mb-1.5">
              Fixed Batches & Departures
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              Upcoming Group Departures
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-xl">
              Travel with vetted like-minded travelers. Led by certified HumTripWale captains with guaranteed departure dates.
            </p>
          </div>

          <Link
            href="/tours?category=Group"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-[#FFA429] transition-colors"
          >
            <span>View All Departure Dates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Departure Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departures.map(({ tour, date, seatsLeft, batchTag, startingFrom, routeSummary }) => (
            <div
              key={tour.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={tour.heroImage}
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#0A192F] text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {batchTag}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-[#FFA429] text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                    {seatsLeft} Seats Left
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-900 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#FFA429]" />
                      {date}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {tour.duration}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900 line-clamp-2 leading-snug hover:text-[#FFA429] transition-colors">
                    <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
                  </h3>

                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    Route: {routeSummary}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1">
                    <MapPin className="w-3 h-3 text-[#FFA429] shrink-0" />
                    <span className="truncate">From {startingFrom}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 pt-3 border-t border-slate-100 mt-2 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Starting Price</div>
                  <div className="text-base font-bold text-slate-900">
                    ₹{tour.discountedPrice.toLocaleString("en-IN")}{" "}
                    <span className="text-xs font-normal text-slate-400 line-through">
                      ₹{tour.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/booking/${tour.id}?date=${encodeURIComponent(date)}`}
                  className="bg-[#0A192F] hover:bg-[#FFA429] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
                >
                  Reserve
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
