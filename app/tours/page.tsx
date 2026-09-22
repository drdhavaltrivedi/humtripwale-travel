"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Compass, 
  Calendar, 
  DollarSign, 
  Mountain 
} from "lucide-react";
import { TOURS_DATA, TourPackage } from "@/data/toursData";
import { useApp } from "@/context/AppContext";
import TourCard from "@/components/tours/TourCard";

function ToursContent() {
  const searchParams = useSearchParams();
  const { tours } = useApp();

  // Initial params
  const initialDest = searchParams.get("destination") || "";
  const initialCat = searchParams.get("category") || "";
  const initialMonth = searchParams.get("month") || "";

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<string>(initialDest);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Available filter options
  const destinations = ["Spiti", "Ladakh", "Himachal", "Kashmir", "Bali", "Thailand", "Goa", "Rajasthan"];
  const categories = ["Domestic", "International", "Weekend Trips", "Adventure", "Honeymoon", "Family", "Group"];
  const difficulties = ["Easy", "Moderate", "Challenging"];
  const durationOptions = [
    { label: "Weekend (1-3 Days)", value: "weekend" },
    { label: "Medium (4-6 Days)", value: "medium" },
    { label: "Long (7-10 Days)", value: "long" },
  ];
  const budgetOptions = [
    { label: "Under ₹10,000", value: "under10k" },
    { label: "₹10,000 - ₹20,000", value: "10to20k" },
    { label: "₹20,000 - ₹35,000", value: "20to35k" },
    { label: "₹35,000+", value: "above35k" },
  ];

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDestination("");
    setSelectedCategory("");
    setSelectedDifficulty("");
    setSelectedDuration("");
    setSelectedBudget("");
    setSortBy("popular");
  };

  const hasActiveFilters =
    Boolean(searchQuery || selectedDestination || selectedCategory || selectedDifficulty || selectedDuration || selectedBudget);

  // Filtered & Sorted Tours
  const filteredTours = useMemo(() => {
    let result = [...(tours || TOURS_DATA)];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.highlights.some((h) => h.toLowerCase().includes(q))
      );
    }

    if (selectedDestination) {
      result = result.filter((t) => t.destination.toLowerCase() === selectedDestination.toLowerCase());
    }

    if (selectedCategory) {
      result = result.filter((t) => t.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedDifficulty) {
      result = result.filter((t) => t.difficulty === selectedDifficulty);
    }

    if (selectedDuration) {
      if (selectedDuration === "weekend") result = result.filter((t) => t.durationDays <= 3);
      if (selectedDuration === "medium") result = result.filter((t) => t.durationDays >= 4 && t.durationDays <= 6);
      if (selectedDuration === "long") result = result.filter((t) => t.durationDays >= 7);
    }

    if (selectedBudget) {
      if (selectedBudget === "under10k") result = result.filter((t) => t.discountedPrice < 10000);
      if (selectedBudget === "10to20k") result = result.filter((t) => t.discountedPrice >= 10000 && t.discountedPrice <= 20000);
      if (selectedBudget === "20to35k") result = result.filter((t) => t.discountedPrice > 20000 && t.discountedPrice <= 35000);
      if (selectedBudget === "above35k") result = result.filter((t) => t.discountedPrice > 35000);
    }

    // Sort
    if (sortBy === "priceAsc") {
      result.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortBy === "priceDesc") {
      result.sort((a, b) => b.discountedPrice - a.discountedPrice);
    } else if (sortBy === "duration") {
      result.sort((a, b) => b.durationDays - a.durationDays);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    searchQuery,
    selectedDestination,
    selectedCategory,
    selectedDifficulty,
    selectedDuration,
    selectedBudget,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      {/* Top Banner */}
      <div className="relative bg-[#0A192F] text-white py-16 px-4 sm:px-6 lg:px-8 mb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=1600&auto=format&fit=crop"
            alt="Mountains"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#FFA429] mb-2">
            <span>Curated Expeditions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            Explore All Travel Experiences
          </h1>
          <p className="mt-3 text-slate-300 text-sm max-w-xl mx-auto">
            From Spiti’s high-altitude monasteries and Ladakh’s Umling La to the pristine white beaches of Bali and royal palaces of Rajasthan.
          </p>

          {/* Quick Search inside banner */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by trip name, destination, monastery, lake..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#FFA429]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls bar: Results Count, Active Tags, Sort, Mobile Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFA429]" />
              <span>Filters ({[selectedDestination, selectedCategory, selectedDifficulty, selectedDuration, selectedBudget].filter(Boolean).length})</span>
            </button>

            <span className="text-sm font-semibold text-slate-700">
              Showing <span className="text-slate-900 font-bold">{filteredTours.length}</span> curated tours
            </span>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-[#FFA429] font-semibold hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FFA429] cursor-pointer shadow-sm"
              >
                <option value="popular">Popularity & Rating</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="duration">Longest Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Layout: Filters Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:block ${showMobileFilters ? "block" : "hidden"} space-y-6`}>
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2 font-serif font-bold text-slate-900 text-base">
                  <Filter className="w-4 h-4 text-[#FFA429]" />
                  <span>Filter Packages</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-[#FFA429] font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Destination Filter */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Destination
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedDestination("")}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                      selectedDestination === ""
                        ? "bg-[#0A192F] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    All
                  </button>
                  {destinations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDestination(selectedDestination === d ? "" : d)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                        selectedDestination === d
                          ? "bg-[#FFA429] text-white font-bold"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trip Category / Style */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Trip Style
                </label>
                <div className="space-y-1.5">
                  {categories.map((c) => (
                    <label
                      key={c}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                    >
                      <input
                        type="radio"
                        name="tripCategory"
                        checked={selectedCategory === c}
                        onChange={() => setSelectedCategory(selectedCategory === c ? "" : c)}
                        className="text-[#FFA429] focus:ring-[#FFA429] cursor-pointer"
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Budget (Per Person)
                </label>
                <div className="space-y-1.5">
                  {budgetOptions.map((b) => (
                    <label
                      key={b.value}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                    >
                      <input
                        type="radio"
                        name="budgetRange"
                        checked={selectedBudget === b.value}
                        onChange={() => setSelectedBudget(selectedBudget === b.value ? "" : b.value)}
                        className="text-[#FFA429] focus:ring-[#FFA429] cursor-pointer"
                      />
                      <span>{b.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Duration
                </label>
                <div className="space-y-1.5">
                  {durationOptions.map((dur) => (
                    <label
                      key={dur.value}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                    >
                      <input
                        type="radio"
                        name="durationOption"
                        checked={selectedDuration === dur.value}
                        onChange={() => setSelectedDuration(selectedDuration === dur.value ? "" : dur.value)}
                        className="text-[#FFA429] focus:ring-[#FFA429] cursor-pointer"
                      />
                      <span>{dur.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Difficulty
                </label>
                <div className="flex gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? "" : diff)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex-1 transition-all ${
                        selectedDifficulty === diff
                          ? "bg-[#0A192F] text-white border-[#0A192F]"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Tours Grid */}
          <main className="lg:col-span-3">
            {filteredTours.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-slate-800">
                  No expeditions matched your criteria
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting or resetting your destination or budget filters to explore other curated departures.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 bg-[#FFA429] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#E5921E] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center">Loading expeditions...</div>}>
      <ToursContent />
    </Suspense>
  );
}
