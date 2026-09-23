import { supabase } from "./supabaseClient";

export interface Departure {
  id: string;
  tourId: string | null;
  tourTitle: string;
  departureDate: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  capacity: number | null;
  notes?: string;
}

export async function fetchDepartures(): Promise<Departure[]> {
  const { data, error } = await supabase
    .from("departures")
    .select("*")
    .order("departure_date", { ascending: true });
  if (error || !data) {
    console.warn("fetchDepartures error:", error?.message);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    tourId: row.tour_id,
    tourTitle: row.tour_title,
    departureDate: row.departure_date,
    status: row.status,
    capacity: row.capacity,
    notes: row.notes || "",
  }));
}

// Finds an existing departure for this tour+date, or creates one. This is
// how Hotel/Vehicle/Captain assignment forms and the booking flow all attach
// to the same real "departure" record instead of free-text matching.
export async function upsertDeparture(input: { tourId?: string | null; tourTitle: string; departureDate: string }): Promise<string | null> {
  const { data, error } = await supabase
    .from("departures")
    .upsert(
      { tour_id: input.tourId || null, tour_title: input.tourTitle, departure_date: input.departureDate },
      { onConflict: "tour_title,departure_date", ignoreDuplicates: false }
    )
    .select("id")
    .single();

  if (error || !data) {
    console.warn("upsertDeparture error:", error?.message);
    return null;
  }
  return data.id;
}

export async function createDeparture(d: Omit<Departure, "id">): Promise<boolean> {
  const { error } = await supabase.from("departures").insert({
    tour_id: d.tourId,
    tour_title: d.tourTitle,
    departure_date: d.departureDate,
    status: d.status,
    capacity: d.capacity,
    notes: d.notes,
  });
  if (error) console.warn("createDeparture error:", error.message);
  return !error;
}

export async function updateDepartureStatus(id: string, status: Departure["status"]): Promise<boolean> {
  const { error } = await supabase.from("departures").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) console.warn("updateDepartureStatus error:", error.message);
  return !error;
}

export async function deleteDeparture(id: string): Promise<boolean> {
  const { error } = await supabase.from("departures").delete().eq("id", id);
  if (error) console.warn("deleteDeparture error:", error.message);
  return !error;
}
