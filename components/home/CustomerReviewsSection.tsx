"use client";

import React from "react";
import Image from "next/image";
import { Star, CheckCircle2, Quote } from "lucide-react";
import { REVIEWS_DATA } from "@/data/reviewsData";

export default function CustomerReviewsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-[#FFA429] mb-1.5">
            Verified Traveler Reviews
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Real Stories From Real Batches
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Rated 4.9/5 stars across Google, Tripadvisor & Instagram by solo travelers and group crews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF7F2] p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-sm transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 text-amber-500 fill-amber-500"
                      />
                    ))}
                  </div>
                  <Quote className="w-4 h-4 text-slate-300" />
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-300 shrink-0">
                  <Image
                    src={rev.avatar}
                    alt={rev.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {rev.author}
                    </span>
                    {rev.verified && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {rev.tripName} • {rev.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
