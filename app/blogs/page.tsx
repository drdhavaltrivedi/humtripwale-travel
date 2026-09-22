"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, BookOpen, Search } from "lucide-react";
import { BLOGS_DATA, BlogPost } from "@/data/blogsData";

export default function BlogsPage() {
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [query, setQuery] = useState("");

  const categories = ["All", "Travel Guides", "Adventure", "Food", "Itinerary"];

  const filtered = BLOGS_DATA.filter((b) => {
    const matchCat = selectedCat === "All" || b.category === selectedCat;
    const matchQ = b.title.toLowerCase().includes(query.toLowerCase()) || b.excerpt.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      {/* Top Banner */}
      <div className="relative bg-[#0A192F] text-white py-16 px-4 sm:px-6 lg:px-8 mb-10 overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFA429] mb-2">
            <span>Travel Intel & Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            HumTripWale Travel Guides & Stories
          </h1>
          <p className="mt-3 text-slate-300 text-sm max-w-xl mx-auto">
            Practical advice, packing essentials, and route notes curated by our certified Himalayan trip leaders.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides (Spiti, altitude, cafes)..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#FFA429]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCat === cat
                  ? "bg-[#0A192F] text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((blog) => (
            <article
              key={blog.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover-lift flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={blog.heroImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3.5 left-3.5 bg-[#0A192F]/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    {blog.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <Clock className="w-3.5 h-3.5 text-[#FFA429]" />
                    <span>{blog.readTime}</span>
                    <span>•</span>
                    <span>{blog.date}</span>
                  </div>

                  <h2 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#FFA429] transition-colors leading-snug line-clamp-2">
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h2>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {blog.author}
                </span>

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="text-xs font-bold text-[#FFA429] hover:text-[#E5921E] flex items-center gap-1 group-hover:underline"
                >
                  Read Guide
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
