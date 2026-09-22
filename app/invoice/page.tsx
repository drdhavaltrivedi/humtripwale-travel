"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function GenericInvoiceRedirect() {
  const router = useRouter();
  const { bookings } = useApp();

  useEffect(() => {
    // If there are existing bookings, redirect to the most recent booking invoice
    if (bookings && bookings.length > 0) {
      router.replace(`/invoice/${bookings[0].id}`);
    } else {
      router.replace("/invoice/BK-8921");
    }
  }, [bookings, router]);

  return (
    <div className="min-h-screen pt-32 text-center text-slate-600">
      <div className="w-10 h-10 border-4 border-[#FFA429] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-sm font-semibold">Redirecting to official invoice...</p>
    </div>
  );
}
