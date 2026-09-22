"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "guest" | "traveler" | "sales" | "admin";

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
  createdAt: string;
}

import { TOURS_DATA, TourPackage } from "@/data/toursData";

interface AppContextType {
  user: UserProfile | null;
  setUserRole: (role: UserRole) => void;
  wishlist: string[];
  toggleWishlist: (tourId: string) => void;
  isWishlisted: (tourId: string) => boolean;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  leads: Lead[];
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "status">) => void;
  updateLeadStatus: (leadId: string, status: Lead["status"], notes?: string) => void;
  tours: TourPackage[];
  addTour: (tour: TourPackage) => void;
  updateTour: (tour: TourPackage) => void;
  deleteTour: (tourId: string) => void;
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
        name: role === "admin" ? "Super Admin" : role === "sales" ? "Sales Executive" : "Aman Sharma",
        email: role === "admin" ? "admin@humtripwale.com" : role === "sales" ? "sales@humtripwale.com" : "aman.traveler@example.com",
        phone: "+91 97552 16100",
        role,
      });
    }
    showToast(`Switched view to ${role.toUpperCase()}`);
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
    showToast("Booking Confirmed! Check your email and WhatsApp.");
  };

  const addLead = (leadData: Omit<Lead, "id" | "createdAt" | "status">) => {
    const newLead: Lead = {
      ...leadData,
      id: `LD-${Math.floor(100 + Math.random() * 900)}`,
      status: "New",
      createdAt: new Date().toISOString().split("T")[0],
      assignedTo: "Unassigned",
    };
    setLeads((prev) => [newLead, ...prev]);
    showToast("Trip request sent! Our travel captain will call you shortly.");
  };

  const updateLeadStatus = (leadId: string, status: Lead["status"], notes?: string) => {
    setLeads((prev) =>
      prev.map((ld) =>
        ld.id === leadId
          ? { ...ld, status, ...(notes ? { notes } : {}) }
          : ld
      )
    );
  };

  const [tours, setTours] = useState<TourPackage[]>(TOURS_DATA);

  // Hydrate custom tour changes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("humtrip_tours_catalog");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTours(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load tours from localStorage", e);
    }
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
    showToast(`Created new tour listing: "${newTour.title}"`);
  };

  const updateTour = (updatedTour: TourPackage) => {
    const updated = tours.map((t) => (t.id === updatedTour.id ? updatedTour : t));
    saveTours(updated);
    showToast(`Updated tour listing: "${updatedTour.title}"`);
  };

  const deleteTour = (tourId: string) => {
    const updated = tours.filter((t) => t.id !== tourId);
    saveTours(updated);
    showToast("Tour listing deleted successfully.");
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
        tours,
        addTour,
        updateTour,
        deleteTour,
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
