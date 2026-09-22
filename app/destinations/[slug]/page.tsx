"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Compass, 
  Sun, 
  Trees, 
  Mountain,
  Anchor,
  Shield,
  CableCar
} from "lucide-react";
import { DESTINATIONS_DATA } from "@/data/destinationsData";
import { TOURS_DATA } from "@/data/toursData";
import TourCard from "@/components/tours/TourCard";

export default function DestinationPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const dest = DESTINATIONS_DATA.find((d) => d.slug.toLowerCase() === slug?.toLowerCase());

  if (!dest) {
    return notFound();
  }

  // Filter tours for this destination
  const destTours = TOURS_DATA.filter(
    (t) => t.destination.toLowerCase() === dest.id.toLowerCase() || dest.name.toLowerCase().includes(t.destination.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-20 pb-20">
      {/* Hero Banner */}
      <div className="relative h-[480px] w-full bg-[#071324] overflow-hidden flex items-center justify-center">
        <Image
          src={dest.image}
          alt={dest.name}
          fill
          priority
          className="object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-[#071324]/75" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 text-white">
          <div className="inline-flex items-center gap-2 bg-[#0A192F] border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold text-slate-200 uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#FFA429]" />
            Destination Guide
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight mb-3">
            {dest.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-200 font-light max-w-2xl mx-auto">
            {dest.tagline}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15">
              Best Time: <strong className="text-amber-300">{dest.bestTime}</strong>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15">
              Ideal Duration: <strong className="text-amber-300">{dest.idealDuration}</strong>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15">
              Avg Budget: <strong className="text-amber-300">{dest.avgBudget}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* About Section */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Discovering {dest.name}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            {dest.description}
          </p>
        </section>

        {/* Top Attractions Grid */}
        <section>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold text-[#FFA429] tracking-widest">
              Must-Experience
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">
              Iconic Highlights in {dest.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dest.attractions.map((att, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover-lift"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FFA429] flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">
                  {att.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {att.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Curated Tours for this Destination */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase font-bold text-[#FFA429] tracking-widest">
                Upcoming Departures
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">
                Curated Packages in {dest.name}
              </h2>
            </div>
            <Link
              href={`/custom-trip`}
              className="text-xs font-bold text-[#FFA429] hover:underline mt-2 sm:mt-0"
            >
              Need a Private Custom Itinerary? →
            </Link>
          </div>

          {destTours.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <p className="text-slate-600 text-sm">
                We organize bespoke private departures for {dest.name}. Click below to customize your dates.
              </p>
              <Link
                href="/custom-trip"
                className="mt-4 inline-block bg-[#FFA429] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow"
              >
                Plan Custom Trip for {dest.name}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destTours.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
