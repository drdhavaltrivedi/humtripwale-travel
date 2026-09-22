"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Star, 
  Compass,
  CheckCircle2
} from "lucide-react";

export default function HeroSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (category) params.set("category", category);
    if (month) params.set("month", month);
    router.push(`/tours?${params.toString()}`);
  };

  const handleTabClick = (tabKey: string, defaultCat: string) => {
    setActiveTab(tabKey);
    setCategory(defaultCat);
  };

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center pt-24 pb-16 bg-[#071324] overflow-hidden">
      {/* Real Background Image with Crisp Dark Contrast */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2000&auto=format&fit=crop"
          alt="HumTripWale Expeditions"
          fill
          priority
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-[#071324]/65" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-4">
        {/* Real Brand Badge */}
        <div className="inline-flex items-center gap-2 bg-[#0A192F] border border-white/15 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-200 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#FFA429]" />
          <span>Verified Group Departures & Himalayan Expeditions</span>
        </div>

        {/* Hero Title - Solid Crisp Typography */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Explore India & Beyond With <br />
          <span className="text-[#FFA429]">Passionate Travelers</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed">
          Curated group trips and road expeditions across Spiti Valley, Ladakh & Umling La, Jibhi, Kashmir, Bali, and Thailand.
        </p>

        {/* Production-grade Search Engine with Integrated Category Tabs */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-[#0A192F]/95 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-left">
            {/* Integrated Category Tabs Header */}
            <div className="flex items-center gap-1 border-b border-white/10 bg-[#071324]/90 px-3 pt-2.5 overflow-x-auto no-scrollbar">
              {[
                { id: "all", label: "All Experiences", cat: "" },
                { id: "group", label: "Group Trips", cat: "Group" },
                { id: "weekend", label: "Weekend Escapes", cat: "Weekend Trips" },
                { id: "adventure", label: "Himalayan Expeditions", cat: "Adventure" },
                { id: "international", label: "International", cat: "International" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id, tab.cat)}
                  className={`whitespace-nowrap px-4 py-2.5 text-xs font-bold transition-all relative rounded-t-xl ${
                    activeTab === tab.id
                      ? "text-white bg-[#0A192F] border-t border-x border-white/15 -mb-px shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {activeTab === tab.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFA429]" />
                    )}
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Inputs Bar */}
            <div className="p-4 sm:p-5">
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Destination */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 hover:border-white/20 transition-colors">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FFA429]" />
                    Where To?
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0A192F] text-white">All Destinations</option>
                    <option value="Spiti" className="bg-[#0A192F] text-white">Spiti Valley</option>
                    <option value="Ladakh" className="bg-[#0A192F] text-white">Ladakh & Umling La</option>
                    <option value="Himachal" className="bg-[#0A192F] text-white">Himachal (Jibhi/Manali)</option>
                    <option value="Kashmir" className="bg-[#0A192F] text-white">Kashmir Paradise</option>
                    <option value="Bali" className="bg-[#0A192F] text-white">Bali (International)</option>
                    <option value="Thailand" className="bg-[#0A192F] text-white">Thailand (International)</option>
                    <option value="Goa" className="bg-[#0A192F] text-white">Goa Crew Escape</option>
                    <option value="Rajasthan" className="bg-[#0A192F] text-white">Royal Rajasthan</option>
                  </select>
                </div>

                {/* Trip Style */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 hover:border-white/20 transition-colors">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    <Compass className="w-3.5 h-3.5 text-[#FFA429]" />
                    Trip Experience
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0A192F] text-white">All Styles</option>
                    <option value="Group" className="bg-[#0A192F] text-white">Group Trips</option>
                    <option value="Weekend Trips" className="bg-[#0A192F] text-white">Weekend Trips (Every Friday)</option>
                    <option value="Adventure" className="bg-[#0A192F] text-white">Adventure Expeditions</option>
                    <option value="International" className="bg-[#0A192F] text-white">International Holidays</option>
                    <option value="Honeymoon" className="bg-[#0A192F] text-white">Honeymoon & Romantic</option>
                    <option value="Family" className="bg-[#0A192F] text-white">Family Leisure</option>
                  </select>
                </div>

                {/* Month */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 hover:border-white/20 transition-colors">
                  <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#FFA429]" />
                    When?
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0A192F] text-white">Any Month</option>
                    <option value="October" className="bg-[#0A192F] text-white">October 2026</option>
                    <option value="November" className="bg-[#0A192F] text-white">November 2026</option>
                    <option value="December" className="bg-[#0A192F] text-white">December 2026</option>
                    <option value="January" className="bg-[#0A192F] text-white">January 2027</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="flex items-center">
                  <button
                    type="submit"
                    className="w-full h-full min-h-[52px] bg-[#FFA429] hover:bg-[#E5921E] text-white rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Experiences</span>
                  </button>
                </div>
              </form>

              {/* Quick shortcuts */}
              <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="text-slate-400 text-[11px] font-semibold">Trending Now:</span>
                <button
                  type="button"
                  onClick={() => router.push("/tours?destination=Spiti")}
                  className="bg-white/5 hover:bg-white/15 border border-white/10 px-2.5 py-1 rounded-lg text-slate-200 transition-colors flex items-center gap-1"
                >
                  <span>Spiti Valley</span>
                  <span className="text-[#FFA429] font-semibold">₹19,999</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/tours?destination=Ladakh")}
                  className="bg-white/5 hover:bg-white/15 border border-white/10 px-2.5 py-1 rounded-lg text-slate-200 transition-colors flex items-center gap-1"
                >
                  <span>Ladakh Road Trip</span>
                  <span className="text-[#FFA429] font-semibold">₹25,999</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/tours?category=Weekend+Trips")}
                  className="bg-white/5 hover:bg-white/15 border border-white/10 px-2.5 py-1 rounded-lg text-slate-200 transition-colors flex items-center gap-1"
                >
                  <span>Jibhi (Every Fri)</span>
                  <span className="text-emerald-400 font-semibold">₹5,499</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/tours?destination=Bali")}
                  className="bg-white/5 hover:bg-white/15 border border-white/10 px-2.5 py-1 rounded-lg text-slate-200 transition-colors flex items-center gap-1"
                >
                  <span>Bali Private Villa</span>
                  <span className="text-[#FFA429] font-semibold">₹44,999</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Real Trust Bar with Glass Finish */}
        <div className="mt-10 bg-[#071324]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 max-w-4xl mx-auto shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFA429]/15 border border-[#FFA429]/30 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#FFA429]" />
              </div>
              <div className="text-left">
                <div className="font-bold text-base leading-tight text-white">15,000+</div>
                <div className="text-[11px] text-slate-400 font-medium">Happy Travelers</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <div className="text-left">
                <div className="font-bold text-base leading-tight text-white">4.92 / 5.0</div>
                <div className="text-[11px] text-slate-400 font-medium">Verified Reviews</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <div className="font-bold text-base leading-tight text-white">100% Guaranteed</div>
                <div className="text-[11px] text-slate-400 font-medium">Trip Departures</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="font-bold text-base leading-tight text-white">Trip Captains</div>
                <div className="text-[11px] text-slate-400 font-medium">On Every Departure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
