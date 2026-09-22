"use client";

import React, { useState, Suspense } from "react";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Tag, 
  CreditCard, 
  Download, 
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Printer
} from "lucide-react";
import { TOURS_DATA } from "@/data/toursData";
import { useApp } from "@/context/AppContext";

function BookingContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tourId = params?.tourId as string;
  const { addBooking, user, showToast, tours } = useApp();

  const tour = (tours || TOURS_DATA).find((t) => t.id === tourId || t.slug === tourId);

  if (!tour) {
    return notFound();
  }

  // Pre-fill query params
  const initialDate = searchParams.get("date") || tour.departureDates[0] || "2026-10-15";
  const initialTravelers = Math.max(1, Number(searchParams.get("travelers")) || 2);

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Details & Addons, 2: Payment, 3: Confirmation/Invoice
  const [departureDate, setDepartureDate] = useState<string>(initialDate);
  const [travelersCount, setTravelersCount] = useState<number>(initialTravelers);

  // Lead traveler details
  const [leadName, setLeadName] = useState(user?.name || "Aman Sharma");
  const [leadEmail, setLeadEmail] = useState(user?.email || "aman.traveler@example.com");
  const [leadPhone, setLeadPhone] = useState(user?.phone || "+91 97552 16100");
  const [specialRequests, setSpecialRequests] = useState("");

  // Additional travelers
  const [passengers, setPassengers] = useState<string[]>([user?.name || "Aman Sharma", "Priya Verma"]);

  // Add-ons
  const [singleSupplement, setSingleSupplement] = useState(false); // +₹4500
  const [insurance, setInsurance] = useState(true); // +₹499 per person
  const [airportPickup, setAirportPickup] = useState(false); // +₹1500

  // Coupons
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  // Payment method
  const [paymentOption, setPaymentOption] = useState<"full" | "deposit">("full");
  const [paymentGateway, setPaymentGateway] = useState<"razorpay" | "phonepe" | "card">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<{
    id: string;
    invoiceNumber: string;
    paymentId: string;
    totalPaid: number;
  } | null>(null);

  // Calculations
  const basePrice = tour.discountedPrice * travelersCount;
  const singleSupplementCost = singleSupplement ? 4500 : 0;
  const insuranceCost = insurance ? 499 * travelersCount : 0;
  const airportTransferCost = airportPickup ? 1500 : 0;
  const addOnsTotal = singleSupplementCost + insuranceCost + airportTransferCost;

  const subtotal = basePrice + addOnsTotal;
  const discountAmount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discount / 100)) : 0;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = Math.round(taxableAmount * 0.05); // 5% GST
  const grandTotal = taxableAmount + gstAmount;
  const amountToPay = paymentOption === "deposit" ? Math.round(grandTotal * 0.2) : grandTotal;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (code === "HUMTRIP10" || code === "WANDERLUST10") {
      setAppliedCoupon({ code, discount: 10 });
      showToast(`Coupon ${code} applied! 10% instant discount.`);
    } else if (code === "EARLYBIRD") {
      setAppliedCoupon({ code, discount: 15 });
      showToast(`Coupon ${code} applied! 15% Early Bird discount.`);
    } else {
      setCouponError("Invalid promo code. Try HUMTRIP10 or EARLYBIRD");
    }
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const bookingId = `HTW-${Math.floor(10000 + Math.random() * 90000)}`;
      const invoiceNo = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
      const paymentRef = `PAY_${paymentGateway.toUpperCase()}_${Date.now().toString().slice(-6)}`;

      addBooking({
        id: bookingId,
        tourId: tour.id,
        tourTitle: tour.title,
        departureDate,
        travelersCount,
        travelerNames: passengers.slice(0, travelersCount),
        totalAmount: amountToPay,
        status: "confirmed",
        paymentId: paymentRef,
        createdAt: new Date().toISOString().split("T")[0],
        invoiceNumber: invoiceNo,
        contactEmail: leadEmail,
        contactPhone: leadPhone,
      });

      setConfirmedBooking({
        id: bookingId,
        invoiceNumber: invoiceNo,
        paymentId: paymentRef,
        totalPaid: amountToPay,
      });

      setStep(3);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe fallback
      }
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            href={`/tours/${tour.slug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tour Details</span>
          </Link>
        </div>

        {/* Step Indicator */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1 ? "bg-[#FFA429] text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              1
            </span>
            <span className={`text-xs font-bold ${step >= 1 ? "text-slate-900" : "text-slate-400"}`}>
              Traveler Details & Add-ons
            </span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-3">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2 ? "bg-[#FFA429] text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              2
            </span>
            <span className={`text-xs font-bold ${step >= 2 ? "text-slate-900" : "text-slate-400"}`}>
              Payment & Checkout
            </span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-3">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 3 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              3
            </span>
            <span className={`text-xs font-bold ${step === 3 ? "text-emerald-700" : "text-slate-400"}`}>
              Confirmation & Tax Invoice
            </span>
          </div>
        </div>

        {/* STEP 1 & 2: Booking Form + Summary */}
        {step < 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-7 space-y-6">
              {step === 1 && (
                <>
                  {/* Tour Quick Banner */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 flex gap-4 items-center">
                    <div className="relative w-24 h-20 rounded-2xl overflow-hidden shrink-0">
                      <Image
                        src={tour.heroImage}
                        alt={tour.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFA429]">
                        {tour.destination} • {tour.duration}
                      </span>
                      <h2 className="font-serif font-bold text-base text-slate-900 line-clamp-1">
                        {tour.title}
                      </h2>
                      <div className="text-xs text-slate-500 mt-1">
                        ₹{tour.discountedPrice.toLocaleString("en-IN")} per traveler
                      </div>
                    </div>
                  </div>

                  {/* Departure & Count Picker */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-serif font-bold text-base text-slate-900">
                      1. Departure & Headcount
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                          Departure Date
                        </label>
                        <select
                          value={departureDate}
                          onChange={(e) => setDepartureDate(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FFA429]"
                        >
                          {tour.departureDates.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                          Total Travelers
                        </label>
                        <select
                          value={travelersCount}
                          onChange={(e) => {
                            const count = Number(e.target.value);
                            setTravelersCount(count);
                            // Adjust passengers array
                            const newArr = [...passengers];
                            while (newArr.length < count) newArr.push(`Traveler ${newArr.length + 1}`);
                            setPassengers(newArr.slice(0, count));
                          }}
                          className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FFA429]"
                        >
                          {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                            <option key={n} value={n}>
                              {n} Traveler{n > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Lead Contact Info */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-serif font-bold text-base text-slate-900">
                      2. Lead Traveler Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name (as per Govt ID)
                        </label>
                        <input
                          type="text"
                          required
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="e.g. Aman Sharma"
                          className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Email Address (for Tax Invoice)
                          </label>
                          <input
                            type="email"
                            required
                            value={leadEmail}
                            onChange={(e) => setLeadEmail(e.target.value)}
                            placeholder="e.g. aman@gmail.com"
                            className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            WhatsApp Phone Number
                          </label>
                          <input
                            type="tel"
                            required
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            placeholder="+91 97552 16100"
                            className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Dietary or Health Notes / Special Requests
                        </label>
                        <textarea
                          rows={2}
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          placeholder="e.g. Pure vegetarian meals, mountain sickness history, room preferences..."
                          className="w-full bg-[#FAF7F2] border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#FFA429]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Add-ons Selector */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <h3 className="font-serif font-bold text-base text-slate-900">
                      3. Trip Add-ons & Upgrades
                    </h3>

                    <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer bg-[#FAF7F2]">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={insurance}
                          onChange={(e) => setInsurance(e.target.checked)}
                          className="w-4 h-4 text-[#FFA429] rounded focus:ring-[#FFA429]"
                        />
                        <div>
                          <div className="font-bold text-xs text-slate-900">
                            Himalayan Travel & Medical Evacuation Insurance
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Covers medical emergencies, baggage loss, altitude sickness
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        +₹{(499 * travelersCount).toLocaleString("en-IN")}
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer bg-[#FAF7F2]">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={singleSupplement}
                          onChange={(e) => setSingleSupplement(e.target.checked)}
                          className="w-4 h-4 text-[#FFA429] rounded focus:ring-[#FFA429]"
                        />
                        <div>
                          <div className="font-bold text-xs text-slate-900">
                            Single Occupancy Room Supplement
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Private room throughout instead of twin/triple sharing
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">+₹4,500</span>
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer bg-[#FAF7F2]">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={airportPickup}
                          onChange={(e) => setAirportPickup(e.target.checked)}
                          className="w-4 h-4 text-[#FFA429] rounded focus:ring-[#FFA429]"
                        />
                        <div>
                          <div className="font-bold text-xs text-slate-900">
                            Private Airport / Station Transfer Cab
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Dedicated chauffeur pickup and drop directly to base hotel
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">+₹1,500</span>
                    </label>
                  </div>

                  {/* Proceed to Payment */}
                  <button
                    onClick={() => {
                      if (!leadName || !leadEmail || !leadPhone) {
                        showToast("Please fill in your name, email and phone number.");
                        return;
                      }
                      setStep(2);
                    }}
                    className="w-full bg-[#FFA429] hover:bg-[#E5921E] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FFA429]/30 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Payment Gateway</span>
                  </button>
                </>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* Payment Options (Deposit vs Full) */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-serif font-bold text-base text-slate-900">
                      Payment Deposit Preference
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setPaymentOption("full")}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          paymentOption === "full"
                            ? "border-[#FFA429] bg-[#FFF8EE]"
                            : "border-slate-200 bg-[#FAF7F2]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900">Pay 100% Full</span>
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                            Fastest
                          </span>
                        </div>
                        <div className="text-base font-bold text-slate-900">
                          ₹{grandTotal.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Immediate full voucher & GST invoice release.
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentOption("deposit")}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          paymentOption === "deposit"
                            ? "border-[#FFA429] bg-[#FFF8EE]"
                            : "border-slate-200 bg-[#FAF7F2]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900">Pay 20% Token</span>
                          <span className="text-xs bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                            Flexible
                          </span>
                        </div>
                        <div className="text-base font-bold text-slate-900">
                          ₹{Math.round(grandTotal * 0.2).toLocaleString("en-IN")}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Hold seats now. Pay balance 7 days before trip.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-serif font-bold text-base text-slate-900">
                      Select Payment Method (SRS Gateway)
                    </h3>

                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-[#FAF7F2] cursor-pointer hover:border-slate-300">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentGateway"
                            checked={paymentGateway === "razorpay"}
                            onChange={() => setPaymentGateway("razorpay")}
                            className="text-[#FFA429] focus:ring-[#FFA429]"
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-900">
                              Razorpay (UPI, GPay, Paytm, NetBanking)
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Instant 0% transaction fee via BHIM UPI & Cards
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          Recommended
                        </span>
                      </label>

                      <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-[#FAF7F2] cursor-pointer hover:border-slate-300">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentGateway"
                            checked={paymentGateway === "phonepe"}
                            onChange={() => setPaymentGateway("phonepe")}
                            className="text-[#FFA429] focus:ring-[#FFA429]"
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-900">
                              PhonePe PG (Fast QR Code Scan)
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Scan QR directly on phone or payment app
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                          UPI
                        </span>
                      </label>

                      <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-[#FAF7F2] cursor-pointer hover:border-slate-300">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentGateway"
                            checked={paymentGateway === "card"}
                            onChange={() => setPaymentGateway("card")}
                            className="text-[#FFA429] focus:ring-[#FFA429]"
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-900">
                              Credit / Debit Cards (Visa, Mastercard, Amex)
                            </div>
                            <div className="text-[11px] text-slate-500">
                              EMI options available for Indian bank cards
                            </div>
                          </div>
                        </div>
                        <CreditCard className="w-5 h-5 text-slate-400" />
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-4 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleProcessPayment}
                      disabled={isProcessing}
                      className="flex-1 bg-[#0A192F] hover:bg-[#FFA429] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <span>Simulating Bank Authentication...</span>
                      ) : (
                        <span>Pay ₹{amountToPay.toLocaleString("en-IN")} & Confirm Trip</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Dynamic Price Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md sticky top-28 space-y-5">
                <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                  Fare Summary
                </h3>

                {/* Base price breakdown */}
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>
                      Base Package ({travelersCount} x ₹{tour.discountedPrice.toLocaleString("en-IN")}):
                    </span>
                    <span className="font-bold text-slate-900">
                      ₹{basePrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {addOnsTotal > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Add-ons & Upgrades:</span>
                      <span className="font-bold text-slate-900">
                        +₹{addOnsTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount ({appliedCoupon.code} -{appliedCoupon.discount}%):</span>
                      <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>GST (5% Government Tax):</span>
                    <span className="font-bold text-slate-900">
                      ₹{gstAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <div className="pt-3 border-t border-slate-100">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo code (e.g. HUMTRIP10)"
                      className="flex-1 bg-[#FAF7F2] border border-slate-300 rounded-xl px-3 py-2 text-xs uppercase text-slate-900 focus:outline-none focus:border-[#FFA429]"
                    />
                    <button
                      type="submit"
                      className="bg-[#0A192F] hover:bg-[#FFA429] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                  {couponError && <p className="text-[10px] text-rose-500 mt-1">{couponError}</p>}
                </div>

                {/* Grand Total */}
                <div className="pt-4 border-t border-slate-100 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-sm text-slate-900">Grand Total:</span>
                    <span className="font-serif font-bold text-2xl text-slate-900">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {paymentOption === "deposit" && (
                    <div className="flex items-baseline justify-between text-xs text-[#FFA429] font-bold pt-1">
                      <span>Payable Now (20% Token):</span>
                      <span className="text-base font-bold">
                        ₹{amountToPay.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Trust Seal */}
                <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Bank-grade 256-Bit SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Full refund if cancelled 15 days prior to trip</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Booking Success & Printable Tax Invoice (SRS) */}
        {step === 3 && confirmedBooking && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
            {/* Success Celebration Alert */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-white px-3.5 py-1 rounded-full shadow-sm">
                <span>Booking Confirmed</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-slate-900">
                You're Going on an Adventure!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                We have sent your confirmation voucher, packing checklist, and Trip Captain details to <strong className="text-slate-900">{leadEmail}</strong> and WhatsApp <strong className="text-slate-900">{leadPhone}</strong>.
              </p>
            </div>

            {/* Official GST Tax Invoice Card */}
            <div id="printable-invoice" className="bg-white rounded-3xl p-8 border border-slate-300 shadow-xl space-y-6 print:m-0 print:border-none">
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-6 gap-4">
                <div>
                  <div className="h-9 w-32 relative mb-2">
                    <Image
                      src="/logo.png"
                      alt="HumTripWale"
                      width={140}
                      height={45}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs text-slate-500">HumTripWale Experiences Pvt. Ltd.</p>
                  <p className="text-xs text-slate-500">GSTIN: 07AAACH1234F1Z8 | MSME Certified</p>
                  <p className="text-xs text-slate-500">Delhi & Chandigarh Departure Hubs</p>
                </div>

                <div className="text-right sm:text-right">
                  <span className="bg-[#0A192F] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                    Official Tax Invoice
                  </span>
                  <div className="mt-2 text-xs font-bold text-slate-900">
                    Invoice #: <span className="font-mono">{confirmedBooking.invoiceNumber}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Booking ID: <span className="font-mono">{confirmedBooking.id}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Date: {new Date().toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Billed To / Trip Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-6">
                <div>
                  <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                    Billed To
                  </div>
                  <div className="font-bold text-sm text-slate-900">{leadName}</div>
                  <div className="text-slate-600">{leadEmail}</div>
                  <div className="text-slate-600">{leadPhone}</div>
                </div>

                <div>
                  <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                    Expedition Details
                  </div>
                  <div className="font-bold text-sm text-slate-900">{tour.title}</div>
                  <div className="text-slate-600">Departure: {departureDate}</div>
                  <div className="text-slate-600">Travelers: {travelersCount} Person(s)</div>
                </div>
              </div>

              {/* Invoice Line Items */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-900 pb-2 border-b border-slate-100">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between text-slate-700 py-1">
                  <span>
                    {tour.title} ({travelersCount} Travelers @ ₹{tour.discountedPrice.toLocaleString("en-IN")})
                  </span>
                  <span className="font-semibold">₹{basePrice.toLocaleString("en-IN")}</span>
                </div>

                {addOnsTotal > 0 && (
                  <div className="flex justify-between text-slate-700 py-1">
                    <span>Add-ons (Insurance / Transfers / Supplement)</span>
                    <span className="font-semibold">+₹{addOnsTotal.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 py-1 font-semibold">
                    <span>Discount Coupon ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-700 py-1">
                  <span>Integrated GST (5% IGST on Tourism)</span>
                  <span className="font-semibold">₹{gstAmount.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Amount Paid</span>
                  <span className="font-serif">₹{confirmedBooking.totalPaid.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Payment Receipt Info */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>
                    Payment Gateway Ref: <strong className="font-mono">{confirmedBooking.paymentId}</strong>
                  </span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Payment Status: PAID
                </span>
              </div>

              {/* Actions: Print Invoice & Dashboard */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save as PDF
                </button>

                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="bg-[#0A192F] hover:bg-[#FFA429] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    Go to My Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center">Loading booking engine...</div>}>
      <BookingContent />
    </Suspense>
  );
}
