import { NextRequest, NextResponse } from "next/server";
import { fetchToursFromDb, createTourInDb } from "@/lib/supabaseService";

export async function GET() {
  try {
    const tours = await fetchToursFromDb();
    return NextResponse.json({ success: true, count: tours.length, data: tours });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch tours" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.destination) {
      return NextResponse.json(
        { success: false, error: "Title and destination are required" },
        { status: 400 }
      );
    }
    const success = await createTourInDb(body);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to persist tour to Supabase" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, message: "Tour created successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
