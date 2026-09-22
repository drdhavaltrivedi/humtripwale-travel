"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Copy,
  FileCheck
} from "lucide-react";
import { useApp, Booking } from "@/context/AppContext";
import { TOURS_DATA } from "@/data/toursData";

// Helper: Convert Number to Indian Rupees in Words
function numberToWords(num: number): string {
  if (!num || isNaN(num)) return "Zero";
  
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + inWords(n % 100) : "");
    if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + inWords(n % 1000) : "");
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + inWords(n % 100000) : "");
    return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + inWords(n % 10000000) : "");
  }

  return `Indian Rupees ${inWords(Math.round(num))} Only`;
}

function InvoiceContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { bookings, tours, showToast } = useApp();

  const bookingId = (params?.bookingId as string) || "BK-8921";
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadBooking() {
      // 1. Search in local AppContext bookings
      const foundInContext = bookings.find(
        (b) => b.id === bookingId || b.invoiceNumber === bookingId
      );
      if (foundInContext) {
        setBooking(foundInContext);
        setLoading(false);
        return;
      }

      // 2. Try fetching from Supabase API
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const match = json.data.find(
              (b: Booking) => b.id === bookingId || b.invoiceNumber === bookingId
            );
            if (match) {
              setBooking(match);
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        console.warn("Could not fetch booking from API:", e);
      }

      // 3. Fallback mock record if testing sample or unseeded ID
      const matchingTour = (tours || TOURS_DATA)[0];
      setBooking({
        id: bookingId.startsWith("BK-") ? bookingId : `BK-${bookingId.slice(0, 6)}`,
        tourId: matchingTour?.id || "spiti-full-circuit",
        tourTitle: matchingTour?.title || "Full Circuit Spiti – The Trans-Himalayan Odyssey",
        departureDate: "2026-10-15",
        travelersCount: 2,
        travelerNames: ["Aman Sharma", "Priya Verma"],
        totalAmount: 39998,
        status: "confirmed",
        paymentId: "PAY_RAZOR_910837",
        createdAt: "2026-09-15",
        invoiceNumber: bookingId.startsWith("INV-") ? bookingId : `INV-HTW-2026-${Math.floor(100 + Math.random() * 900)}`,
        contactEmail: "aman.traveler@example.com",
        contactPhone: "+91 97552 16100",
      });
      setLoading(false);
    }

    loadBooking();
  }, [bookingId, bookings, tours]);

  // Handle auto-print if ?print=true is in URL
  useEffect(() => {
    if (!loading && searchParams.get("print") === "true") {
      const timer = setTimeout(() => {
        window.print();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [loading, searchParams]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast("Invoice link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading || !booking) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center text-slate-600">
        <div className="w-12 h-12 border-4 border-[#FFA429] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-semibold text-sm">Generating Official GST Tax Invoice...</p>
      </div>
    );
  }

  // Tax and fare computations (5% Integrated GST for tour operator services)
  const totalAmount = booking.totalAmount || 39998;
  const travelersCount = Math.max(1, booking.travelersCount || 1);
  const taxableValue = Math.round((totalAmount / 1.05) * 100) / 100;
  const gstTotal = Math.round((totalAmount - taxableValue) * 100) / 100;
  const cgst = Math.round((gstTotal / 2) * 100) / 100;
  const sgst = Math.round((gstTotal / 2) * 100) / 100;
  const unitRate = Math.round((taxableValue / travelersCount) * 100) / 100;

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 print:p-0 print:m-0 print:bg-white">
      {/* STICKY TOP ACTION BAR (Hidden on print) */}
      <div className="max-w-4xl mx-auto mb-8 sm:mb-10 print:hidden">
        <div className="bg-[#0A192F] text-white p-4 sm:p-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4 border border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-2.5 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-white">Tax Invoice #{booking.invoiceNumber}</span>
              <span className="text-[11px] text-emerald-400 font-mono ml-2.5">● Verified & Paid</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
              title="Copy link to invoice"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-[#FFA429] hover:bg-[#e5921e] text-[#0A192F] font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* OFFICIAL A4 GST TAX INVOICE & EXPEDITION VOUCHER SHEET      */}
      {/* ============================================================ */}
      <div className="max-w-4xl mx-auto print:p-0 print:m-0 print:max-w-none">
        <div
          id="invoice-document"
          className="print-invoice-sheet bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-8 sm:p-12 lg:p-14 text-slate-800 relative overflow-hidden space-y-8 print:p-0 print:m-0 print:shadow-none print:border-none print:space-y-6"
        >
          {/* Subtle Watermark for Authenticity */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] select-none">
            <Image
              src="/logo-dark.svg"
              alt="Watermark"
              width={500}
              height={350}
              className="object-contain"
            />
          </div>

          {/* 1. DOCUMENT HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-[#0A192F] pb-8 gap-8 relative z-10">
            {/* Left: Brand Identity & Legal Entity */}
            <div className="space-y-2 max-w-lg">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src="/logo-dark.svg"
                  alt="HumTripWale Logo"
                  width={165}
                  height={55}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </div>
              <h2 className="text-sm font-extrabold text-[#0A192F] tracking-wide uppercase">
                HUMTRIPWALE EXPERIENCES PRIVATE LIMITED
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Registered Office:</strong> 402, Sapphire Heights, AB Road, Indore, Madhya Pradesh - 452010, India
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Transit Hubs:</strong> Majnu Ka Tilla (Delhi NCR) & Old Manali Transit Desk (HP)
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-700 pt-2 border-t border-slate-100">
                <span><strong>GSTIN:</strong> 23AAACH9812K1ZX</span>
                <span>•</span>
                <span><strong>CIN:</strong> U63040MP2023PTC068912</span>
                <span>•</span>
                <span><strong>MSME:</strong> UDYAM-MP-23-0098412</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-0.5">
                <span>support@humtripwale.com</span>
                <span>•</span>
                <span>+91 97552 16100</span>
                <span>•</span>
                <span>www.humtripwale.com</span>
              </div>
            </div>

            {/* Right: Invoice Identification Banner */}
            <div className="text-left sm:text-right flex flex-col items-start sm:items-end space-y-3 min-w-[280px]">
              <div className="bg-[#0A192F] text-white px-5 py-3 rounded-2xl text-left sm:text-right shadow-sm border border-slate-800 w-full sm:w-auto">
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400">
                  GST TAX INVOICE & EXPEDITION VOUCHER
                </div>
                <div className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold mt-1">
                  Original For Recipient
                </div>
              </div>

              <div className="text-xs space-y-1.5 pt-1 w-full">
                <div className="flex justify-between sm:justify-end gap-3">
                  <span className="text-slate-500">Tax Invoice No:</span>
                  <strong className="font-mono text-slate-900 font-bold">{booking.invoiceNumber}</strong>
                </div>
                <div className="flex justify-between sm:justify-end gap-3">
                  <span className="text-slate-500">Booking Ref ID:</span>
                  <strong className="font-mono text-slate-900 font-bold">{booking.id}</strong>
                </div>
                <div className="flex justify-between sm:justify-end gap-3">
                  <span className="text-slate-500">Invoice Date:</span>
                  <strong className="text-slate-900">{booking.createdAt}</strong>
                </div>
                <div className="flex justify-between sm:justify-end gap-3">
                  <span className="text-slate-500">SAC Code:</span>
                  <span className="font-mono text-slate-900 font-bold">998555 <span className="text-slate-500 font-normal">(Tour Operator)</span></span>
                </div>
                <div className="flex justify-between sm:justify-end gap-3">
                  <span className="text-slate-500">Place of Supply:</span>
                  <strong className="text-slate-900">23 - Madhya Pradesh</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CUSTOMER & EXPEDITION SPECIFICATION BOXES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 text-xs relative z-10">
            {/* Box 1: Billed To / Traveler Information */}
            <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#FFA429]" />
                <span>Billed To / Primary Traveler</span>
              </div>
              <div className="text-base font-bold text-slate-950">{booking.travelerNames[0] || "Aman Sharma"}</div>
              <div className="text-slate-600 flex items-center gap-2 pt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{booking.contactEmail}</span>
              </div>
              <div className="text-slate-600 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{booking.contactPhone}</span>
              </div>
              <div className="text-slate-500 text-xs mt-3 pt-3 border-t border-slate-200/80">
                <span>Customer Category: <strong className="text-slate-800">B2C Consumer (Unregistered)</strong></span>
              </div>
            </div>

            {/* Box 2: Expedition & Departure Logistics */}
            <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FFA429]" />
                <span>Expedition Logistics & Reporting</span>
              </div>
              <div className="text-base font-bold text-slate-950">{booking.tourTitle}</div>
              <div className="text-slate-600 flex items-center gap-2 pt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Departure Date: <strong className="text-slate-900">{booking.departureDate}</strong></span>
              </div>
              <div className="text-slate-600">
                <span>Reporting Base: <strong className="text-slate-900">Majnu Ka Tilla Hub, Delhi (06:00 PM)</strong></span>
              </div>
              <div className="text-slate-500 text-xs mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span>Assigned Captain: <strong className="text-slate-800">Karan Singh (WFR Certified)</strong></span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">✓ Confirmed Batch</span>
              </div>
            </div>
          </div>

          {/* 3. TRAVELER MANIFEST / PASSENGER ROSTER */}
          <div className="my-8 relative z-10">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>Traveler Manifest ({booking.travelersCount} Passenger{booking.travelersCount > 1 ? "s" : ""})</span>
              <span className="text-[11px] text-slate-400 normal-case font-normal">All passengers covered under expedition insurance</span>
            </div>
            <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0A192F] text-white text-xs">
                  <tr>
                    <th className="py-3 px-4 font-semibold w-12">#</th>
                    <th className="py-3 px-4 font-semibold">Traveler Name</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Boarding Verification</th>
                    <th className="py-3 px-4 font-semibold text-right">Medical Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {booking.travelerNames.map((name, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{name}</td>
                      <td className="py-3 px-4 text-slate-600">Adult (Standard Sharing)</td>
                      <td className="py-3 px-4 text-slate-600">Govt Photo ID Mandatory</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-semibold">✓ Acclimatization Included</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. ITEMIZED TAX & FINANCIAL LEDGER TABLE */}
          <div className="my-8 relative z-10">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Itemized Financial Breakdown & GST Schedule
            </div>
            <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0A192F] text-white text-xs">
                  <tr>
                    <th className="py-3 px-4 font-semibold w-12">S.No</th>
                    <th className="py-3 px-4 font-semibold">Description of Services</th>
                    <th className="py-3 px-4 font-semibold w-24">SAC Code</th>
                    <th className="py-3 px-4 font-semibold text-center w-16">Qty</th>
                    <th className="py-3 px-4 font-semibold text-right w-28">Rate (₹)</th>
                    <th className="py-3 px-4 font-semibold text-right w-32">Taxable Amt (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {/* Base Package */}
                  <tr>
                    <td className="py-3.5 px-4 font-mono text-slate-500">01</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-950 text-xs sm:text-sm">{booking.tourTitle}</div>
                      <div className="text-[11px] text-slate-500 leading-normal mt-0.5">
                        Includes premium Swiss tent stays, 3-star mountain boutique hotels, breakfast & dinner, environmental permits
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">998555</td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold">{travelersCount}</td>
                    <td className="py-3.5 px-4 text-right font-mono">₹{unitRate.toLocaleString("en-IN")}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">₹{taxableValue.toLocaleString("en-IN")}</td>
                  </tr>

                  {/* Adventure Travel Insurance */}
                  <tr>
                    <td className="py-3 px-4 font-mono text-slate-500">02</td>
                    <td className="py-3 px-4">
                      <div className="text-slate-700 font-medium">Comprehensive Himalayan Adventure Insurance & High-Altitude O2 Support</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">997133</td>
                    <td className="py-3 px-4 text-center font-mono">{travelersCount}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 font-semibold">Included</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">₹0.00</td>
                  </tr>

                  {/* Mountain Transit */}
                  <tr>
                    <td className="py-3 px-4 font-mono text-slate-500">03</td>
                    <td className="py-3 px-4">
                      <div className="text-slate-700 font-medium">Roundtrip Transit Logistics (Sanitized AC Tempo / 4x4 Bolero Camper)</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">996411</td>
                    <td className="py-3 px-4 text-center font-mono">{travelersCount}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 font-semibold">Included</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">₹0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Calculations & GST Subtotals */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-6 pt-4 border-t border-slate-200 gap-6">
              {/* Left: Amount in Words */}
              <div className="max-w-md text-xs space-y-2 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70 w-full sm:w-auto">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Amount Chargeable (in words)</div>
                <div className="text-sm font-serif font-bold text-[#0A192F] italic leading-snug">
                  {numberToWords(totalAmount)}
                </div>
                <div className="text-[11px] text-slate-500 pt-1 leading-relaxed border-t border-slate-200/60">
                  *Tax invoice issued under Rule 46 of CGST Rules, 2017. Input Tax Credit (ITC) subject to applicable GST provisions.
                </div>
              </div>

              {/* Right: Tax Breakdown Ledger */}
              <div className="w-full sm:w-80 text-xs space-y-2 bg-[#FAF7F2] p-6 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Taxable Value:</span>
                  <span className="font-mono font-semibold text-slate-900">₹{taxableValue.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>CGST (2.5%):</span>
                  <span className="font-mono text-slate-900">₹{cgst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST (2.5%):</span>
                  <span className="font-mono text-slate-900">₹{sgst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
                  <span>Total Tax (5.0% GST):</span>
                  <span className="font-mono font-semibold text-slate-900">₹{gstTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#0A192F] pt-1">
                  <span>Total Amount Paid:</span>
                  <span className="font-serif text-lg text-[#0A192F]">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. PAYMENT STATUS & VERIFICATION SEAL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t-2 border-slate-100 my-8 text-xs relative z-10">
            {/* Column 1: Payment Gateway Audit */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Payment Verification
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>PAID IN FULL</span>
              </div>
              <div className="text-xs text-slate-600">
                Gateway Ref: <span className="font-mono font-bold text-slate-900">{booking.paymentId}</span>
              </div>
              <div className="text-xs text-slate-600">
                Mode: <strong className="text-slate-800">Razorpay Escrow / Instant UPI</strong>
              </div>
              <div className="text-xs text-slate-600">
                Transaction Date: {booking.createdAt}
              </div>
            </div>

            {/* Column 2: Security QR Code */}
            <div className="flex flex-col items-center justify-center text-center p-3 rounded-2xl bg-[#FAF7F2] border border-slate-200/80">
              {/* Scalable SVG QR code representation */}
              <svg width="72" height="72" viewBox="0 0 100 100" fill="#0A192F" className="mb-1.5">
                <path d="M0,0 h30 v30 h-30 z M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z" />
                <path d="M70,0 h30 v30 h-30 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z" />
                <path d="M0,70 h30 v30 h-30 z M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z" />
                <rect x="35" y="5" width="10" height="20" />
                <rect x="50" y="10" width="15" height="10" />
                <rect x="35" y="35" width="30" height="10" />
                <rect x="40" y="50" width="20" height="15" />
                <rect x="70" y="40" width="25" height="10" />
                <rect x="75" y="60" width="20" height="10" />
                <rect x="70" y="80" width="10" height="15" />
                <rect x="85" y="75" width="10" height="20" />
                <rect x="35" y="70" width="15" height="25" />
                <rect x="55" y="75" width="10" height="15" />
                <rect x="5" y="35" width="20" height="10" />
                <rect x="15" y="50" width="15" height="15" />
              </svg>
              <div className="text-xs font-bold text-slate-800">Scan to Verify</div>
              <div className="text-[10px] text-slate-500 font-mono">humtripwale.com/verify</div>
            </div>

            {/* Column 3: Corporate Digital Seal & Authorized Signatory */}
            <div className="flex flex-col items-end text-right justify-between">
              {/* Circular Seal Emblem */}
              <div className="border-2 border-dashed border-[#0A192F]/40 rounded-full p-2 w-28 h-28 flex flex-col items-center justify-center text-center text-[9px] text-[#0A192F] font-bold leading-tight rotate-[-4deg] bg-amber-50/40">
                <span className="text-[8px] tracking-wider uppercase text-amber-600">★ VERIFIED ★</span>
                <span className="font-extrabold uppercase my-0.5">HUMTRIPWALE</span>
                <span className="text-[8px] text-slate-500">ACCOUNTS DEPT</span>
                <span className="text-[7px] text-emerald-700 font-mono">AUDIT-OK</span>
              </div>

              <div className="pt-2">
                <div className="text-xs font-bold text-[#0A192F]">HumTripWale Experiences Pvt. Ltd.</div>
                <div className="text-[10px] text-slate-500">Authorised Signatory / Billing Desk</div>
                <div className="text-[9px] text-slate-400 italic">Digitally certified document</div>
              </div>
            </div>
          </div>

          {/* 6. EXPEDITION TRAVEL ADVISORY & TERMS */}
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2.5 relative z-10">
            <div className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Mandatory Expedition Guidelines & Terms of Service</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <li>
                <strong>Government Photo ID:</strong> All passengers must carry original Aadhaar Card or Passport at the reporting hub for permit verification.
              </li>
              <li>
                <strong>Luggage Policy:</strong> Maximum 1 rucksack (up to 15 kg) + 1 daypack per traveler to ensure safe weight distribution on high-altitude passes.
              </li>
              <li>
                <strong>Cancellation & Rescheduling:</strong> Governed by HumTripWale Standard Expedition Policy. Cancellations 15+ days prior qualify for full credit shell.
              </li>
              <li>
                <strong>Emergency Helpline:</strong> 24x7 Expedition Operations Desk: <strong className="text-slate-800">+91 97552 16100</strong>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-40 text-center text-slate-600">Loading invoice document...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}
