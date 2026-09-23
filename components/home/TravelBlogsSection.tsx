"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { BLOGS_DATA } from "@/data/blogsData";
import { useApp } from "@/context/AppContext";

export default function TravelBlogsSection() {
  const { blogs } = useApp();
  const blogsList = blogs && blogs.length > 0 ? blogs : BLOGS_DATA;
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#FFA429] mb-1.5">
              Trip Preparation & Intel
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              Himalayan Guides & Packing Advice
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-xl">
              Practical advice, acclimatization tips, and packing lists curated by certified mountain captains.
            </p>
          </div>

          <Link
            href="/blogs"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-[#FFA429] transition-colors"
          >
            <span>Read All Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogsList.slice(0, 3).map((blog) => (
            <article
              key={blog.id}
              className="group bg-[#FAF7F2] rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={blog.heroImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-[#0A192F] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                    {blog.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <Clock className="w-3.5 h-3.5 text-[#FFA429]" />
                    <span>{blog.readTime}</span>
                    <span>•</span>
                    <span>{blog.date}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#FFA429] transition-colors leading-snug line-clamp-2">
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-200/60 mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {blog.author}
                </span>

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="text-xs font-bold text-[#FFA429] hover:text-[#E5921E] flex items-center gap-1"
                >
                  Read
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
