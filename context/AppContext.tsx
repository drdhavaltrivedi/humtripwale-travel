"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { TOURS_DATA, TourPackage } from "@/data/toursData";
import { BLOGS_DATA, BlogPost } from "@/data/blogsData";
import {
  fetchToursFromDb,
  createTourInDb,
  updateTourInDb,
  deleteTourFromDb,
  fetchLeadsFromDb,
  createLeadInDb,
  updateLeadStatusInDb,
  deleteLeadFromDb,
  fetchBookingsFromDb,
  createBookingInDb,
  fetchBlogsFromDb,
  createBlogInDb,
  updateBlogInDb,
  deleteBlogFromDb,
} from "@/lib/supabaseService";

export type UserRole = "guest" | "traveler" | "sales" | "admin" | "operations";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  departureDate: string;
  travelersCount: number;
  travelerNames: string[];
  totalAmount: number;
  status: "confirmed" | "pending" | "cancelled";
  paymentId: string;
  createdAt: string;
  invoiceNumber: string;
  contactEmail: string;
  contactPhone: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  destination: string;
  travelDate: string;
  budget: string;
  travelers: number;
  status: "New" | "Contacted" | "Quoted" | "Won" | "Lost";
  notes?: string;
  assignedTo?: string;
  source?: string;
  createdAt: string;
}

interface AppContextType {
  user: UserProfile | null;
  setUserRole: (role: UserRole) => void;
  wishlist: string[];
  toggleWishlist: (tourId: string) => void;
  isWishlisted: (tourId: string) => boolean;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  leads: Lead[];
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "status"> & { status?: Lead["status"]; source?: string }) => void;
  updateLeadStatus: (leadId: string, status: Lead["status"], notes?: string) => void;
  assignLead: (leadId: string, assignedTo: string) => void;
  deleteLead: (leadId: string) => void;
  convertLeadToBooking: (leadId: string, tourId?: string) => Booking | null;
  tours: TourPackage[];
  addTour: (tour: TourPackage) => void;
  updateTour: (tour: TourPackage) => void;
  deleteTour: (tourId: string) => void;
  blogs: BlogPost[];
  addBlog: (blog: BlogPost) => void;
  updateBlog: (blog: BlogPost) => void;
  deleteBlog: (blogId: string) => void;
  announcement: string;
  setAnnouncement: (text: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>({
    id: "usr-1",
    name: "Aman Sharma",
    email: "aman.traveler@example.com",
    phone: "+91 97552 16100",
    role: "traveler",
  });

  const [wishlist, setWishlist] = useState<string[]>(["spiti-full-circuit", "ladakh-road-trip"]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "BK-8921",
      tourId: "spiti-full-circuit",
      tourTitle: "Full Circuit Spiti – The Trans-Himalayan Odyssey",
      departureDate: "2026-10-15",
      travelersCount: 2,
      travelerNames: ["Aman Sharma", "Priya Verma"],
      totalAmount: 39998,
      status: "confirmed",
      paymentId: "PAY_RAZOR_910837",
      createdAt: "2026-09-15",
      invoiceNumber: "INV-HTW-2026-042",
      contactEmail: "aman.traveler@example.com",
      contactPhone: "+91 97552 16100",
    },
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "LD-101",
      name: "Rohit Malhotra",
      phone: "+91 98112 34567",
      email: "rohit.m@gmail.com",
      destination: "Spiti Valley",
      travelDate: "October 2026",
      budget: "₹20,000 - ₹30,000",
      travelers: 4,
      status: "Quoted",
      assignedTo: "Karan (Sales Lead)",
      notes: "Looking for Tempo Traveller from Delhi. Shared customized quote.",
      createdAt: "2026-09-18",
    },
    {
      id: "LD-102",
      name: "Sneha Kapur",
      phone: "+91 99201 88712",
      email: "sneha.k@outlook.com",
      destination: "Bali Tropical Odyssey",
      travelDate: "November 2026",
      budget: "₹40,000 - ₹60,000",
      travelers: 2,
      status: "New",
      assignedTo: "Pooja (International Desk)",
      notes: "Couple honeymoon trip, requested private pool villa in Seminyak.",
      createdAt: "2026-09-20",
    },
    {
      id: "LD-103",
      name: "Aditya Roy",
      phone: "+91 91234 56780",
      email: "aditya.roy@yahoo.com",
      destination: "Ladakh Road Trip",
      travelDate: "September 2026",
      budget: "₹25,000+",
      travelers: 6,
      status: "Contacted",
      assignedTo: "Karan (Sales Lead)",
      notes: "College friends group. Inquiring about bike upgrade.",
      createdAt: "2026-09-19",
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const setUserRole = (role: UserRole) => {
    if (role === "guest") {
      setUser(null);
    } else {
      setUser({
        id: "usr-1",
        name:
          role === "admin"
            ? "Vikram Malhotra (Super Admin)"
            : role === "sales"
            ? "Karan Verma (Sales Lead)"
            : role === "operations"
            ? "Captain Aarav (Field Ops)"
            : "Aman Sharma",
        email:
          role === "admin"
            ? "admin@humtripwale.com"
            : role === "sales"
            ? "karan.sales@humtripwale.com"
            : role === "operations"
            ? "aarav.ops@humtripwale.com"
            : "aman.traveler@example.com",
        phone: "+91 97552 16100",
        role,
      });
    }
    showToast(`Switched active workspace role to ${role.toUpperCase()}`);
  };

  const toggleWishlist = (tourId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(tourId);
      if (exists) {
        showToast("Removed from Wishlist");
        return prev.filter((id) => id !== tourId);
      } else {
        showToast("Added to Wishlist ❤️");
        return [...prev, tourId];
      }
    });
  };

  const isWishlisted = (tourId: string) => wishlist.includes(tourId);

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [booking, ...prev]);
    createBookingInDb(booking).catch((err) =>
      console.warn("Supabase createBooking notice:", err)
    );
    showToast("Booking Confirmed! Check your email and WhatsApp.");
  };

  const addLead = (
    leadData: Omit<Lead, "id" | "createdAt" | "status"> & {
      status?: Lead["status"];
      source?: string;
    }
  ) => {
    const newLead: Lead = {
      ...leadData,
      id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: leadData.status || "New",
      createdAt: new Date().toISOString().split("T")[0],
      assignedTo: leadData.assignedTo || "Unassigned",
      source: leadData.source || "Website Inquiry",
    };
    setLeads((prev) => [newLead, ...prev]);
    createLeadInDb(newLead).catch((err) =>
      console.warn("Supabase createLead notice:", err)
    );
    showToast("Lead registered in CRM pipeline successfully!");
  };

  const updateLeadStatus = (leadId: string, status: Lead["status"], notes?: string) => {
    setLeads((prev) =>
      prev.map((ld) =>
        ld.id === leadId
          ? { ...ld, status, ...(notes !== undefined ? { notes } : {}) }
          : ld
      )
    );
    updateLeadStatusInDb(leadId, status, notes).catch((err) =>
      console.warn("Supabase updateLeadStatus notice:", err)
    );
  };

  const assignLead = (leadId: string, assignedTo: string) => {
    setLeads((prev) =>
      prev.map((ld) => (ld.id === leadId ? { ...ld, assignedTo } : ld))
    );
    const target = leads.find((l) => l.id === leadId);
    if (target) {
      updateLeadStatusInDb(leadId, target.status, target.notes).catch(() => {});
    }
    showToast(`Lead reassigned to ${assignedTo}`);
  };

  const deleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    deleteLeadFromDb(leadId).catch((err) =>
      console.warn("Supabase deleteLead notice:", err)
    );
    showToast("Lead removed from CRM pipeline.");
  };

  const convertLeadToBooking = (leadId: string, tourId?: string): Booking | null => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return null;

    const matchedTour =
      tours.find((t) => t.id === tourId || t.destination.toLowerCase() === targetLead.destination.toLowerCase()) ||
      tours[0];

    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceNumber = `INV-HTW-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const travelersCount = targetLead.travelers || 1;
    const totalAmount = (matchedTour?.discountedPrice || 19999) * travelersCount;

    const newBooking: Booking = {
      id: bookingId,
      tourId: matchedTour.id,
      tourTitle: matchedTour.title,
      departureDate: targetLead.travelDate || "2026-10-25",
      travelersCount,
      travelerNames: [targetLead.name],
      totalAmount,
      status: "confirmed",
      paymentId: `PAY_CRM_CONV_${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().split("T")[0],
      invoiceNumber,
      contactEmail: targetLead.email || "client@humtripwale.com",
      contactPhone: targetLead.phone,
    };

    updateLeadStatus(leadId, "Won", `Converted to confirmed reservation #${bookingId}`);
    setBookings((prev) => [newBooking, ...prev]);
    createBookingInDb(newBooking).catch((err) =>
      console.warn("Supabase createBooking notice:", err)
    );
    showToast(`Lead converted to Confirmed Booking #${bookingId}! Invoice ready.`);
    return newBooking;
  };

  const [tours, setTours] = useState<TourPackage[]>(TOURS_DATA);
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOGS_DATA);
  const [announcement, setAnnouncementState] = useState<string>(
    "🔥 Autumn & Diwali Expeditions Open! Flat ₹3,000 Off per group — Use code HIMALAYA2026"
  );

  const setAnnouncement = (text: string) => {
    setAnnouncementState(text);
    try {
      localStorage.setItem("humtrip_announcement", text);
    } catch (e) {}
    showToast("Announcement banner updated!");
  };

  // Hydrate custom tour & blog changes from localStorage, then live-sync with Supabase
  useEffect(() => {
    // 1. Instant local cache hydration
    try {
      const savedTours = localStorage.getItem("humtrip_tours_catalog");
      if (savedTours) {
        const parsed = JSON.parse(savedTours);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTours(parsed);
        }
      }

      const savedBlogs = localStorage.getItem("humtrip_blogs_catalog");
      if (savedBlogs) {
        const parsedBlogs = JSON.parse(savedBlogs);
        if (Array.isArray(parsedBlogs) && parsedBlogs.length > 0) {
          setBlogs(parsedBlogs);
        }
      }

      const savedAnnounce = localStorage.getItem("humtrip_announcement");
      if (savedAnnounce) {
        setAnnouncementState(savedAnnounce);
      }
    } catch (e) {
      console.warn("Could not load cache from localStorage", e);
    }

    // 2. Cloud sync from Supabase PostgreSQL
    async function syncCloudData() {
      try {
        const [liveTours, liveLeads, liveBookings, liveBlogs] = await Promise.all([
          fetchToursFromDb(),
          fetchLeadsFromDb(),
          fetchBookingsFromDb(),
          fetchBlogsFromDb(),
        ]);

        if (liveTours && liveTours.length > 0) {
          setTours(liveTours);
          try {
            localStorage.setItem("humtrip_tours_catalog", JSON.stringify(liveTours));
          } catch (e) {}
        }

        if (liveLeads && liveLeads.length > 0) {
          setLeads(liveLeads);
        }

        if (liveBookings && liveBookings.length > 0) {
          setBookings(liveBookings);
        }

        if (liveBlogs && liveBlogs.length > 0) {
          setBlogs(liveBlogs);
          try {
            localStorage.setItem("humtrip_blogs_catalog", JSON.stringify(liveBlogs));
          } catch (e) {}
        }
      } catch (err) {
        console.warn("Supabase live sync notice:", err);
      }
    }

    syncCloudData();
  }, []);

  const saveTours = (newTours: TourPackage[]) => {
    setTours(newTours);
    try {
      localStorage.setItem("humtrip_tours_catalog", JSON.stringify(newTours));
    } catch (e) {
      console.warn("Could not save tours to localStorage", e);
    }
  };

  const addTour = (newTour: TourPackage) => {
    const updated = [newTour, ...tours];
    saveTours(updated);
    createTourInDb(newTour).catch((err) =>
      console.warn("Supabase createTour notice:", err)
    );
    showToast(`Created new tour listing: "${newTour.title}"`);
  };

  const updateTour = (updatedTour: TourPackage) => {
    const updated = tours.map((t) => (t.id === updatedTour.id ? updatedTour : t));
    saveTours(updated);
    updateTourInDb(updatedTour).catch((err) =>
      console.warn("Supabase updateTour notice:", err)
    );
    showToast(`Updated tour listing: "${updatedTour.title}"`);
  };

  const deleteTour = (tourId: string) => {
    const updated = tours.filter((t) => t.id !== tourId);
    saveTours(updated);
    deleteTourFromDb(tourId).catch((err) =>
      console.warn("Supabase deleteTour notice:", err)
    );
    showToast("Tour listing deleted successfully.");
  };

  // --- BLOGS CMS METHODS ---
  const saveBlogs = (newBlogs: BlogPost[]) => {
    setBlogs(newBlogs);
    try {
      localStorage.setItem("humtrip_blogs_catalog", JSON.stringify(newBlogs));
    } catch (e) {
      console.warn("Could not save blogs to localStorage", e);
    }
  };

  const addBlog = (newBlog: BlogPost) => {
    const updated = [newBlog, ...blogs];
    saveBlogs(updated);
    createBlogInDb(newBlog).catch((err) =>
      console.warn("Supabase createBlog notice:", err)
    );
    showToast(`Published travel guide: "${newBlog.title}"`);
  };

  const updateBlog = (updatedBlog: BlogPost) => {
    const updated = blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b));
    saveBlogs(updated);
    updateBlogInDb(updatedBlog).catch((err) =>
      console.warn("Supabase updateBlog notice:", err)
    );
    showToast(`Updated travel guide: "${updatedBlog.title}"`);
  };

  const deleteBlog = (blogId: string) => {
    const updated = blogs.filter((b) => b.id !== blogId);
    saveBlogs(updated);
    deleteBlogFromDb(blogId).catch((err) =>
      console.warn("Supabase deleteBlog notice:", err)
    );
    showToast("Travel guide deleted successfully.");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUserRole,
        wishlist,
        toggleWishlist,
        isWishlisted,
        bookings,
        addBooking,
        leads,
        addLead,
        updateLeadStatus,
        assignLead,
        deleteLead,
        convertLeadToBooking,
        tours,
        addTour,
        updateTour,
        deleteTour,
        blogs,
        addBlog,
        updateBlog,
        deleteBlog,
        announcement,
        setAnnouncement,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0A192F] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#FFA429]/30 animate-bounce-short">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFA429] animate-ping" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
