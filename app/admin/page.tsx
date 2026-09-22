"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  BarChart3, 
  Users, 
  Compass, 
  Briefcase, 
  DollarSign, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  Mail, 
  FileText, 
  ArrowUpRight,
  ShieldCheck,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  Calendar,
  MapPin
} from "lucide-react";
import { useApp, Lead } from "@/context/AppContext";
import { TOURS_DATA, TourPackage } from "@/data/toursData";

export default function AdminPage() {
  const { user, leads, updateLeadStatus, bookings, showToast, tours, addTour, updateTour, deleteTour } = useApp();

  const [activeTab, setActiveTab] = useState<"kpi" | "crm" | "bookings" | "tours">("kpi");
  const [leadSearch, setLeadSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [leadNotes, setLeadNotes] = useState("");

  // Tour Catalog CMS state
  const [tourSearch, setTourSearch] = useState("");
  const [tourDestFilter, setTourDestFilter] = useState<string>("all");
  const [tourCatFilter, setTourCatFilter] = useState<string>("all");
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [tourModalMode, setTourModalMode] = useState<"create" | "edit">("create");

  const defaultTourForm = {
    id: "",
    slug: "",
    title: "",
    tagline: "",
    destination: "Spiti" as TourPackage["destination"],
    category: "Adventure" as TourPackage["category"],
    duration: "7 Days / 6 Nights",
    durationDays: 7,
    startingPoint: "Delhi / Chandigarh",
    endingPoint: "Delhi / Chandigarh",
    minAge: 12,
    groupSize: "12-16 Travelers",
    difficulty: "Moderate" as TourPackage["difficulty"],
    originalPrice: 24999,
    discountedPrice: 19999,
    heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop",
    galleryImages: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop, https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200&auto=format&fit=crop",
    departureDates: "Every Friday, 15 Oct 2026, 25 Oct 2026",
    highlights: "Scenic High Passes & Heritage Monasteries\nStargazing & Luxury Swiss Dome Tents\nCertified HumTripWale Trip Captains\nAll Inner Line Permits Included",
    inclusions: "All accommodation in handpicked boutique hotels & camps\nBuffet breakfast & dinner daily\nPrivate sanitized tempo traveller or mountain SUV\nHigh-altitude oxygen canisters & first aid kits",
    exclusions: "Personal expenses, laundry & driver tips\nLunch and roadside snacks\nAdventure sports fees (rafting, paragliding)\nTravel insurance",
    hotelType: "3-Star Boutique Chalets & Luxury Swiss Tents",
    roomSharing: "Double / Triple Sharing Available",
    transportDetails: "Sanitized Tempo Traveller / 4x4 Mountain SUV",
    mealDetails: "Breakfast & Dinner included daily",
    packingList: "Thermal base layers (2 sets)\nHeavy down fleece jacket\nWaterproof trekking shoes\nUV sunglasses & SPF 50 sunscreen",
    isFeatured: true,
    isTrending: false,
    itinerary: [
      {
        day: 1,
        title: "Departure & Scenic Himalayan Drive",
        description: "Assemble at the departure hub and embark on a scenic drive along winding mountain valleys with scheduled picturesque pitstops.",
        meals: "Dinner Included",
        stay: "Riverside Boutique Resort",
      },
      {
        day: 2,
        title: "High Mountain Passes & Monasteries",
        description: "Acclimatization day exploring ancient heritage monasteries, prayer wheels, and stunning panoramic valley viewpoints.",
        meals: "Breakfast & Dinner",
        stay: "Heritage Himalayan Hotel",
      },
      {
        day: 3,
        title: "Alpine Lake Exploration & Bonfire Night",
        description: "Drive to high-altitude turquoise alpine lakes, take short acclimatization hikes, and enjoy an acoustic music bonfire night under the stars.",
        meals: "Breakfast & Dinner",
        stay: "Luxury Dome Camping",
      },
    ],
  };

  const [tourForm, setTourForm] = useState(defaultTourForm);

  // KPI calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0) + 148500;
  const toursList = tours && tours.length > 0 ? tours : TOURS_DATA;
  const activeToursCount = toursList.length;
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === "Won" || l.status === "Quoted").length;

  const filteredLeads = leads.filter((lead) => {
    const matchQuery =
      lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.destination.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.phone.includes(leadSearch);
    const matchStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const filteredToursList = toursList.filter((t) => {
    const matchQuery =
      !tourSearch.trim() ||
      t.title.toLowerCase().includes(tourSearch.toLowerCase()) ||
      t.slug.toLowerCase().includes(tourSearch.toLowerCase()) ||
      t.startingPoint.toLowerCase().includes(tourSearch.toLowerCase());
    const matchDest = tourDestFilter === "all" || t.destination === tourDestFilter;
    const matchCat = tourCatFilter === "all" || t.category === tourCatFilter;
    return matchQuery && matchDest && matchCat;
  });

  const handleOpenCreateTour = () => {
    const newId = `tour-${Date.now()}`;
    setTourForm({
      ...defaultTourForm,
      id: newId,
      slug: `trip-${Math.floor(100 + Math.random() * 900)}`,
    });
    setTourModalMode("create");
    setIsTourModalOpen(true);
  };

  const handleOpenEditTour = (tour: TourPackage) => {
    setTourForm({
      id: tour.id,
      slug: tour.slug,
      title: tour.title,
      tagline: tour.tagline,
      destination: tour.destination,
      category: tour.category,
      duration: tour.duration,
      durationDays: tour.durationDays,
      startingPoint: tour.startingPoint,
      endingPoint: tour.endingPoint,
      minAge: tour.minAge,
      groupSize: tour.groupSize,
      difficulty: tour.difficulty,
      originalPrice: tour.originalPrice,
      discountedPrice: tour.discountedPrice,
      heroImage: tour.heroImage,
      galleryImages: tour.galleryImages ? tour.galleryImages.join(", ") : "",
      departureDates: tour.departureDates ? tour.departureDates.join(", ") : "",
      highlights: tour.highlights ? tour.highlights.join("\n") : "",
      inclusions: tour.inclusions ? tour.inclusions.join("\n") : "",
      exclusions: tour.exclusions ? tour.exclusions.join("\n") : "",
      hotelType: tour.stayDetails?.hotelType || "",
      roomSharing: tour.stayDetails?.roomSharing || "",
      transportDetails: tour.transportDetails || "",
      mealDetails: tour.mealDetails || "",
      packingList: tour.packingList ? tour.packingList.join("\n") : "",
      isFeatured: Boolean(tour.isFeatured),
      isTrending: Boolean(tour.isTrending),
      itinerary: tour.itinerary
        ? tour.itinerary.map((it) => ({
            day: it.day,
            title: it.title,
            description: it.description,
            meals: it.meals,
            stay: it.stay,
          }))
        : [],
    });
    setTourModalMode("edit");
    setIsTourModalOpen(true);
  };

  const handleSaveTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourForm.title.trim()) {
      showToast("Please enter a tour title");
      return;
    }

    const cleanSlug =
      tourForm.slug.trim() ||
      tourForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newPackage: TourPackage = {
      id: tourForm.id || `tour-${Date.now()}`,
      slug: cleanSlug,
      title: tourForm.title.trim(),
      tagline: tourForm.tagline.trim() || "Experience handcrafted adventures with certified captains.",
      destination: tourForm.destination,
      category: tourForm.category,
      duration: tourForm.duration.trim(),
      durationDays: Number(tourForm.durationDays) || 1,
      startingPoint: tourForm.startingPoint.trim(),
      endingPoint: tourForm.endingPoint.trim(),
      minAge: Number(tourForm.minAge) || 10,
      groupSize: tourForm.groupSize.trim() || "12-16 Travelers",
      difficulty: tourForm.difficulty,
      originalPrice: Number(tourForm.originalPrice) || 0,
      discountedPrice: Number(tourForm.discountedPrice) || 0,
      rating: 4.9,
      reviewCount: 28,
      heroImage:
        tourForm.heroImage.trim() ||
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop",
      galleryImages: tourForm.galleryImages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      departureDates: tourForm.departureDates
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      highlights: tourForm.highlights
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      inclusions: tourForm.inclusions
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      exclusions: tourForm.exclusions
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      stayDetails: {
        hotelType: tourForm.hotelType.trim() || "Boutique Stays & Camps",
        roomSharing: tourForm.roomSharing.trim() || "Double / Triple Sharing",
        amenities: ["Attached Washroom", "Hot Water", "Power Backup", "Bonfire Area"],
      },
      transportDetails: tourForm.transportDetails.trim() || "Dedicated sanitized vehicle",
      mealDetails: tourForm.mealDetails.trim() || "Breakfast & Dinner",
      packingList: tourForm.packingList
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      faqs: [
        {
          question: "Who will lead the trip?",
          answer: "Every departure is led by a certified HumTripWale trip captain trained in high-altitude logistics and group engagement.",
        },
        {
          question: "Can solo travelers join this tour?",
          answer: "Yes! Over 45% of our travelers join solo and get paired with same-gender roommates.",
        },
      ],
      isFeatured: tourForm.isFeatured,
      isTrending: tourForm.isTrending,
      itinerary: tourForm.itinerary.map((item, idx) => ({
        day: idx + 1,
        title: item.title.trim(),
        description: item.description.trim(),
        meals: item.meals.trim(),
        stay: item.stay.trim(),
        activities: [],
      })),
    };

    if (tourModalMode === "create") {
      addTour(newPackage);
    } else {
      updateTour(newPackage);
    }
    setIsTourModalOpen(false);
  };

  const handleDeleteTour = (tour: TourPackage) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(`Are you sure you want to delete "${tour.title}"? This cannot be undone.`);
      if (ok) {
        deleteTour(tour.id);
      }
    }
  };

  const handleAddItineraryDay = () => {
    setTourForm((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: `Day ${prev.itinerary.length + 1}: Sightseeing & Exploration`,
          description: "Explore scenic highlights and local attractions.",
          meals: "Breakfast & Dinner",
          stay: "Boutique Hotel / Luxury Camp",
        },
      ],
    }));
  };

  const handleRemoveItineraryDay = (index: number) => {
    if (tourForm.itinerary.length <= 1) {
      showToast("Tour must have at least 1 day in itinerary");
      return;
    }
    setTourForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, day: i + 1 })),
    }));
  };

  const handleUpdateItineraryDay = (
    index: number,
    field: "title" | "description" | "meals" | "stay",
    value: string
  ) => {
    setTourForm((prev) => {
      const copy = [...prev.itinerary];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, itinerary: copy };
    });
  };

  const handleStatusChange = (leadId: string, newStatus: Lead["status"]) => {
    updateLeadStatus(leadId, newStatus);
  };

  const handleSaveNotes = (leadId: string) => {
    updateLeadStatus(leadId, leads.find((l) => l.id === leadId)!.status, leadNotes);
    setEditingLeadId(null);
    setLeadNotes("");
    showToast("Notes updated for lead " + leadId);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pt-24 pb-20 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header Bar */}
        <div className="bg-[#0A192F] text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                HumTripWale Admin & Operations Panel
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Real-time booking revenue, custom trip inquiries, tour catalog, and operations workflow.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl border border-white/15 transition-colors flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Visit Main Site</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-300 pb-3 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: "kpi", label: "Executive Dashboard", icon: BarChart3 },
            { id: "crm", label: `CRM Leads (${leads.length})`, icon: Users },
            { id: "bookings", label: `Bookings (${bookings.length})`, icon: Briefcase },
            { id: "tours", label: `Tours Catalog (${toursList.length})`, icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-[#0A192F] text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: KPI Dashboard */}
        {activeTab === "kpi" && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                  <span>Gross Platform Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-serif text-3xl font-bold text-slate-900">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  ↑ +24% vs last month
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                  <span>Confirmed Bookings</span>
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                <div className="font-serif text-3xl font-bold text-slate-900">
                  {bookings.length + 8}
                </div>
                <div className="text-[11px] text-blue-600 font-semibold mt-1">
                  100% Guaranteed Departures
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                  <span>CRM Inquiries / Leads</span>
                  <Users className="w-4 h-4 text-[#FFA429]" />
                </div>
                <div className="font-serif text-3xl font-bold text-slate-900">
                  {totalLeads} Active
                </div>
                <div className="text-[11px] text-[#FFA429] font-semibold mt-1">
                  {wonLeads} in Quotation / Won
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                  <span>Active Tour Packages</span>
                  <Compass className="w-4 h-4 text-purple-600" />
                </div>
                <div className="font-serif text-3xl font-bold text-slate-900">
                  {activeToursCount} Circuits
                </div>
                <div className="text-[11px] text-purple-600 font-semibold mt-1">
                  Spiti, Ladakh, Bali, Kashmir
                </div>
              </div>
            </div>

            {/* Quick Overview Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Bookings */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    Recent Bookings
                  </h3>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className="text-xs font-semibold text-[#FFA429] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{b.tourTitle}</div>
                        <div className="text-slate-500 text-[11px]">
                          Traveler: {b.travelerNames[0]} • {b.departureDate}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">
                          ₹{b.totalAmount.toLocaleString("en-IN")}
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          PAID
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* High Priority Leads */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    Latest Inquiries (CRM)
                  </h3>
                  <button
                    onClick={() => setActiveTab("crm")}
                    className="text-xs font-semibold text-[#FFA429] hover:underline"
                  >
                    Manage Pipeline →
                  </button>
                </div>

                <div className="space-y-3">
                  {leads.slice(0, 3).map((ld) => (
                    <div
                      key={ld.id}
                      className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          {ld.name} ({ld.destination})
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {ld.phone} • {ld.travelers} Pax • {ld.budget}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          ld.status === "New"
                            ? "bg-rose-100 text-rose-800"
                            : ld.status === "Quoted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ld.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CRM Leads Pipeline (SRS Requirement) */}
        {activeTab === "crm" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900">
                  Customer Leads & Inquiries Pipeline
                </h3>
                <p className="text-xs text-slate-500">
                  Manage incoming trip requests, assign sales reps, track quotes and conversions.
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search name, phone, trip..."
                    className="bg-[#FAF7F2] border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#FFA429]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#FAF7F2] border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Lead ID & Date</th>
                    <th className="py-3 px-3">Traveler Name</th>
                    <th className="py-3 px-3">Destination & Pax</th>
                    <th className="py-3 px-3">Budget Tier</th>
                    <th className="py-3 px-3">Assigned To</th>
                    <th className="py-3 px-3">Pipeline Status</th>
                    <th className="py-3 px-3">Action & Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((ld) => (
                    <tr key={ld.id} className="hover:bg-[#FAF7F2]/80 transition-colors">
                      <td className="py-4 px-3 font-mono font-semibold text-slate-900">
                        {ld.id}
                        <div className="text-[10px] text-slate-400 font-normal">{ld.createdAt}</div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-900">{ld.name}</div>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                          <a href={`tel:${ld.phone}`} className="hover:text-[#FFA429] flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {ld.phone}
                          </a>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-semibold text-slate-900">{ld.destination}</div>
                        <div className="text-slate-500 text-[11px]">{ld.travelers} Travelers</div>
                      </td>
                      <td className="py-4 px-3 text-slate-600 font-medium">
                        {ld.budget}
                      </td>
                      <td className="py-4 px-3">
                        <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[11px]">
                          {ld.assignedTo || "Unassigned"}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <select
                          value={ld.status}
                          onChange={(e) => handleStatusChange(ld.id, e.target.value as any)}
                          className={`font-bold text-[11px] px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            ld.status === "New"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : ld.status === "Quoted"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : ld.status === "Won"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Quoted">Quoted</option>
                          <option value="Won">Won</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>
                      <td className="py-4 px-3">
                        <button
                          onClick={() => {
                            setEditingLeadId(editingLeadId === ld.id ? null : ld.id);
                            setLeadNotes(ld.notes || "");
                          }}
                          className="text-[#FFA429] font-semibold text-[11px] hover:underline flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>{ld.notes ? "Edit Note" : "Add Note"}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note Editor Drawer */}
            {editingLeadId && (
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-slate-200 space-y-2 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Internal Sales Notes for Lead {editingLeadId}</span>
                  <button onClick={() => setEditingLeadId(null)} className="text-slate-400 hover:text-slate-600">
                    ✕
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="Record customer preferences, budget adjustments, or call summary..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#FFA429]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingLeadId(null)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveNotes(editingLeadId)}
                    className="bg-[#0A192F] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#FFA429] transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Bookings Management */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-4">
              All Customer Reservations
            </h3>

            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-[#FAF7F2] border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{b.tourTitle}</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        CONFIRMED
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1">
                      Lead: <strong className="text-slate-800">{b.travelerNames[0]}</strong> ({b.contactPhone}, {b.contactEmail})
                    </div>
                    <div className="text-slate-400 mt-0.5">
                      Departure: {b.departureDate} • Booking #{b.id} • Invoice #{b.invoiceNumber}
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div className="font-serif font-bold text-base text-slate-900">
                        ₹{b.totalAmount.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{b.paymentId}</div>
                    </div>
                    <Link
                      href={`/invoice/${b.id}`}
                      target="_blank"
                      className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Invoice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Tours Management */}
        {activeTab === "tours" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900">
                  Tour Catalog CMS & Departures
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create new departures, customize day-by-day itineraries, adjust pricing tiers, and manage live public listings.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/tours"
                  target="_blank"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Public Catalog</span>
                </Link>
                <button
                  onClick={handleOpenCreateTour}
                  className="bg-[#FFA429] hover:bg-[#e08b18] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Tour Listing</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-slate-200">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by tour title, destination, route, or slug..."
                    value={tourSearch}
                    onChange={(e) => setTourSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFA429]"
                  />
                  {tourSearch && (
                    <button
                      onClick={() => setTourSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Destination Filter */}
                <select
                  value={tourDestFilter}
                  onChange={(e) => setTourDestFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#FFA429]"
                >
                  <option value="all">All Destinations</option>
                  <option value="Spiti">Spiti</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Himachal">Himachal</option>
                  <option value="Kashmir">Kashmir</option>
                  <option value="Goa">Goa</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Bali">Bali</option>
                  <option value="Thailand">Thailand</option>
                </select>

                {/* Category Filter */}
                <select
                  value={tourCatFilter}
                  onChange={(e) => setTourCatFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#FFA429]"
                >
                  <option value="all">All Categories</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Domestic">Domestic</option>
                  <option value="International">International</option>
                  <option value="Weekend Trips">Weekend Trips</option>
                  <option value="Honeymoon">Honeymoon</option>
                  <option value="Family">Family</option>
                  <option value="Group">Group</option>
                </select>
              </div>

              <div className="text-xs text-slate-500 font-medium px-2 text-right">
                Showing <strong className="text-slate-800">{filteredToursList.length}</strong> of {toursList.length} Tours
              </div>
            </div>

            {/* Tours Grid */}
            {filteredToursList.length === 0 ? (
              <div className="text-center py-12 bg-[#FAF7F2] rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
                <Compass className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">No tour packages match your filters</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search query, clearing filters, or create a brand new tour package.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setTourSearch("");
                      setTourDestFilter("all");
                      setTourCatFilter("all");
                    }}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={handleOpenCreateTour}
                    className="px-4 py-2 bg-[#FFA429] text-white rounded-xl text-xs font-bold hover:bg-[#e08b18]"
                  >
                    + Create Tour
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredToursList.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-slate-200 flex flex-col justify-between gap-4 hover:border-slate-300 transition-all text-xs"
                  >
                    <div className="flex items-start gap-4">
                      {/* Image Thumbnail */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                        <Image
                          src={t.heroImage || "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop"}
                          alt={t.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-[#0A192F]/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {t.destination}
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {t.category}
                          </span>
                          <span className="bg-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {t.duration}
                          </span>
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {t.difficulty}
                          </span>
                          {t.isFeatured && (
                            <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              FEATURED
                            </span>
                          )}
                          {t.isTrending && (
                            <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              TRENDING
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 truncate">
                          {t.title}
                        </h4>
                        <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                          {t.tagline}
                        </p>

                        <div className="flex items-center gap-2 mt-2 text-slate-600 text-[11px]">
                          <MapPin className="w-3 h-3 text-[#FFA429] shrink-0" />
                          <span className="truncate">{t.startingPoint} → {t.endingPoint}</span>
                        </div>

                        <div className="mt-2.5 flex items-baseline gap-2">
                          <span className="font-serif font-bold text-base text-slate-900">
                            ₹{t.discountedPrice.toLocaleString("en-IN")}
                          </span>
                          {t.originalPrice > t.discountedPrice && (
                            <span className="line-through text-slate-400 text-xs">
                              ₹{t.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                            {Math.round(((t.originalPrice - t.discountedPrice) / t.originalPrice) * 100)}% OFF
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-3 mt-1">
                      <div className="text-[11px] text-slate-500 font-mono">
                        Slug: /{t.slug} • {t.itinerary?.length || t.durationDays} Days Itinerary
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/tours/${t.slug}`}
                          target="_blank"
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#FFA429] hover:border-[#FFA429] transition-colors flex items-center gap-1 font-semibold"
                          title="Preview Live Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Preview</span>
                        </Link>

                        <button
                          onClick={() => handleOpenEditTour(t)}
                          className="px-3 py-1.5 rounded-xl bg-[#0A192F] text-white hover:bg-[#FFA429] transition-colors flex items-center gap-1 font-bold shadow-sm"
                          title="Edit Listing"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteTour(t)}
                          className="p-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL: Create / Edit Tour Listing */}
        {isTourModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
              {/* Modal Header */}
              <div className="px-6 sm:px-8 py-5 border-b border-slate-200 flex items-center justify-between bg-[#0A192F] text-white">
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl">
                    {tourModalMode === "create" ? "Create New Tour Package" : `Edit Tour: ${tourForm.title || "Untitled"}`}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {tourModalMode === "create"
                      ? "Configure details, pricing, itinerary, inclusions, and publish directly to live site."
                      : `Updating tour ID: ${tourForm.id} • Slug: /${tourForm.slug}`}
                  </p>
                </div>
                <button
                  onClick={() => setIsTourModalOpen(false)}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form Scrollable Body */}
              <form onSubmit={handleSaveTour} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-xs text-slate-700">
                {/* Section 1: Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Compass className="w-4 h-4 text-[#FFA429]" />
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                      1. General Package Information
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-bold text-slate-800">
                        Tour Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={tourForm.title}
                        onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })}
                        placeholder="e.g. Spiti Valley Full Circuit – High Passes & Monasteries"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">
                        URL Slug <span className="text-slate-400 font-normal">(Auto-generated if blank)</span>
                      </label>
                      <input
                        type="text"
                        value={tourForm.slug}
                        onChange={(e) => setTourForm({ ...tourForm, slug: e.target.value })}
                        placeholder="e.g. spiti-valley-circuit"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none font-mono text-[11px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Destination Circuit</label>
                      <select
                        value={tourForm.destination}
                        onChange={(e) => setTourForm({ ...tourForm, destination: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      >
                        <option value="Spiti">Spiti Valley</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Himachal">Himachal Pradesh</option>
                        <option value="Kashmir">Kashmir</option>
                        <option value="Goa">Goa</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Bali">Bali (International)</option>
                        <option value="Thailand">Thailand (International)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-bold text-slate-800">Catchy Tagline</label>
                      <input
                        type="text"
                        value={tourForm.tagline}
                        onChange={(e) => setTourForm({ ...tourForm, tagline: e.target.value })}
                        placeholder="e.g. Traverse high mountain passes, ancient monasteries & turquoise lakes"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Travel Category</label>
                      <select
                        value={tourForm.category}
                        onChange={(e) => setTourForm({ ...tourForm, category: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      >
                        <option value="Adventure">Adventure</option>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                        <option value="Weekend Trips">Weekend Trips</option>
                        <option value="Honeymoon">Honeymoon</option>
                        <option value="Family">Family</option>
                        <option value="Group">Group</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Difficulty Grade</label>
                      <select
                        value={tourForm.difficulty}
                        onChange={(e) => setTourForm({ ...tourForm, difficulty: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      >
                        <option value="Easy">Easy (All Travelers)</option>
                        <option value="Moderate">Moderate (Active Walking/High Altitude)</option>
                        <option value="Challenging">Challenging (Rugged Terrains)</option>
                        <option value="Extreme">Extreme (Expedition Grade)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Duration Text</label>
                      <input
                        type="text"
                        value={tourForm.duration}
                        onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                        placeholder="e.g. 7 Days / 6 Nights"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Duration (Days Count)</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={tourForm.durationDays}
                        onChange={(e) => setTourForm({ ...tourForm, durationDays: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Starting Point</label>
                      <input
                        type="text"
                        value={tourForm.startingPoint}
                        onChange={(e) => setTourForm({ ...tourForm, startingPoint: e.target.value })}
                        placeholder="e.g. Delhi / Chandigarh"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Ending Point</label>
                      <input
                        type="text"
                        value={tourForm.endingPoint}
                        onChange={(e) => setTourForm({ ...tourForm, endingPoint: e.target.value })}
                        placeholder="e.g. Delhi / Chandigarh"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Group Size Specification</label>
                      <input
                        type="text"
                        value={tourForm.groupSize}
                        onChange={(e) => setTourForm({ ...tourForm, groupSize: e.target.value })}
                        placeholder="e.g. 12-16 Travelers"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Minimum Age</label>
                      <input
                        type="number"
                        min="1"
                        max="80"
                        value={tourForm.minAge}
                        onChange={(e) => setTourForm({ ...tourForm, minAge: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Pricing & Badges */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <DollarSign className="w-4 h-4 text-[#FFA429]" />
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                      2. Pricing & Homepage Badges
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">
                        Selling / Discounted Price (₹ per person) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={tourForm.discountedPrice}
                        onChange={(e) => setTourForm({ ...tourForm, discountedPrice: Number(e.target.value) })}
                        placeholder="e.g. 19999"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none text-slate-900 font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Original / MRP Price (₹ per person)</label>
                      <input
                        type="number"
                        min="0"
                        value={tourForm.originalPrice}
                        onChange={(e) => setTourForm({ ...tourForm, originalPrice: Number(e.target.value) })}
                        placeholder="e.g. 24999"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none text-slate-500"
                      />
                    </div>

                    <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2 bg-[#FAF7F2] p-4 rounded-xl border border-slate-200">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={tourForm.isFeatured}
                          onChange={(e) => setTourForm({ ...tourForm, isFeatured: e.target.checked })}
                          className="w-4 h-4 rounded text-[#FFA429] focus:ring-[#FFA429]"
                        />
                        <span>Feature on Homepage & Featured Trips</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={tourForm.isTrending}
                          onChange={(e) => setTourForm({ ...tourForm, isTrending: e.target.checked })}
                          className="w-4 h-4 rounded text-[#FFA429] focus:ring-[#FFA429]"
                        />
                        <span>Mark as Trending Departure</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 3: Media & Departures */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Calendar className="w-4 h-4 text-[#FFA429]" />
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                      3. Media URLs & Departures
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-bold text-slate-800">Hero Image Banner URL</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="url"
                          value={tourForm.heroImage}
                          onChange={(e) => setTourForm({ ...tourForm, heroImage: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                        />
                        {tourForm.heroImage && (
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                            <Image src={tourForm.heroImage} alt="Preview" fill className="object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-bold text-slate-800">
                        Gallery Image URLs <span className="text-slate-400 font-normal">(Comma-separated)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={tourForm.galleryImages}
                        onChange={(e) => setTourForm({ ...tourForm, galleryImages: e.target.value })}
                        placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none font-mono text-[11px]"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-bold text-slate-800">
                        Upcoming Departure Dates <span className="text-slate-400 font-normal">(Comma-separated)</span>
                      </label>
                      <input
                        type="text"
                        value={tourForm.departureDates}
                        onChange={(e) => setTourForm({ ...tourForm, departureDates: e.target.value })}
                        placeholder="e.g. Every Friday, 15 Oct 2026, 25 Oct 2026, 05 Nov 2026"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Stay & Logistics */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <ShieldCheck className="w-4 h-4 text-[#FFA429]" />
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                      4. Accommodations & Logistics
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Hotel / Camp Type</label>
                      <input
                        type="text"
                        value={tourForm.hotelType}
                        onChange={(e) => setTourForm({ ...tourForm, hotelType: e.target.value })}
                        placeholder="e.g. 3-Star Boutique Chalets & Luxury Swiss Tents"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Room Sharing Options</label>
                      <input
                        type="text"
                        value={tourForm.roomSharing}
                        onChange={(e) => setTourForm({ ...tourForm, roomSharing: e.target.value })}
                        placeholder="e.g. Double / Triple Sharing Available"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Vehicle / Transport</label>
                      <input
                        type="text"
                        value={tourForm.transportDetails}
                        onChange={(e) => setTourForm({ ...tourForm, transportDetails: e.target.value })}
                        placeholder="e.g. Sanitized Tempo Traveller / 4x4 Mountain SUV"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Meal Plan Inclusions</label>
                      <input
                        type="text"
                        value={tourForm.mealDetails}
                        onChange={(e) => setTourForm({ ...tourForm, mealDetails: e.target.value })}
                        placeholder="e.g. Breakfast & Dinner Included Daily"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5: Highlights, Inclusions & Exclusions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <FileText className="w-4 h-4 text-[#FFA429]" />
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                      5. Inclusions, Exclusions & Highlights (1 Item per line)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Tour Highlights</label>
                      <textarea
                        rows={4}
                        value={tourForm.highlights}
                        onChange={(e) => setTourForm({ ...tourForm, highlights: e.target.value })}
                        placeholder="Scenic High Passes & Heritage Monasteries&#10;Stargazing & Luxury Swiss Dome Tents&#10;Certified HumTripWale Trip Captains"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Recommended Packing List</label>
                      <textarea
                        rows={4}
                        value={tourForm.packingList}
                        onChange={(e) => setTourForm({ ...tourForm, packingList: e.target.value })}
                        placeholder="Thermal base layers (2 sets)&#10;Heavy down fleece jacket&#10;Waterproof trekking shoes&#10;UV sunglasses & SPF 50 sunscreen"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-emerald-800">What's Included</label>
                      <textarea
                        rows={4}
                        value={tourForm.inclusions}
                        onChange={(e) => setTourForm({ ...tourForm, inclusions: e.target.value })}
                        placeholder="All accommodation in boutique hotels & camps&#10;Buffet breakfast & dinner daily&#10;Private sanitized tempo traveller or SUV&#10;All inner line permits"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/30 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-rose-800">What's Excluded</label>
                      <textarea
                        rows={4}
                        value={tourForm.exclusions}
                        onChange={(e) => setTourForm({ ...tourForm, exclusions: e.target.value })}
                        placeholder="Personal expenses & driver tips&#10;Lunch & roadside snacks&#10;Adventure sports entry tickets&#10;Travel insurance"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/30 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 6: Day-by-Day Itinerary Builder */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#FFA429]" />
                      <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                        6. Day-by-Day Itinerary Builder ({tourForm.itinerary.length} Days)
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddItineraryDay}
                      className="px-3 py-1.5 rounded-xl bg-[#0A192F] text-white hover:bg-[#FFA429] text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Day</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {tourForm.itinerary.map((dayItem, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#0A192F] text-white text-[11px] font-bold flex items-center justify-center">
                              {dayItem.day}
                            </span>
                            <span className="font-bold text-slate-900 text-xs">
                              Day {dayItem.day} Itinerary
                            </span>
                          </div>

                          {tourForm.itinerary.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItineraryDay(idx)}
                              className="text-rose-600 hover:text-rose-800 p-1 text-xs font-semibold flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 text-[11px]">Day Title</label>
                          <input
                            type="text"
                            required
                            value={dayItem.title}
                            onChange={(e) => handleUpdateItineraryDay(idx, "title", e.target.value)}
                            placeholder="e.g. Scenic Himalayan Drive from Delhi to Shimla"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 text-[11px]">Day Activities & Plan</label>
                          <textarea
                            rows={2}
                            required
                            value={dayItem.description}
                            onChange={(e) => handleUpdateItineraryDay(idx, "description", e.target.value)}
                            placeholder="Detailed description of stops, acclimatization, viewpoints..."
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="font-semibold text-slate-700 text-[11px]">Meals Included</label>
                            <input
                              type="text"
                              value={dayItem.meals}
                              onChange={(e) => handleUpdateItineraryDay(idx, "meals", e.target.value)}
                              placeholder="e.g. Breakfast & Dinner"
                              className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-semibold text-slate-700 text-[11px]">Night Stay / Accommodation</label>
                            <input
                              type="text"
                              value={dayItem.stay}
                              onChange={(e) => handleUpdateItineraryDay(idx, "stay", e.target.value)}
                              placeholder="e.g. Riverside Boutique Resort / Luxury Swiss Camp"
                              className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-[#FFA429] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={handleAddItineraryDay}
                      className="px-4 py-2 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Day {tourForm.itinerary.length + 1} to Itinerary</span>
                    </button>
                  </div>
                </div>

                {/* Modal Footer Controls */}
                <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
                  <button
                    type="button"
                    onClick={() => setIsTourModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#FFA429] hover:bg-[#e08b18] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{tourModalMode === "create" ? "Publish Tour Listing" : "Save Tour Changes"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
