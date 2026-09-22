"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  Briefcase, 
  Heart, 
  FileText, 
  Calendar, 
  MapPin, 
  Download, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock,
  Printer,
  ShieldCheck,
  Plus
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TOURS_DATA } from "@/data/toursData";
import TourCard from "@/components/tours/TourCard";

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "bookings";

  const { user, bookings, wishlist, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Saved Travelers state
  const [savedTravelers, setSavedTravelers] = useState([
    { name: "Aman Sharma", age: 28, gender: "Male", idType: "Aadhaar Card", phone: "+91 97552 16100" },
    { name: "Priya Verma", age: 26, gender: "Female", idType: "Passport", phone: "+91 98112 33445" },
  ]);

  const [newTravelerName, setNewTravelerName] = useState("");
  const [newTravelerAge, setNewTravelerAge] = useState("");
  const [newTravelerGender, setNewTravelerGender] = useState("Male");
  const [showAddTraveler, setShowAddTraveler] = useState(false);

  // Wishlisted tours
  const wishlistedTours = TOURS_DATA.filter((t) => wishlist.includes(t.id));

  const handleAddTraveler = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTravelerName && newTravelerAge) {
      setSavedTravelers((prev) => [
        ...prev,
        {
          name: newTravelerName,
          age: Number(newTravelerAge),
          gender: newTravelerGender,
          idType: "Govt ID Verified",
          phone: "+91 97552 16100",
        },
      ]);
      setNewTravelerName("");
      setNewTravelerAge("");
      setShowAddTraveler(false);
      showToast("Traveler profile saved!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Profile Header Card */}
        <div className="bg-[#0A192F] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#FFA429] flex items-center justify-center text-white font-bold text-2xl shadow-md">
              {user ? user.name.charAt(0) : "T"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                  {user ? user.name : "Guest Traveler"}
                </h1>
                <span className="bg-[#FFA429] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {user?.role || "Traveler"}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {user?.email || "Connect your account"} • {user?.phone || "+91 97552 16100"}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-300 font-medium mt-2">
                <span>Verified Traveler</span>
                <span>•</span>
                <span>{bookings.length} Completed / Active Bookings</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/tours"
              className="bg-[#FFA429] hover:bg-[#E5921E] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md"
            >
              Browse New Tours
            </Link>
            <a
              href="https://wa.me/919755216100"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trip Captain Desk</span>
            </a>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: "bookings", label: "My Bookings & Invoices", count: bookings.length },
            { id: "wishlist", label: "Saved Wishlist", count: wishlist.length },
            { id: "travelers", label: "Saved Travelers", count: savedTravelers.length },
            { id: "support", label: "Helpline & FAQs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-[#0A192F] text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === tab.id
                      ? "bg-[#FFA429] text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: Bookings & Invoices */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-slate-800">
                  No expeditions booked yet
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Ready to conquer Spiti, chill in Jibhi, or cruise Bali? Explore our upcoming fixed departures.
                </p>
                <Link
                  href="/tours"
                  className="mt-4 inline-block bg-[#FFA429] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow"
                >
                  Discover Curated Tours
                </Link>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {booking.id}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Booked on {booking.createdAt} • Ref: {booking.paymentId}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Print Invoice</span>
                      </button>

                      <Link
                        href={`/tours/${booking.tourId}`}
                        className="inline-flex items-center gap-1.5 bg-[#0A192F] hover:bg-[#FFA429] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                      >
                        <span>Trip Itinerary</span>
                      </Link>
                    </div>
                  </div>

                  {/* Trip Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div className="md:col-span-2">
                      <div className="text-slate-400 uppercase font-bold text-[10px]">Tour Package</div>
                      <div className="font-serif font-bold text-base text-slate-900 mt-0.5">
                        {booking.tourTitle}
                      </div>
                      <div className="text-slate-500 mt-1">
                        Travelers: {booking.travelerNames.join(", ")} ({booking.travelersCount} persons)
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 uppercase font-bold text-[10px]">Departure Date</div>
                      <div className="font-bold text-sm text-slate-900 mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#FFA429]" />
                        <span>{booking.departureDate}</span>
                      </div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                        ✓ Captain Assigned: Karan Singh
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 uppercase font-bold text-[10px]">Amount Paid</div>
                      <div className="font-serif font-bold text-lg text-slate-900 mt-0.5">
                        ₹{booking.totalAmount.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Invoice #{booking.invoiceNumber}
                      </div>
                    </div>
                  </div>

                  {/* Trip Preparation Checklist & Captain Contact */}
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-slate-200/70 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Your dedicated WhatsApp trip group will be created 48 hours prior to departure.
                      </span>
                    </div>

                    <a
                      href="https://wa.me/919755216100"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-bold hover:underline shrink-0"
                    >
                      Connect with Trip Captain (+91 97552 16100) →
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Wishlist */}
        {activeTab === "wishlist" && (
          <div>
            {wishlistedTours.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-slate-800">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Click the heart icon on any package to bookmark trips you're dreaming of taking.
                </p>
                <Link
                  href="/tours"
                  className="mt-4 inline-block bg-[#FFA429] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow"
                >
                  Explore Trips
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistedTours.map((t) => (
                  <TourCard key={t.id} tour={t} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Saved Travelers (SRS 1-Click Checkout) */}
        {activeTab === "travelers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Saved Passenger Profiles
                </h3>
                <p className="text-xs text-slate-500">
                  Quick-fill passenger information during checkout for instant group booking.
                </p>
              </div>
              <button
                onClick={() => setShowAddTraveler(!showAddTraveler)}
                className="bg-[#0A192F] hover:bg-[#FFA429] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Traveler</span>
              </button>
            </div>

            {showAddTraveler && (
              <form onSubmit={handleAddTraveler} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 animate-in slide-in-from-top-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Add New Traveler Profile
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newTravelerName}
                      onChange={(e) => setNewTravelerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Age</label>
                    <input
                      type="number"
                      required
                      value={newTravelerAge}
                      onChange={(e) => setNewTravelerAge(e.target.value)}
                      placeholder="e.g. 27"
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Gender</label>
                    <select
                      value={newTravelerGender}
                      onChange={(e) => setNewTravelerGender(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTraveler(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#FFA429] text-white px-5 py-2 rounded-xl text-xs font-bold"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedTravelers.map((trv, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">{trv.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {trv.gender}, {trv.age} years • {trv.idType}
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Support & Help Desk */}
        {activeTab === "support" && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                24x7 Traveler Helpline & Assistance
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Our support desk is active around the clock for departure updates and queries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="https://wa.me/919755216100"
                target="_blank"
                rel="noreferrer"
                className="bg-[#FAF7F2] p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-colors block"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-slate-900">WhatsApp Concierge</div>
                <div className="text-xs text-emerald-700 font-semibold mt-1">+91 97552 16100</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Instant chat reply within 5 mins</div>
              </a>

              <a
                href="mailto:info@humtripwale.com"
                className="bg-[#FAF7F2] p-5 rounded-2xl border border-slate-200 hover:border-blue-500 transition-colors block"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-slate-900">Official Invoicing & Refund Desk</div>
                <div className="text-xs text-blue-700 font-semibold mt-1">info@humtripwale.com</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Formal ticket & voucher modifications</div>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
