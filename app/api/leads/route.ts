import { NextRequest, NextResponse } from "next/server";
import { fetchLeadsFromDb, createLeadInDb, updateLeadStatusInDb } from "@/lib/supabaseService";

export async function GET() {
  try {
    const leads = await fetchLeadsFromDb();
    return NextResponse.json({ success: true, count: leads.length, data: leads });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Name and phone number are required" },
        { status: 400 }
      );
    }
    const newLead = {
      id: body.id || `LD-${Math.floor(100 + Math.random() * 900)}`,
      name: body.name,
      phone: body.phone,
      email: body.email || "",
      destination: body.destination || "Custom Trip",
      travelDate: body.travelDate || "",
      budget: body.budget || "",
      travelers: body.travelers || 2,
      status: body.status || "New",
      assignedTo: body.assignedTo || "Unassigned",
      notes: body.notes || "",
      createdAt: new Date().toISOString().split("T")[0],
    };
    const success = await createLeadInDb(newLead);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to persist lead to Supabase" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, message: "Lead submitted successfully", data: newLead }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json(
        { success: false, error: "Lead id and status are required" },
        { status: 400 }
      );
    }
    const success = await updateLeadStatusInDb(body.id, body.status, body.notes);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to update lead status" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, message: "Lead updated successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
