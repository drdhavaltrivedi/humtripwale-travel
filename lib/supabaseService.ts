import { supabase } from "./supabaseClient";
import { TourPackage, ItineraryDay } from "@/data/toursData";
import { Lead, Booking } from "@/context/AppContext";

// --- TOURS SERVICE ---

export async function fetchToursFromDb(): Promise<TourPackage[]> {
  try {
    const { data: toursData, error: toursError } = await supabase
      .from("tours")
      .select("*")
      .order("created_at", { ascending: false });

    if (toursError || !toursData) {
      console.warn("Supabase fetchTours error:", toursError?.message);
      return [];
    }

    const { data: daysData, error: daysError } = await supabase
      .from("itinerary_days")
      .select("*")
      .order("day", { ascending: true });

    if (daysError) {
      console.warn("Supabase fetchItineraryDays error:", daysError?.message);
    }

    const daysByTourId: Record<string, ItineraryDay[]> = {};
    if (daysData) {
      for (const d of daysData) {
        if (!daysByTourId[d.tour_id]) {
          daysByTourId[d.tour_id] = [];
        }
        daysByTourId[d.tour_id].push({
          day: d.day,
          title: d.title,
          description: d.description,
          meals: d.meals || "",
          stay: d.stay || "",
          activities: Array.isArray(d.activities) ? d.activities : [],
        });
      }
    }

    return toursData.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      tagline: row.tagline || "",
      destination: row.destination,
      category: row.category,
      duration: row.duration,
      durationDays: row.duration_days,
      startingPoint: row.starting_point,
      endingPoint: row.ending_point,
      minAge: row.min_age || 10,
      groupSize: row.group_size || "12-16 Travelers",
      difficulty: row.difficulty,
      originalPrice: Number(row.original_price),
      discountedPrice: Number(row.discounted_price),
      rating: Number(row.rating || 4.9),
      reviewCount: Number(row.review_count || 25),
      heroImage: row.hero_image,
      galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
      departureDates: Array.isArray(row.departure_dates) ? row.departure_dates : [],
      highlights: Array.isArray(row.highlights) ? row.highlights : [],
      inclusions: Array.isArray(row.inclusions) ? row.inclusions : [],
      exclusions: Array.isArray(row.exclusions) ? row.exclusions : [],
      stayDetails: row.stay_details || {
        hotelType: "Boutique Stays & Camps",
        roomSharing: "Double / Triple Sharing",
        amenities: ["Hot Water", "Bonfire", "Power Backup"],
      },
      transportDetails: row.transport_details || "",
      mealDetails: row.meal_details || "",
      packingList: Array.isArray(row.packing_list) ? row.packing_list : [],
      faqs: Array.isArray(row.faqs) ? row.faqs : [],
      isFeatured: Boolean(row.is_featured),
      isTrending: Boolean(row.is_trending),
      itinerary: daysByTourId[row.id] || [],
    }));
  } catch (err) {
    console.error("fetchToursFromDb exception:", err);
    return [];
  }
}

export async function createTourInDb(tour: TourPackage): Promise<boolean> {
  try {
    const { error: tourError } = await supabase.from("tours").upsert({
      id: tour.id,
      slug: tour.slug,
      title: tour.title,
      tagline: tour.tagline,
      destination: tour.destination,
      category: tour.category,
      duration: tour.duration,
      duration_days: tour.durationDays,
      starting_point: tour.startingPoint,
      ending_point: tour.endingPoint,
      min_age: tour.minAge,
      group_size: tour.groupSize,
      difficulty: tour.difficulty,
      original_price: tour.originalPrice,
      discounted_price: tour.discountedPrice,
      rating: tour.rating || 4.9,
      review_count: tour.reviewCount || 25,
      hero_image: tour.heroImage,
      gallery_images: tour.galleryImages || [],
      departure_dates: tour.departureDates || [],
      highlights: tour.highlights || [],
      inclusions: tour.inclusions || [],
      exclusions: tour.exclusions || [],
      stay_details: tour.stayDetails || {},
      transport_details: tour.transportDetails || "",
      meal_details: tour.mealDetails || "",
      packing_list: tour.packingList || [],
      faqs: tour.faqs || [],
      is_featured: Boolean(tour.isFeatured),
      is_trending: Boolean(tour.isTrending),
      updated_at: new Date().toISOString(),
    });

    if (tourError) {
      console.error("createTourInDb error:", tourError);
      return false;
    }

    if (tour.itinerary && tour.itinerary.length > 0) {
      await supabase.from("itinerary_days").delete().eq("tour_id", tour.id);

      const daysToInsert = tour.itinerary.map((d) => ({
        tour_id: tour.id,
        day: d.day,
        title: d.title,
        description: d.description,
        meals: d.meals,
        stay: d.stay,
        activities: d.activities || [],
      }));

      const { error: daysError } = await supabase
        .from("itinerary_days")
        .insert(daysToInsert);

      if (daysError) {
        console.error("createItineraryDays error:", daysError);
      }
    }

    return true;
  } catch (err) {
    console.error("createTourInDb exception:", err);
    return false;
  }
}

export async function updateTourInDb(tour: TourPackage): Promise<boolean> {
  return createTourInDb(tour);
}

export async function deleteTourFromDb(tourId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("tours").delete().eq("id", tourId);
    if (error) {
      console.error("deleteTourFromDb error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("deleteTourFromDb exception:", err);
    return false;
  }
}

// --- LEADS SERVICE ---

export async function fetchLeadsFromDb(): Promise<Lead[]> {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("fetchLeadsFromDb error:", error?.message);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || "",
      destination: row.destination,
      travelDate: row.travel_date || "",
      budget: row.budget || "",
      travelers: row.travelers || 2,
      status: row.status as Lead["status"],
      assignedTo: row.assigned_to || "Unassigned",
      notes: row.notes || "",
      createdAt: row.created_at ? row.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
    }));
  } catch (err) {
    console.error("fetchLeadsFromDb exception:", err);
    return [];
  }
}

export async function createLeadInDb(lead: Lead): Promise<boolean> {
  try {
    const { error } = await supabase.from("leads").upsert({
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      destination: lead.destination,
      travel_date: lead.travelDate,
      budget: lead.budget,
      travelers: lead.travelers,
      status: lead.status,
      assigned_to: lead.assignedTo,
      notes: lead.notes,
    });

    if (error) {
      console.error("createLeadInDb error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("createLeadInDb exception:", err);
    return false;
  }
}

export async function updateLeadStatusInDb(
  leadId: string,
  status: Lead["status"],
  notes?: string
): Promise<boolean> {
  try {
    const updatePayload: Record<string, any> = { status };
    if (notes !== undefined) {
      updatePayload.notes = notes;
    }

    const { error } = await supabase
      .from("leads")
      .update(updatePayload)
      .eq("id", leadId);

    if (error) {
      console.error("updateLeadStatusInDb error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("updateLeadStatusInDb exception:", err);
    return false;
  }
}

// --- BOOKINGS SERVICE ---

export async function fetchBookingsFromDb(): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("booked_at", { ascending: false });

    if (error || !data) {
      console.warn("fetchBookingsFromDb error:", error?.message);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      tourId: row.tour_id || "",
      tourTitle: row.tour_title,
      departureDate: row.departure_date,
      travelersCount: row.travelers_count,
      travelerNames: Array.isArray(row.traveler_names) ? row.traveler_names : [],
      totalAmount: Number(row.total_amount),
      status: (row.payment_status?.toLowerCase() as any) || "confirmed",
      paymentId: row.payment_id,
      invoiceNumber: row.invoice_number,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      createdAt: row.booked_at ? row.booked_at.split("T")[0] : new Date().toISOString().split("T")[0],
    }));
  } catch (err) {
    console.error("fetchBookingsFromDb exception:", err);
    return [];
  }
}

export async function createBookingInDb(booking: Booking): Promise<boolean> {
  try {
    const { error } = await supabase.from("bookings").upsert({
      id: booking.id,
      tour_id: booking.tourId,
      tour_title: booking.tourTitle,
      departure_date: booking.departureDate,
      travelers_count: booking.travelersCount,
      traveler_names: booking.travelerNames,
      contact_email: booking.contactEmail,
      contact_phone: booking.contactPhone,
      base_price: booking.totalAmount,
      add_ons_total: 0,
      discount_amount: 0,
      total_amount: booking.totalAmount,
      payment_status: booking.status || "confirmed",
      payment_id: booking.paymentId,
      invoice_number: booking.invoiceNumber,
    });

    if (error) {
      console.error("createBookingInDb error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("createBookingInDb exception:", err);
    return false;
  }
}
