"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  Award, 
  Send, 
  Heart
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Footer() {
  const { showToast } = useApp();
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast("Thank you for subscribing! Check your inbox for secret travel deals.");
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#071324] text-slate-300 pt-16 pb-8 border-t border-white/10 relative print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="h-10 w-auto flex items-center">
                <Image
                  src="/logo.svg"
                  alt="HumTripWale"
                  width={110}
                  height={44}
                  className="h-10 w-auto object-contain drop-shadow-sm"
                />
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              We are young travelers turned passionate explorers curating soulful group trips, Himalayan high-pass expeditions, and bespoke international holidays with zero compromise on safety and luxury.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#FFA429]" />
                <a href="tel:+919755216100" className="hover:text-white font-medium">
                  +91 97552 16100 (24/7 Helpline)
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#FFA429]" />
                <a href="mailto:info@humtripwale.com" className="hover:text-white font-medium">
                  info@humtripwale.com / bookings@humtripwale.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#FFA429]" />
                <span>Delhi NCR & Chandigarh Departure Hubs | Pan-India Tours</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#FFA429] flex items-center justify-center text-white transition-colors"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#FFA429] flex items-center justify-center text-white transition-colors"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#FFA429] flex items-center justify-center text-white transition-colors"
                title="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Top Destinations */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4 tracking-wide">
              Top Destinations
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/destinations/spiti" className="hover:text-[#FFA429] transition-colors">
                  Spiti Valley Circuit
                </Link>
              </li>
              <li>
                <Link href="/destinations/ladakh" className="hover:text-[#FFA429] transition-colors">
                  Ladakh & Umling La
                </Link>
              </li>
              <li>
                <Link href="/destinations/kashmir" className="hover:text-[#FFA429] transition-colors">
                  Kashmir & Gulmarg
                </Link>
              </li>
              <li>
                <Link href="/destinations/himachal" className="hover:text-[#FFA429] transition-colors">
                  Jibhi & Tirthan Valley
                </Link>
              </li>
              <li>
                <Link href="/destinations/himachal" className="hover:text-[#FFA429] transition-colors">
                  Manali & Kasol
                </Link>
              </li>
              <li>
                <Link href="/destinations/bali" className="hover:text-[#FFA429] transition-colors">
                  Bali Tropical Villas
                </Link>
              </li>
              <li>
                <Link href="/destinations/thailand" className="hover:text-[#FFA429] transition-colors">
                  Phuket & Krabi Islands
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/tours?category=Group" className="hover:text-[#FFA429] transition-colors">
                  Upcoming Group Trips
                </Link>
              </li>
              <li>
                <Link href="/tours?category=Weekend+Trips" className="hover:text-[#FFA429] transition-colors">
                  Friday Weekend Trips
                </Link>
              </li>
              <li>
                <Link href="/custom-trip" className="hover:text-[#FFA429] transition-colors">
                  Plan Customized Trip
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#FFA429] transition-colors">
                  My Bookings & Invoices
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-[#FFA429] transition-colors">
                  Travel Guides & Packing Lists
                </Link>
              </li>
              <li>
                <Link href="/admin?role=sales&tab=crm" className="hover:text-[#FFA429] transition-colors">
                  Sales CRM Desk (Leads & Quotes)
                </Link>
              </li>
              <li>
                <Link href="/admin?tab=cms" className="hover:text-[#FFA429] transition-colors">
                  Content CMS (Tours & Guides)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-300 transition-colors">
                  Executive Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Trust */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4 tracking-wide">
              Exclusive Travel Circle
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Get secret early-bird discounts and notifications for fixed weekend departures.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  suppressHydrationWarning
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FFA429]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bg-[#FFA429] text-white p-1.5 rounded-lg hover:bg-[#E5921E] transition-colors"
                  title="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Certified Safe Expeditions</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CreditCard className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Razorpay / PhonePe / UPI Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} HumTripWale Experiences Pvt Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/contact" className="hover:text-slate-300">
              Cancellation Policy
            </Link>
            <Link href="/contact" className="hover:text-slate-300">
              Terms & Conditions
            </Link>
            <Link href="/contact" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-slate-300">
              Safety Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
