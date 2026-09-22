"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Send, 
  ArrowRight,
  ShieldCheck,
  Compass,
  BedDouble
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function CustomTripPage() {
  const { addLead } = useApp();
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Form State
  const [destination, setDestination] = useState("Spiti Valley");
  const [tripType, setTripType] = useState("Friends Crew");
  const [travelers, setTravelers] = useState(4);
  const [travelMonth, setTravelMonth] = useState("October 2026");
  const [duration, setDuration] = useState("7 - 9 Days");
  const [budgetTier, setBudgetTier] = useState("Premium (Boutique hotels & Force Urbania)");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const destinations = [
    { name: "Spiti Valley", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=400&auto=format&fit=crop" },
    { name: "Ladakh & Umling La", img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=400&auto=format&fit=crop" },
    { name: "Kashmir Paradise", img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=400&auto=format&fit=crop" },
    { name: "Himachal (Jibhi/Kasol)", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop" },
    { name: "Bali (International)", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400&auto=format&fit=crop" },
    { name: "Thailand (International)", img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=400&auto=format&fit=crop" },
    { name: "Goa Luxury Crew Villa", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=400&auto=format&fit=crop" },
    { name: "Royal Rajasthan", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=400&auto=format&fit=crop" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      name: contactName,
      phone: contactPhone,
      email: contactEmail,
      destination,
      travelDate: travelMonth,
      budget: budgetTier,
      travelers,
      notes: `Trip Type: ${tripType} | Duration: ${duration} | Requests: ${specialRequirements || "None"}`,
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      {/* Banner */}
      <div className="relative bg-[#0A192F] text-white py-16 px-4 sm:px-6 lg:px-8 mb-10 overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFA429] mb-2">
            <span>Tailor-Made Expeditions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            Design Your Custom Itinerary
          </h1>
          <p className="mt-3 text-slate-300 text-sm max-w-xl mx-auto">
            Whether it’s a private family vacation, a romantic honeymoon, or a corporate offsite, our travel architects craft every detail to perfection.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {submitted ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xl text-center space-y-4 animate-in zoom-in-95">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Custom Trip Request Received!
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-900">{contactName}</strong>! Our Senior Travel Specialist has received your request for <strong className="text-slate-900">{destination}</strong>. We will design a custom itinerary quotation and WhatsApp you at <strong className="text-[#FFA429]">{contactPhone}</strong> shortly.
            </p>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/admin"
                className="bg-[#0A192F] text-white text-xs font-bold px-5 py-3 rounded-xl hover:bg-[#FFA429] transition-colors"
              >
                View in Admin CRM Pipeline →
              </Link>
              <Link
                href="/"
                className="bg-slate-100 text-slate-700 text-xs font-bold px-5 py-3 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
            {/* Step Indicators */}
            <div className="flex items-center justify-between pb-8 mb-8 border-b border-slate-100 text-xs font-bold">
              <span className={step >= 1 ? "text-[#FFA429]" : "text-slate-400"}>
                1. Destination & Style
              </span>
              <span>→</span>
              <span className={step >= 2 ? "text-[#FFA429]" : "text-slate-400"}>
                2. Dates & Budget
              </span>
              <span>→</span>
              <span className={step >= 3 ? "text-[#FFA429]" : "text-slate-400"}>
                3. Contact Details
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* STEP 1: Destination & Group Style */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                      Where would you like to travel?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {destinations.map((d) => (
                        <div
                          key={d.name}
                          onClick={() => setDestination(d.name)}
                          className={`group relative h-28 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                            destination === d.name
                              ? "border-[#FFA429] ring-2 ring-[#FFA429]/20 scale-95"
                              : "border-transparent opacity-85 hover:opacity-100"
                          }`}
                        >
                          <Image src={d.img} alt={d.name} fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/45" />
                          <span className="absolute bottom-2 left-2 right-2 text-white font-bold text-xs">
                            {d.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                      Who is traveling?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        "Couple / Honeymoon",
                        "Friends Crew",
                        "Family with Kids",
                        "Corporate Offsite",
                      ].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setTripType(type)}
                          className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition-all ${
                            tripType === type
                              ? "border-[#FFA429] bg-[#FFF8EE] text-[#FFA429]"
                              : "border-slate-200 bg-[#FAF7F2] text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-[#FFA429] hover:bg-[#E5921E] text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                    >
                      Next: Dates & Budget →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Dates, Duration & Budget */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Preferred Travel Month
                      </label>
                      <select
                        value={travelMonth}
                        onChange={(e) => setTravelMonth(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-2xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FFA429]"
                      >
                        <option value="October 2026">October 2026</option>
                        <option value="November 2026">November 2026</option>
                        <option value="December 2026">December 2026</option>
                        <option value="January 2027">January 2027</option>
                        <option value="Flexible / Undecided">Flexible / Undecided</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Approximate Duration
                      </label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-2xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FFA429]"
                      >
                        <option value="3 - 4 Days">Weekend Trip (3 - 4 Days)</option>
                        <option value="5 - 6 Days">Medium Trip (5 - 6 Days)</option>
                        <option value="7 - 9 Days">Long Vacation (7 - 9 Days)</option>
                        <option value="10+ Days">Extended Odyssey (10+ Days)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Total Travelers
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={travelers}
                      onChange={(e) => setTravelers(Number(e.target.value))}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-2xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FFA429]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                      Hospitality & Stay Preference
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { title: "Standard", desc: "Clean 3-Star hotels & homestays" },
                        { title: "Premium", desc: "Boutique resorts & Force Urbania / Innova" },
                        { title: "Luxury", desc: "Private pool villas & 5-Star luxury retreats" },
                      ].map((tier) => (
                        <div
                          key={tier.title}
                          onClick={() => setBudgetTier(tier.title)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            budgetTier.startsWith(tier.title)
                              ? "border-[#FFA429] bg-[#FFF8EE]"
                              : "border-slate-200 bg-[#FAF7F2] hover:border-slate-300"
                          }`}
                        >
                          <div className="font-bold text-xs text-slate-900">{tier.title}</div>
                          <div className="text-[11px] text-slate-500 mt-1">{tier.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-[#FFA429] hover:bg-[#E5921E] text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                    >
                      Next: Contact Information →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact & Special Notes */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Aryan Sehgal"
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        WhatsApp Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="e.g. 9755216100"
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. aryan@example.com"
                        className="w-full bg-[#FAF7F2] border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Any specific wishes or questions? (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={specialRequirements}
                      onChange={(e) => setSpecialRequirements(e.target.value)}
                      placeholder="e.g. We want to celebrate a birthday with a bonfire cake, need automatic SUV rental, want private photographer..."
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="bg-[#0A192F] hover:bg-[#FFA429] text-white px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-xl transition-all flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Request & Get Quote</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
