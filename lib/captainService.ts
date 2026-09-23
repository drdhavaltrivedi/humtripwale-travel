import { supabase } from "./supabaseClient";

export interface TripAssignment {
  id: string;
  captainId: string | null;
  tourId: string | null;
  tourTitle: string;
  departureDate: string;
  bookingIds: string[];
  status: "scheduled" | "ongoing" | "completed";
}

export interface TripAttendanceEntry {
  id: string;
  tripId: string;
  travelerName: string;
  present: boolean;
  markedAt: string | null;
}

export interface TripPhoto {
  id: string;
  tripId: string;
  url: string;
  caption: string;
  uploadedAt: string;
}

export interface TripNotification {
  id: string;
  tripId: string;
  message: string;
  sentAt: string;
}

export async function fetchMyTrips(): Promise<TripAssignment[]> {
  const { data, error } = await supabase
    .from("trip_assignments")
    .select("*")
    .order("departure_date", { ascending: true });
  if (error || !data) {
    console.warn("fetchMyTrips error:", error?.message);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    captainId: row.captain_id,
    tourId: row.tour_id,
    tourTitle: row.tour_title,
    departureDate: row.departure_date,
    bookingIds: row.booking_ids || [],
    status: row.status,
  }));
}

export async function updateTripStatus(id: string, status: TripAssignment["status"]): Promise<boolean> {
  const { error } = await supabase.from("trip_assignments").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) console.warn("updateTripStatus error:", error.message);
  return !error;
}

// Operations/Admin only — assigns a captain to a departure.
export async function createTripAssignment(t: Omit<TripAssignment, "id">): Promise<boolean> {
  const { error } = await supabase.from("trip_assignments").insert({
    captain_id: t.captainId,
    tour_id: t.tourId,
    tour_title: t.tourTitle,
    departure_date: t.departureDate,
    booking_ids: t.bookingIds,
    status: t.status,
  });
  if (error) console.warn("createTripAssignment error:", error.message);
  return !error;
}

// Operations/Admin only — removes a captain assignment (e.g. reassigning).
export async function deleteTripAssignment(id: string): Promise<boolean> {
  const { error } = await supabase.from("trip_assignments").delete().eq("id", id);
  if (error) console.warn("deleteTripAssignment error:", error.message);
  return !error;
}

export async function fetchAttendance(tripId: string): Promise<TripAttendanceEntry[]> {
  const { data, error } = await supabase.from("trip_attendance").select("*").eq("trip_id", tripId);
  if (error || !data) {
    console.warn("fetchAttendance error:", error?.message);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    tripId: row.trip_id,
    travelerName: row.traveler_name,
    present: row.present,
    markedAt: row.marked_at,
  }));
}

export async function seedAttendance(tripId: string, travelerNames: string[]): Promise<boolean> {
  if (travelerNames.length === 0) return true;
  const { error } = await supabase
    .from("trip_attendance")
    .insert(travelerNames.map((name) => ({ trip_id: tripId, traveler_name: name, present: false })));
  if (error) console.warn("seedAttendance error:", error.message);
  return !error;
}

export async function markAttendance(id: string, present: boolean): Promise<boolean> {
  const { error } = await supabase
    .from("trip_attendance")
    .update({ present, marked_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.warn("markAttendance error:", error.message);
  return !error;
}

export async function fetchTripPhotos(tripId: string): Promise<TripPhoto[]> {
  const { data, error } = await supabase.from("trip_photos").select("*").eq("trip_id", tripId).order("uploaded_at", { ascending: false });
  if (error || !data) {
    console.warn("fetchTripPhotos error:", error?.message);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    tripId: row.trip_id,
    url: row.url,
    caption: row.caption || "",
    uploadedAt: row.uploaded_at,
  }));
}

export async function addTripPhoto(tripId: string, url: string, caption: string): Promise<boolean> {
  const { error } = await supabase.from("trip_photos").insert({ trip_id: tripId, url, caption });
  if (error) console.warn("addTripPhoto error:", error.message);
  return !error;
}

export async function fetchTripNotifications(tripId: string): Promise<TripNotification[]> {
  const { data, error } = await supabase.from("trip_notifications").select("*").eq("trip_id", tripId).order("sent_at", { ascending: false });
  if (error || !data) {
    console.warn("fetchTripNotifications error:", error?.message);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    tripId: row.trip_id,
    message: row.message,
    sentAt: row.sent_at,
  }));
}

export async function sendTripNotification(tripId: string, message: string): Promise<boolean> {
  const { error } = await supabase.from("trip_notifications").insert({ trip_id: tripId, message });
  if (error) console.warn("sendTripNotification error:", error.message);
  return !error;
}
