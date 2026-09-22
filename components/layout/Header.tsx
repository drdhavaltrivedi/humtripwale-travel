"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Heart, 
  User, 
  Menu, 
  X, 
  Phone, 
  ChevronDown, 
  ShieldCheck,
  Plane,
  Briefcase,
  LayoutDashboard
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Header() {
  const pathname = usePathname();
  const { wishlist, user } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toursDropdownOpen, setToursDropdownOpen] = useState(false);
  const [destinationsDropdownOpen, setDestinationsDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tourCategories = [
    { name: "All Tours", href: "/tours", desc: "Browse full collection" },
    { name: "Group Trips", href: "/tours?category=Group", desc: "Fixed departures with lively crews" },
    { name: "Weekend Trips", href: "/tours?category=Weekend+Trips", desc: "Zero-leave Friday departures" },
    { name: "Adventure Expeditions", href: "/tours?category=Adventure", desc: "Spiti & Ladakh mountain passes" },
    { name: "International Holidays", href: "/tours?category=International", desc: "Bali, Thailand & beyond" },
    { name: "Family & Honeymoon", href: "/tours?category=Honeymoon", desc: "Curated luxury & private stays" },
  ];

  const destinationItems = [
    { name: "Spiti Valley", href: "/destinations/spiti", state: "Himachal Pradesh" },
    { name: "Ladakh", href: "/destinations/ladakh", state: "High Passes & Lakes" },
    { name: "Kashmir", href: "/destinations/kashmir", state: "Paradise on Earth" },
    { name: "Himachal (Jibhi/Manali)", href: "/destinations/himachal", state: "Valley Escapes" },
    { name: "Bali", href: "/destinations/bali", state: "Villas & Island Hopping" },
    { name: "Thailand", href: "/destinations/thailand", state: "Phuket & Krabi" },
    { name: "Goa", href: "/destinations/goa", state: "Private Crew Villas" },
    { name: "Rajasthan", href: "/destinations/rajasthan", state: "Palaces & Desert Dunes" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0A192F] shadow-xl py-3 border-b border-white/10"
          : "bg-[#0A192F] py-4 border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="h-10 w-auto flex items-center">
            <Image 
              src="/logo.svg" 
              alt="HumTripWale" 
              width={105} 
              height={42} 
              className="h-10 w-auto object-contain drop-shadow-sm group-hover:opacity-95 transition-opacity"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {/* Tours Mega Menu Trigger */}
          <div 
            className="relative"
            onMouseEnter={() => setToursDropdownOpen(true)}
            onMouseLeave={() => setToursDropdownOpen(false)}
          >
            <button
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                pathname.startsWith("/tours") ? "text-[#FFA429]" : "text-slate-100 hover:text-[#FFA429]"
              }`}
            >
              <span>Tours</span>
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />
            </button>

            {toursDropdownOpen && (
              <div className="absolute top-full left-0 w-72 bg-[#0F223D] border border-white/10 shadow-2xl rounded-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 mb-1">
                  Trip Categories
                </div>
                {tourCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setToursDropdownOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="text-sm font-medium text-white group-hover:text-[#FFA429]">
                      {cat.name}
                    </div>
                    <div className="text-xs text-slate-400">{cat.desc}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Destinations Dropdown Trigger */}
          <div 
            className="relative"
            onMouseEnter={() => setDestinationsDropdownOpen(true)}
            onMouseLeave={() => setDestinationsDropdownOpen(false)}
          >
            <button
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                pathname.startsWith("/destinations") ? "text-[#FFA429]" : "text-slate-100 hover:text-[#FFA429]"
              }`}
            >
              <span>Destinations</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {destinationsDropdownOpen && (
              <div className="absolute top-full -left-12 w-80 bg-[#0F223D] border border-white/10 shadow-2xl rounded-2xl p-3 grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                  Curated Regions
                </div>
                {destinationItems.map((dest) => (
                  <Link
                    key={dest.name}
                    href={dest.href}
                    onClick={() => setDestinationsDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-sm font-medium text-white group-hover:text-[#FFA429]">
                      {dest.name}
                    </span>
                    <span className="text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded font-medium">
                      {dest.state}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/tours?category=Weekend+Trips"
            className="px-3 py-2 text-sm font-medium text-slate-100 hover:text-[#FFA429] transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Weekend Trips</span>
            <span className="bg-[#FFA429]/20 text-[#FFA429] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Every Fri
            </span>
          </Link>

          <Link
            href="/custom-trip"
            className="px-3 py-2 text-sm font-medium text-slate-100 hover:text-[#FFA429] transition-colors whitespace-nowrap"
          >
            Custom Trips
          </Link>

          <Link
            href="/blogs"
            className="px-3 py-2 text-sm font-medium text-slate-100 hover:text-[#FFA429] transition-colors whitespace-nowrap"
          >
            Guides & Blogs
          </Link>

          <Link
            href="/contact"
            className="px-3 py-2 text-sm font-medium text-slate-100 hover:text-[#FFA429] transition-colors whitespace-nowrap"
          >
            Contact
          </Link>
        </nav>

        {/* Right Actions: Phone, Wishlist, Role/User, CTA */}
        <div className="hidden lg:flex items-center space-x-2.5 shrink-0">
          {/* Quick Helpline */}
          <a
            href="https://wa.me/919755216100?text=Hello%20HumTripWale!%20I%20want%20to%20inquire%20about%20a%20trip."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-1.5 text-xs text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-full border border-white/15 transition-colors whitespace-nowrap"
            title="Chat or Call 24/7 Helpline"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">+91 97552 16100</span>
          </a>

          {/* Wishlist Button */}
          <Link
            href="/dashboard?tab=wishlist"
            className="relative p-2 text-slate-200 hover:text-[#FFA429] transition-colors"
            title="Saved Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute 0 top-0.5 right-0.5 bg-[#FFA429] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* User Account Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 text-xs text-white bg-[#0F223D] hover:bg-[#152e52] px-3.5 py-2 rounded-xl border border-white/15 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#FFA429]" />
              <span className="capitalize font-medium">
                {user ? user.name.split(" ")[0] : "My Account"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-56 bg-[#0F223D] border border-white/10 shadow-2xl rounded-2xl p-3 z-50 animate-in fade-in"
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <div className="border-b border-white/10 pb-2 mb-2">
                  <p className="text-[11px] text-slate-400">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">
                    {user ? user.name : "Guest Traveler"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user?.email || "info@humtripwale.com"}</p>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
                    <span>Traveler Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard?tab=bookings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    <span>My Bookings & Invoices</span>
                  </Link>
                  <Link
                    href="/dashboard?tab=wishlist"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#FFA429]" />
                    <span>Saved Wishlist</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Direct CTA */}
          <Link
            href="/tours"
            className="bg-[#FFA429] hover:bg-[#E5921E] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors whitespace-nowrap"
          >
            Explore Trips
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/dashboard?tab=wishlist"
            className="relative p-2 text-slate-200"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#FFA429] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A192F] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
            <Link
              href="/tours"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#FFA429] text-white py-2 px-3 text-center text-xs font-bold rounded-xl"
            >
              All Tours
            </Link>
            <Link
              href="/custom-trip"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-amber-400/20 text-amber-300 border border-amber-400/30 py-2 px-3 text-center text-xs font-bold rounded-xl"
            >
              Plan Custom Trip
            </Link>
          </div>

          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-200 font-medium"
            >
              Home
            </Link>
            <Link
              href="/tours?category=Group"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-200 font-medium"
            >
              Upcoming Group Trips
            </Link>
            <Link
              href="/tours?category=Weekend+Trips"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-200 font-medium"
            >
              Weekend Trips (Every Friday)
            </Link>
            <Link
              href="/tours?destination=Spiti"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-200 font-medium"
            >
              Spiti Valley Packages
            </Link>
            <Link
              href="/tours?destination=Ladakh"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-200 font-medium"
            >
              Ladakh Road Trips
            </Link>
            <Link
              href="/blogs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-200 font-medium"
            >
              Travel Guides & Blogs
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-[#FFA429] font-semibold"
            >
              My Dashboard & Invoices
            </Link>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Call / WhatsApp:</span>
            <a href="https://wa.me/919755216100" className="text-emerald-400 font-bold">
              +91 97552 16100
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
