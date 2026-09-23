"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, ArrowLeft, Share2 } from "lucide-react";
import { BLOGS_DATA } from "@/data/blogsData";
import { useApp } from "@/context/AppContext";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { showToast, blogs } = useApp();

  const blogsList = blogs && blogs.length > 0 ? blogs : BLOGS_DATA;
  const blog = blogsList.find((b) => b.slug === slug || b.id === slug);

  if (!blog) {
    return notFound();
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </Link>

        {/* Article Header */}
        <header className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFA429] text-white text-xs font-bold px-3 py-1 rounded-full">
              {blog.category}
            </span>
            <span className="text-xs text-slate-500">• {blog.readTime}</span>
            <span className="text-xs text-slate-500">• {blog.date}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center justify-between border-y border-slate-200 py-3 text-xs text-slate-600">
            <span>Written by <strong className="text-slate-900">{blog.author}</strong></span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-slate-900"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Article</span>
            </button>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-lg mb-10">
          <Image
            src={blog.heroImage}
            alt={blog.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
          {blog.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          {/* CTA Box inside Article */}
          <div className="mt-10 p-6 bg-[#0A192F] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-amber-300 font-bold text-xs uppercase tracking-wider">
                Experience It Live
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                Join our upcoming fixed departure
              </h3>
            </div>
            <Link
              href="/tours"
              className="bg-[#FFA429] hover:bg-[#E5921E] text-white px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-colors shadow"
            >
              Explore Departure Dates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
