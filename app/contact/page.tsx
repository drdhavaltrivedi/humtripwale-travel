"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  HelpCircle,
  FileText
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ContactPage() {
  const { addLead, showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "policy" | "faq">("form");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      destination: formData.subject,
      travelDate: "Open",
      budget: "Inquiry",
      travelers: 1,
      notes: formData.message,
    });
    setSubmitted(true);
    showToast("Message sent! Our travel desk will respond shortly.");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      {/* Banner */}
      <div className="relative bg-[#0A192F] text-white py-16 px-4 sm:px-6 lg:px-8 mb-10 overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase font-bold text-[#FFA429] tracking-widest bg-white/10 px-3 py-1 rounded-full">
            24/7 Traveler Care
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mt-3">
            Get in Touch With HumTripWale
          </h1>
          <p className="mt-3 text-slate-300 text-sm max-w-xl mx-auto">
            Have questions about high-altitude routes, corporate group packages, or customized departures? We're here for you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Helpline / WhatsApp</div>
              <a href="tel:+919755216100" className="text-sm font-semibold text-emerald-700 hover:underline block mt-0.5">
                +91 97552 16100
              </a>
              <div className="text-[11px] text-slate-500 mt-1">Available 24x7 for active travelers</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Email Inquiries</div>
              <a href="mailto:info@humtripwale.com" className="text-sm font-semibold text-blue-700 hover:underline block mt-0.5">
                info@humtripwale.com
              </a>
              <div className="text-[11px] text-slate-500 mt-1">Official bookings & B2B tie-ups</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">Departure Hubs</div>
              <div className="text-xs text-slate-700 mt-0.5 font-medium">
                Delhi (Majnu Ka Tila) & Chandigarh
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Direct pick-up points for mountain Volvo/Tempo</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Form vs Cancellation Policy vs FAQs) */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8">
          <button
            onClick={() => setActiveTab("form")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "form"
                ? "bg-[#0A192F] text-white"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            Send Inquiry Form
          </button>
          <button
            onClick={() => setActiveTab("policy")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "policy"
                ? "bg-[#0A192F] text-white"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            Cancellation & Refund Policy
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "faq"
                ? "bg-[#0A192F] text-white"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            Booking FAQs
          </button>
        </div>

        {/* Tab 1: Form */}
        {activeTab === "form" && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm max-w-3xl mx-auto">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="font-serif text-2xl font-bold text-slate-900">Message Received!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our support desk has logged your inquiry. We will contact you at {formData.phone} shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-[#FFA429] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      WhatsApp Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 97552 16100"
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subject / Interested Tour
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                    >
                      <option value="Full Circuit Spiti">Full Circuit Spiti</option>
                      <option value="Ladakh Road Trip">Ladakh Road Trip</option>
                      <option value="Jibhi & Tirthan Valley">Jibhi & Tirthan Valley</option>
                      <option value="Kashmir Paradise">Kashmir Paradise</option>
                      <option value="Bali Tropical Odyssey">Bali Tropical Odyssey</option>
                      <option value="Corporate Offsite">Corporate Offsite</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what dates or customization you require..."
                    className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0A192F] hover:bg-[#FFA429] text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Team</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Cancellation Policy (SRS Page 4) */}
        {activeTab === "policy" && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6 text-xs text-slate-700 leading-relaxed">
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              HumTripWale Cancellation & Refund Policy
            </h3>
            <p>
              We understand that plans can change unexpectedly due to work, personal emergencies, or mountain weather conditions. Here is our transparent cancellation policy:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200 flex justify-between items-center">
                <div>
                  <strong className="text-slate-900 text-sm">30+ Days Prior to Departure:</strong>
                  <div className="text-slate-500 text-[11px]">Cancellations made 30 or more days before trip start date</div>
                </div>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                  90% Refund (or 100% Trip Credit Voucher)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200 flex justify-between items-center">
                <div>
                  <strong className="text-slate-900 text-sm">15 to 29 Days Prior:</strong>
                  <div className="text-slate-500 text-[11px]">Cancellations made 15-29 days before trip start date</div>
                </div>
                <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl">
                  70% Refund
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200 flex justify-between items-center">
                <div>
                  <strong className="text-slate-900 text-sm">7 to 14 Days Prior:</strong>
                  <div className="text-slate-500 text-[11px]">Cancellations made 7-14 days before trip start date</div>
                </div>
                <span className="font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl">
                  50% Refund
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200 flex justify-between items-center">
                <div>
                  <strong className="text-slate-900 text-sm">Less than 7 Days / No-Show:</strong>
                  <div className="text-slate-500 text-[11px]">Cancellations under 7 days or missing departure</div>
                </div>
                <span className="font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-xl">
                  Non-refundable (Trip replacement transferable to friend)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: FAQs */}
        {activeTab === "faq" && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-4">
            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h3>

            {[
              {
                q: "Can solo travelers join the group trips?",
                a: "Absolutely! More than 60% of our travelers join solo. We pair solo travelers on same-gender twin/triple sharing room arrangements or you can opt for a single room supplement.",
              },
              {
                q: "What happens if a high pass (e.g. Rohtang or Kunzum) is closed due to snowfall?",
                a: "Safety is paramount. Our trip captains and backup vehicles have tested contingency itineraries with alternate valley stays and refunds/credits if any paid monument or permit cannot be accessed.",
              },
              {
                q: "Are the vehicles air-conditioned and pushback?",
                a: "Yes! For plain terrain we operate luxury AC pushback Tempo Travellers / Volvos. On high-altitude mountain ascents, vehicles operate in non-AC mode to ensure maximum engine torque on steep climbs.",
              },
              {
                q: "How do I download my GST tax invoice?",
                a: "Immediately upon payment confirmation, you can print/save your tax invoice from the checkout screen, or access it anytime under your User Dashboard.",
              },
            ].map((faq, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#FAF7F2] border border-slate-200">
                <h4 className="font-bold text-xs text-slate-900">{faq.q}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
