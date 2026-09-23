import { supabase } from "./supabaseClient";

export interface HotelAssignment {
  id: string;
  tourId: string | null;
  tourTitle: string;
  departureDate: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  imageUrl?: string;
}

export interface VehicleAssignment {
  id: string;
  tourId: string | null;
  tourTitle: string;
  departureDate: string;
  vehicleType: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  imageUrl?: string;
}

export interface HotelCatalogItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  roomTypes: string[];
  pricePerNight: number;
  imageUrl?: string;
  amenities: string[];
  contactPhone?: string;
  description?: string;
}

export interface VehicleCatalogItem {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerDay: number;
  imageUrl?: string;
  features: string[];
  registrationNumber?: string;
  driverName?: string;
  driverPhone?: string;
  description?: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: "hotel" | "transport" | "activity" | "other";
  contactPhone: string;
  contactEmail: string;
  amountDue: number;
  amountPaid: number;
  paymentStatus: "pending" | "partial" | "paid";
  notes?: string;
}

export interface Voucher {
  id: string;
  bookingId: string | null;
  voucherType: "hotel" | "transport" | "activity" | "full_trip";
  issuedTo: string;
  details: string;
  createdAt: string;
}

// ---- Hotel Assignments & Catalog ----

export async function fetchHotelAssignments(): Promise<HotelAssignment[]> {
  const { data, error } = await supabase
    .from("hotel_assignments")
    .select("*")
    .order("departure_date", { ascending: true });
  if (error || !data) {
    console.warn("fetchHotelAssignments error:", error?.message);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    tourId: row.tour_id,
    tourTitle: row.tour_title || "",
    departureDate: row.departure_date,
    hotelName: row.hotel_name,
    location: row.location || "",
    checkIn: row.check_in || "",
    checkOut: row.check_out || "",
    rooms: row.rooms || 1,
    status: row.status,
    notes: row.notes || "",
    imageUrl: row.image_url || undefined,
  }));
}

export async function createHotelAssignment(h: Omit<HotelAssignment, "id">): Promise<boolean> {
  const { error } = await supabase.from("hotel_assignments").insert({
    tour_id: h.tourId,
    tour_title: h.tourTitle,
    departure_date: h.departureDate,
    hotel_name: h.hotelName,
    location: h.location,
    check_in: h.checkIn || null,
    check_out: h.checkOut || null,
    rooms: h.rooms,
    status: h.status,
    notes: h.notes,
    image_url: h.imageUrl || null,
  });
  if (error) console.warn("createHotelAssignment error:", error.message);
  return !error;
}

export async function fetchHotelCatalog(): Promise<HotelCatalogItem[]> {
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .order("name", { ascending: true });
  if (error || !data) {
    console.warn("fetchHotelCatalog error:", error?.message);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    location: row.location,
    rating: Number(row.rating) || 4.8,
    roomTypes: row.room_types || [],
    pricePerNight: Number(row.price_per_night) || 0,
    imageUrl: row.image_url || undefined,
    amenities: row.amenities || [],
    contactPhone: row.contact_phone || undefined,
    description: row.description || undefined,
  }));
}

export async function updateHotelAssignmentStatus(id: string, status: HotelAssignment["status"]): Promise<boolean> {
  const { error } = await supabase.from("hotel_assignments").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) console.warn("updateHotelAssignmentStatus error:", error.message);
  return !error;
}

export async function deleteHotelAssignment(id: string): Promise<boolean> {
  const { error } = await supabase.from("hotel_assignments").delete().eq("id", id);
  if (error) console.warn("deleteHotelAssignment error:", error.message);
  return !error;
}

// ---- Vehicle Assignments & Catalog ----

export async function fetchVehicleAssignments(): Promise<VehicleAssignment[]> {
  const { data, error } = await supabase
    .from("vehicle_assignments")
    .select("*")
    .order("departure_date", { ascending: true });
  if (error || !data) {
    console.warn("fetchVehicleAssignments error:", error?.message);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    tourId: row.tour_id,
    tourTitle: row.tour_title || "",
    departureDate: row.departure_date,
    vehicleType: row.vehicle_type,
    vehicleNumber: row.vehicle_number || "",
    driverName: row.driver_name || "",
    driverPhone: row.driver_phone || "",
    status: row.status,
    notes: row.notes || "",
    imageUrl: row.image_url || undefined,
  }));
}

export async function createVehicleAssignment(v: Omit<VehicleAssignment, "id">): Promise<boolean> {
  const { error } = await supabase.from("vehicle_assignments").insert({
    tour_id: v.tourId,
    tour_title: v.tourTitle,
    departure_date: v.departureDate,
    vehicle_type: v.vehicleType,
    vehicle_number: v.vehicleNumber,
    driver_name: v.driverName,
    driver_phone: v.driverPhone,
    status: v.status,
    notes: v.notes,
    image_url: v.imageUrl || null,
  });
  if (error) console.warn("createVehicleAssignment error:", error.message);
  return !error;
}

export async function fetchVehicleCatalog(): Promise<VehicleCatalogItem[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("name", { ascending: true });
  if (error || !data) {
    console.warn("fetchVehicleCatalog error:", error?.message);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    capacity: Number(row.capacity) || 12,
    pricePerDay: Number(row.price_per_day) || 0,
    imageUrl: row.image_url || undefined,
    features: row.features || [],
    registrationNumber: row.registration_number || undefined,
    driverName: row.driver_name || undefined,
    driverPhone: row.driver_phone || undefined,
    description: row.description || undefined,
  }));
}

export async function updateVehicleAssignmentStatus(id: string, status: VehicleAssignment["status"]): Promise<boolean> {
  const { error } = await supabase.from("vehicle_assignments").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) console.warn("updateVehicleAssignmentStatus error:", error.message);
  return !error;
}

export async function deleteVehicleAssignment(id: string): Promise<boolean> {
  const { error } = await supabase.from("vehicle_assignments").delete().eq("id", id);
  if (error) console.warn("deleteVehicleAssignment error:", error.message);
  return !error;
}

// ---- Vendors (finance) ----

export async function fetchVendors(): Promise<Vendor[]> {
  const { data, error } = await supabase.from("vendors").select("*").order("created_at", { ascending: false });
  if (error || !data) {
    console.warn("fetchVendors error:", error?.message);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    contactPhone: row.contact_phone || "",
    contactEmail: row.contact_email || "",
    amountDue: Number(row.amount_due || 0),
    amountPaid: Number(row.amount_paid || 0),
    paymentStatus: row.payment_status,
    notes: row.notes || "",
  }));
}

export async function createVendor(v: Omit<Vendor, "id">): Promise<boolean> {
  const { error } = await supabase.from("vendors").insert({
    name: v.name,
    type: v.type,
    contact_phone: v.contactPhone,
    contact_email: v.contactEmail,
    amount_due: v.amountDue,
    amount_paid: v.amountPaid,
    payment_status: v.paymentStatus,
    notes: v.notes,
  });
  if (error) console.warn("createVendor error:", error.message);
  return !error;
}

export async function updateVendorPayment(id: string, amountPaid: number, paymentStatus: Vendor["paymentStatus"]): Promise<boolean> {
  const { error } = await supabase
    .from("vendors")
    .update({ amount_paid: amountPaid, payment_status: paymentStatus, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.warn("updateVendorPayment error:", error.message);
  return !error;
}

export async function deleteVendor(id: string): Promise<boolean> {
  const { error } = await supabase.from("vendors").delete().eq("id", id);
  if (error) console.warn("deleteVendor error:", error.message);
  return !error;
}

// ---- Vouchers ----

export async function fetchVouchers(): Promise<Voucher[]> {
  const { data, error } = await supabase.from("vouchers").select("*").order("created_at", { ascending: false });
  if (error || !data) {
    console.warn("fetchVouchers error:", error?.message);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    bookingId: row.booking_id,
    voucherType: row.voucher_type,
    issuedTo: row.issued_to,
    details: row.details || "",
    createdAt: row.created_at,
  }));
}

export async function createVoucher(v: Voucher, issuedBy: string): Promise<boolean> {
  const { error } = await supabase.from("vouchers").insert({
    id: v.id,
    booking_id: v.bookingId,
    voucher_type: v.voucherType,
    issued_to: v.issuedTo,
    details: v.details,
    issued_by: issuedBy,
  });
  if (error) console.warn("createVoucher error:", error.message);
  return !error;
}
