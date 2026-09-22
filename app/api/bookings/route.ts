import { NextRequest, NextResponse } from "next/server";
import { fetchBookingsFromDb, createBookingInDb } from "@/lib/supabaseService";

export async function GET() {
  try {
    const bookings = await fetchBookingsFromDb();
    return NextResponse.json({ success: true, count: bookings.length, data: bookings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.tourTitle || !body.contactPhone || !body.totalAmount) {
      return NextResponse.json(
        { success: false, error: "Tour title, contact phone, and total amount are required" },
        { status: 400 }
      );
    }
    const newBooking = {
      id: body.id || `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      tourId: body.tourId || "",
      tourTitle: body.tourTitle,
      departureDate: body.departureDate || new Date().toISOString().split("T")[0],
      travelersCount: Number(body.travelersCount) || 1,
      travelerNames: Array.isArray(body.travelerNames) ? body.travelerNames : ["Traveler 1"],
      totalAmount: Number(body.totalAmount),
      status: body.status || "confirmed",
      paymentId: body.paymentId || `pay_${Date.now()}`,
      invoiceNumber: body.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      contactEmail: body.contactEmail || "",
      contactPhone: body.contactPhone,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const success = await createBookingInDb(newBooking);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to persist booking to Supabase" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Booking confirmed successfully", data: newBooking },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
