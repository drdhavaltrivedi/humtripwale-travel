"use client";

import React, { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Clock, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Star, 
  Calendar, 
  Check, 
  X, 
  Bed, 
  Car, 
  Utensils, 
  Luggage, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  Heart,
  Phone,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { TOURS_DATA, TourPackage } from "@/data/toursData";
import { useApp } from "@/context/AppContext";
import TourCard from "@/components/tours/TourCard";

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { isWishlisted, toggleWishlist, showToast, tours } = useApp();

  const tour = (tours || TOURS_DATA).find((t) => t.slug === slug || t.id === slug);

  if (!tour) {
    return notFound();
  }

  // Booking state in widget
  const [selectedDate, setSelectedDate] = useState<string>(tour.departureDates[0] || "");
  const [travelers, setTravelers] = useState<number>(2);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const discountPercent = Math.round(
    ((tour.originalPrice - tour.discountedPrice) / tour.originalPrice) * 100
  );

  const wishlisted = isWishlisted(tour.id);
  const totalPrice = tour.discountedPrice * travelers;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Tour link copied to clipboard! 📋");
    }
  };

  const handleBookNow = () => {
    router.push(`/booking/${tour.id}?date=${encodeURIComponent(selectedDate)}&travelers=${travelers}`);
  };

  const similarTours = (tours || TOURS_DATA).filter(
    (t) => t.id !== tour.id && (t.destination === tour.destination || t.category === tour.category)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/tours" className="hover:text-slate-900">Tours</Link>
          <span>/</span>
          <Link href={`/destinations/${tour.destination.toLowerCase()}`} className="hover:text-slate-900">
            {tour.destination}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate">{tour.title}</span>
        </div>

        {/* Title Header with Quick Badges and Actions */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-[#FFA429] text-white text-xs font-bold px-3 py-1 rounded-full">
                {tour.category}
              </span>
              <span className="bg-[#0A192F] text-white text-xs font-medium px-3 py-1 rounded-full">
                {tour.difficulty} Grade
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-amber-100 px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{tour.rating}</span>
                <span className="text-slate-500 font-normal">({tour.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              {tour.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-light max-w-3xl">
              {tour.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start shrink-0">
            <button
              onClick={() => toggleWishlist(tour.id)}
              className="flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold hover:border-[#FFA429] transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${
                  wishlisted ? "text-[#FFA429] fill-[#FFA429]" : "text-slate-500"
                }`}
              />
              <span>{wishlisted ? "Saved" : "Save"}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold hover:border-slate-400 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Hero Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10 h-[420px] rounded-3xl overflow-hidden shadow-lg">
          <div className="md:col-span-3 relative h-full">
            <Image
              src={tour.galleryImages[activeGalleryIndex] || tour.heroImage}
              alt={tour.title}
              fill
              priority
              className="object-cover transition-all duration-500"
            />
          </div>
          <div className="hidden md:flex flex-col gap-3 h-full">
            {tour.galleryImages.slice(0, 3).map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveGalleryIndex(i)}
                className={`relative flex-1 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                  activeGalleryIndex === i ? "border-[#FFA429] scale-95" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Key Quick Specs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#FFA429] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400">Duration</div>
              <div className="text-sm font-bold text-slate-900">{tour.duration}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400">Pickup & Drop</div>
              <div className="text-sm font-bold text-slate-900 truncate max-w-[160px]">
                {tour.startingPoint}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400">Group Size</div>
              <div className="text-sm font-bold text-slate-900">{tour.groupSize}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-400">Minimum Age</div>
              <div className="text-sm font-bold text-slate-900">{tour.minAge}+ Years</div>
            </div>
          </div>
        </div>

        {/* Content Layout: Main Details (Left 8 cols) + Sticky Booking (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">
            {/* Highlights Section */}
            <section className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                Trip Highlights
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tour.highlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      ✓
                    </span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Day-by-Day Interactive Itinerary */}
            <section className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-900">
                    Detailed Day-by-Day Itinerary
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any day to expand activities, stay, and meal inclusions.
                  </p>
                </div>
                <button
                  onClick={() => setExpandedDay(expandedDay === null ? 1 : null)}
                  className="text-xs text-[#FFA429] font-semibold hover:underline"
                >
                  {expandedDay === null ? "Expand Day 1" : "Collapse"}
                </button>
              </div>

              <div className="space-y-4">
                {tour.itinerary.map((day) => {
                  const isOpen = expandedDay === day.day;
                  return (
                    <div
                      key={day.day}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedDay(isOpen ? null : day.day)}
                        className="w-full p-4 text-left flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-[#0A192F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            D{day.day}
                          </span>
                          <span className="font-bold text-sm text-slate-900">
                            {day.title}
                          </span>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-5 bg-white space-y-4 animate-in slide-in-from-top-1 duration-200">
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {day.description}
                          </p>

                          {/* Day metadata: Meals & Stay */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                            <div className="flex items-center gap-2 text-slate-700 bg-[#FAF7F2] p-2.5 rounded-xl">
                              <Utensils className="w-4 h-4 text-amber-500" />
                              <span>Meals: <strong>{day.meals}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700 bg-[#FAF7F2] p-2.5 rounded-xl">
                              <Bed className="w-4 h-4 text-blue-500" />
                              <span className="truncate">Stay: <strong>{day.stay}</strong></span>
                            </div>
                          </div>

                          {/* Activities pills */}
                          {day.activities && day.activities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {day.activities.map((act, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md"
                                >
                                  • {act}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Inclusions & Exclusions */}
            <section className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">
                What's Included & Excluded
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-700 mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Inclusions
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    {tour.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-rose-700 mb-3 flex items-center gap-2">
                    <X className="w-4 h-4" /> Exclusions
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    {tour.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Stay, Transport & Meals Breakdown */}
            <section className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Logistics & Hospitality
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-slate-200/70">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                    <Bed className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Accommodation</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tour.stayDetails.hotelType} ({tour.stayDetails.roomSharing})
                  </p>
                </div>

                <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-slate-200/70">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#FFA429] flex items-center justify-center mb-3">
                    <Car className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Mountain Transport</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tour.transportDetails}
                  </p>
                </div>

                <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-slate-200/70">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Meal Strategy</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tour.mealDetails}
                  </p>
                </div>
              </div>
            </section>

            {/* Packing List */}
            <section className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Luggage className="w-5 h-5 text-[#FFA429]" />
                What to Pack
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {tour.packingList.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-[#FAF7F2] rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFA429]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs Accordion */}
            <section className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {tour.faqs.map((faq, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        className="w-full p-4 text-left font-bold text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sticky Booking Widget (Right 4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-3xl p-7 border border-slate-200 shadow-xl space-y-6">
              {/* Pricing Header */}
              <div className="border-b border-slate-100 pb-5">
                <div className="text-xs text-slate-500 uppercase font-semibold">Special Group Price</div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-serif font-bold text-slate-900">
                    ₹{tour.discountedPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{tour.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Save {Math.round(((tour.originalPrice - tour.discountedPrice) / tour.originalPrice) * 100)}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Per person on twin/triple sharing • GST calculated at checkout
                </div>
              </div>

              {/* Form Controls: Departure Date + Travelers */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Select Departure Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FFA429]"
                  >
                    {tour.departureDates.map((date) => (
                      <option key={date} value={date}>
                        {date} (Guaranteed Departure)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Travelers Count
                    </label>
                    <span className="text-xs text-slate-500">{travelers} Person(s)</span>
                  </div>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-[#FAF7F2]">
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="px-4 py-2 text-slate-700 hover:bg-slate-200 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-sm text-slate-900">
                      {travelers}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.min(15, travelers + 1))}
                      className="px-4 py-2 text-slate-700 hover:bg-slate-200 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal preview */}
                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl flex items-center justify-between text-xs">
                  <span className="text-slate-600">Total Estimation ({travelers} travelers):</span>
                  <span className="font-bold text-base text-slate-900">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Instant Book Action */}
                <button
                  onClick={handleBookNow}
                  className="w-full bg-[#FFA429] hover:bg-[#E5921E] text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FFA429]/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <span>Proceed to Reserve</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-slate-500">
                  Instant confirmation • Pay only 20% token deposit to hold seats
                </p>
              </div>

              {/* Direct Help / WhatsApp inquiry */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">Need customization?</span>
                <a
                  href={`https://wa.me/919755216100?text=Hello%20HumTripWale!%20I%20have%20questions%20about%20${encodeURIComponent(tour.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Tours Section */}
        {similarTours.length > 0 && (
          <section className="mt-20 pt-12 border-t border-slate-200">
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-8">
              Similar Journeys You Might Love
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarTours.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
