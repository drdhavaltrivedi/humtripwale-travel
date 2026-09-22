"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, Phone, X, Send, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function QuickInquiryWidget() {
  const pathname = usePathname();
  const { addLead } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Do not render floating widgets on invoice pages
  if (pathname?.startsWith("/invoice")) {
    return null;
  }
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    destination: "Spiti Valley",
    travelers: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      name: formData.name,
      phone: formData.phone,
      email: "",
      destination: formData.destination,
      travelDate: "Upcoming Month",
      budget: "Standard",
      travelers: Number(formData.travelers),
      notes: "Quick callback request submitted from floating website widget.",
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setFormData({ name: "", phone: "", destination: "Spiti Valley", travelers: 2 });
    }, 2500);
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div data-widget="quick-inquiry" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 print:hidden">
        {/* WhatsApp Direct */}
        <a
          href="https://wa.me/919755216100?text=Hello%20HumTripWale!%20I%20am%20interested%20in%20booking%20a%20trip."
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 border-2 border-white/20"
          title="Chat on WhatsApp (+91 97552 16100)"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-semibold pr-1">
            Chat on WhatsApp
          </span>
        </a>

        {/* Request Instant Callback */}
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 bg-[#FFA429] hover:bg-[#E5921E] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 border-2 border-white/20"
          title="Request Quick Callback"
        >
          <Phone className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-semibold pr-1">
            Request Callback
          </span>
        </button>
      </div>

      {/* Slide-in Callback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F223D] border border-white/15 text-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="font-serif text-xl font-bold">Request Received!</h3>
                <p className="text-xs text-slate-300">
                  Our dedicated travel captain will call you at <span className="text-[#FFA429] font-semibold">{formData.phone}</span> within 15 minutes.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-[#FFA429] text-xs font-bold uppercase tracking-wider mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#FFA429]" />
                  Instant Trip Guidance
                </div>
                <h3 className="font-serif text-xl font-bold mb-1">
                  Speak to a HumTripWale Captain
                </h3>
                <p className="text-xs text-slate-300 mb-5">
                  Have questions about altitude, itineraries, or group departures? Let our experts call you right back.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aryan Sharma"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FFA429]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">Phone Number (with WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9755216100"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FFA429]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1 font-medium">Destination</label>
                      <select
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full bg-[#071324] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFA429]"
                      >
                        <option value="Spiti Valley">Spiti Valley</option>
                        <option value="Ladakh">Ladakh & Umling La</option>
                        <option value="Kashmir">Kashmir Paradise</option>
                        <option value="Jibhi / Manali">Jibhi / Manali</option>
                        <option value="Bali">Bali (International)</option>
                        <option value="Thailand">Thailand (International)</option>
                        <option value="Goa">Goa Luxury Villa</option>
                        <option value="Rajasthan">Royal Rajasthan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1 font-medium">Travelers</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={formData.travelers}
                        onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFA429]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 bg-[#FFA429] hover:bg-[#E5921E] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FFA429]/30 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Request Free Callback Now
                  </button>

                  <p className="text-[10px] text-slate-400 text-center pt-1">
                    Or directly dial <a href="tel:+919755216100" className="text-amber-300 underline">+91 97552 16100</a>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
