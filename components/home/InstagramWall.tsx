"use client";

import React from "react";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function InstagramWall() {
  const photos = [
    {
      url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop",
      caption: "Conquering high passes in Spiti with our brave crew #HumTripWale",
      likes: "1.4k",
      comments: "82",
    },
    {
      url: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=800&auto=format&fit=crop",
      caption: "Standing proud at Umling La (19,024 ft) on world's highest road! 🏔️",
      likes: "2.8k",
      comments: "144",
    },
    {
      url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop",
      caption: "Golden hour sunset from our Dal Lake Shikara cruise in Srinagar 🌸",
      likes: "950",
      comments: "56",
    },
    {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
      caption: "Cozy wooden mornings in Jibhi by the whispering river ☕",
      likes: "1.1k",
      comments: "43",
    },
    {
      url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
      caption: "Private villa dreams & Nusa Penida cliff walks in Bali 🌴",
      likes: "3.2k",
      comments: "210",
    },
    {
      url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop",
      caption: "Catamaran yacht sails & Goan sunset vibes with the crew ⛵",
      likes: "1.8k",
      comments: "98",
    },
  ];

  return (
    <section className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#FFA429] font-bold text-xs uppercase tracking-widest mb-2">
              <InstagramIcon className="w-3.5 h-3.5" />
              Community Moments
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              Captured by Our Travelers
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Tag <span className="font-semibold text-slate-900">#HumTripWale</span> on Instagram to get featured on our live community wall.
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-[#FFA429] group"
          >
            <span>Follow @HumTripWale</span>
            <InstagramIcon className="w-4 h-4" />
          </a>
        </div>

        {/* 6 Grid Photos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {photos.map((p, idx) => (
            <div
              key={idx}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover-lift"
            >
              <Image
                src={p.url}
                alt={p.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#0A192F]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                <div className="flex justify-end">
                  <InstagramIcon className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <p className="text-[11px] line-clamp-3 text-slate-200 mb-3">
                    {p.caption}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-[#FFA429] fill-current" />
                      {p.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {p.comments}
                    </span>
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
