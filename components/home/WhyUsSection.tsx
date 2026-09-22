"use client";

import React from "react";
import Image from "next/image";
import { 
  ShieldCheck, 
  HeartHandshake, 
  Users, 
  Compass, 
  Headphones, 
  CheckCircle2,
  Award
} from "lucide-react";

export default function WhyUsSection() {
  const features = [
    {
      icon: Compass,
      title: "Explorers First, Not an OTA",
      desc: "We started as passionate travelers scouting every hidden valley on foot. Every itinerary is tested and run by our in-house team.",
    },
    {
      icon: ShieldCheck,
      title: "High-Altitude Medical Safety",
      desc: "Certified oxygen canisters, pulse oximeters, and first-aid kits on all Himalayan expeditions with strict acclimatization schedules.",
    },
    {
      icon: Users,
      title: "Vetted Small Group Batches",
      desc: "Batches capped at 12-16 travelers so everyone bonds comfortably. Verified female-friendly environment on every departure.",
    },
    {
      icon: HeartHandshake,
      title: "Handpicked Stays & Real Food",
      desc: "Zero dingy dorms. We stay at riverside wooden chalets in Jibhi, 3-star boutique hotels in Leh/Kaza, and luxury Swiss dome tents.",
    },
    {
      icon: Award,
      title: "100% Upfront Pricing",
      desc: "Zero hidden costs. Inner line permits, road tolls, driver expenses, and mentioned buffet meals are fully covered.",
    },
    {
      icon: Headphones,
      title: "24/7 Trip Captain on Ground",
      desc: "From itinerary pacing to acoustic music nights around bonfires, our trip leaders take care of all logistics so you just explore.",
    },
  ];

  return (
    <section className="py-20 bg-[#0A192F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="text-xs font-bold uppercase tracking-widest text-[#FFA429]">
              The HumTripWale Standard
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-tight text-white">
              Why 15,000+ Travelers Choose HumTripWale
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed font-normal">
              Travel isn’t just about ticking places off a map. It’s about singing around crackling bonfires, crossing snow-laden passes with a reliable team, and making friendships that outlast the journey.
            </p>

            <div className="pt-2 space-y-3">
              {[
                "100% Guaranteed Departures Once Confirmed",
                "Dedicated WhatsApp Pre-Trip Preparation Group",
                "Female-Friendly Batches with Verified Captains",
                "Zero-Leave Friday Night Weekend Escapes from Delhi",
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#FFA429] shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <a
                href="https://wa.me/919755216100?text=Hello%20HumTripWale!%20I%20want%20to%20know%20more%20about%20your%20group%20trips."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#FFA429] hover:bg-[#E5921E] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-colors"
              >
                Speak with a Trip Specialist
              </a>
            </div>
          </div>

          {/* Right Features Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0F223D] border border-white/10 p-5 rounded-2xl hover:border-white/20 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFA429] mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-white mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
