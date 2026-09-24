"use client";

import React, { useEffect, useState } from "react";
import { Hotel, Car, Wallet, FileText, UserCheck, Plus, CheckCircle2, Clock, XCircle, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  HotelAssignment,
  VehicleAssignment,
  Vendor,
  Voucher,
  fetchHotelAssignments,
  createHotelAssignment,
  updateHotelAssignment,
  updateHotelAssignmentStatus,
  deleteHotelAssignment,
  fetchVehicleAssignments,
  createVehicleAssignment,
  updateVehicleAssignment,
  updateVehicleAssignmentStatus,
  deleteVehicleAssignment,
  fetchVendors,
  createVendor,
  updateVendor,
  updateVendorPayment,
  deleteVendor,
  fetchVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "@/lib/operationsService";
import {
  createTripAssignment,
  updateTripAssignment,
  deleteTripAssignment,
  fetchMyTrips,
  TripAssignment,
} from "@/lib/captainService";
import { Departure, fetchDepartures, upsertDeparture } from "@/lib/departuresService";
import { Booking } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";

type SubTab = "hotels" | "vehicles" | "vendors" | "vouchers" | "captains";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  partial: "bg-amber-50 text-amber-700 border-amber-200",
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${STATUS_STYLES[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {status}
    </span>
  );
}

export default function OperationsLogistics() {
  const { bookings, showToast } = useApp();
  const [subTab, setSubTab] = useState<SubTab>("hotels");

  const [hotels, setHotels] = useState<HotelAssignment[]>([]);
  const [vehicles, setVehicles] = useState<VehicleAssignment[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [captains, setCaptains] = useState<{ id: string; fullName: string; email: string }[]>([]);
  const [trips, setTrips] = useState<TripAssignment[]>([]);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal open states
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showCaptainModal, setShowCaptainModal] = useState(false);

  // Edit targets
  const [editingHotel, setEditingHotel] = useState<HotelAssignment | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<VehicleAssignment | null>(null);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [editingTrip, setEditingTrip] = useState<TripAssignment | null>(null);

  const refresh = async () => {
    setLoading(true);
    const [h, v, vd, vc, t, dep, { data: caps }] = await Promise.all([
      fetchHotelAssignments(),
      fetchVehicleAssignments(),
      fetchVendors(),
      fetchVouchers(),
      fetchMyTrips(),
      fetchDepartures(),
      supabase.from("profiles").select("id, full_name, email").eq("role", "trip_captain"),
    ]);
    setHotels(h);
    setVehicles(v);
    setVendors(vd);
    setVouchers(vc);
    setTrips(t);
    setDepartures(dep);
    const loadedCaptains = (caps || []).map((c: any) => ({
      id: c.id,
      fullName: c.full_name || c.email,
      email: c.email,
    }));
    setCaptains(
      loadedCaptains.length > 0
        ? loadedCaptains
        : [
            { id: "0990be7e-25a8-4436-a35a-1fb0faae1947", fullName: "Captain Rinchen Norbu (Expedition Lead)", email: "captain@demo.com" },
            { id: "cpt-stanzin", fullName: "Captain Stanzin Dorjay (High-Altitude Specialist)", email: "stanzin@humtripwale.com" },
            { id: "cpt-aarav", fullName: "Captain Aarav Dogra (Lead Moto Marshall)", email: "aarav@humtripwale.com" },
            { id: "cpt-meera", fullName: "Captain Meera Joshi (Wildlife & Culture Lead)", email: "meera@humtripwale.com" },
          ]
    );
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const subTabs: { id: SubTab; label: string; icon: any; count: number }[] = [
    { id: "hotels", label: "Hotels", icon: Hotel, count: hotels.length },
    { id: "vehicles", label: "Vehicles", icon: Car, count: vehicles.length },
    { id: "vendors", label: "Vendor Finance", icon: Wallet, count: vendors.length },
    { id: "vouchers", label: "Vouchers", icon: FileText, count: vouchers.length },
    { id: "captains", label: "Trip Captains", icon: UserCheck, count: trips.length },
  ];

  return (
    <div>
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
        {subTabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                subTab === t.id
                  ? "bg-[#0A192F] text-white shadow-sm ring-2 ring-[#0A192F]/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4 text-[#FFA429]" />
              <span>{t.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${subTab === t.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl text-slate-400 text-sm">
          Loading operations logistics data…
        </div>
      ) : (
        <>
          {/* ============ HOTELS SUBTAB ============ */}
          {subTab === "hotels" && (
            <Section
              title="Hotel Assignments"
              count={hotels.length}
              onAdd={() => {
                setEditingHotel(null);
                setShowHotelModal(true);
              }}
            >
              {hotels.length === 0 && <EmptyState label="No hotel assignments recorded yet." />}
              {hotels.map((h) => (
                <div key={h.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap hover:shadow-md hover:border-slate-300 transition-all">
                  <div className="flex items-center gap-4 min-w-[280px]">
                    {h.imageUrl ? (
                      <img
                        src={h.imageUrl}
                        alt={h.hotelName}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                        <Hotel className="w-8 h-8" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-sm text-slate-900">{h.hotelName} <span className="text-slate-400 font-normal">— {h.location}</span></div>
                      <div className="text-xs text-slate-600 mt-0.5">{h.tourTitle} · Departs {h.departureDate} · <span className="font-bold text-slate-800">{h.rooms} room(s)</span></div>
                      {h.checkIn && <div className="text-xs text-slate-400 mt-0.5">Stay: {h.checkIn} → {h.checkOut}</div>}
                      {h.notes && <div className="text-xs text-slate-500 mt-1 line-clamp-1 italic bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{h.notes}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={h.status} />
                    {h.status !== "confirmed" && (
                      <button
                        onClick={async () => {
                          await updateHotelAssignmentStatus(h.id, "confirmed");
                          showToast("Hotel confirmed");
                          refresh();
                        }}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                      >
                        Confirm
                      </button>
                    )}
                    <RowActions
                      onEdit={() => {
                        setEditingHotel(h);
                        setShowHotelModal(true);
                      }}
                      onDelete={async () => {
                        if (!confirm(`Delete hotel assignment "${h.hotelName}"?`)) return;
                        await deleteHotelAssignment(h.id);
                        showToast("Hotel assignment deleted");
                        refresh();
                      }}
                    />
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* ============ VEHICLES SUBTAB ============ */}
          {subTab === "vehicles" && (
            <Section
              title="Vehicle Assignments"
              count={vehicles.length}
              onAdd={() => {
                setEditingVehicle(null);
                setShowVehicleModal(true);
              }}
            >
              {vehicles.length === 0 && <EmptyState label="No vehicle assignments recorded yet." />}
              {vehicles.map((v) => (
                <div key={v.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap hover:shadow-md hover:border-slate-300 transition-all">
                  <div className="flex items-center gap-4 min-w-[280px]">
                    {v.imageUrl ? (
                      <img
                        src={v.imageUrl}
                        alt={v.vehicleType}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                        <Car className="w-8 h-8" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-2 flex-wrap">
                        <span>{v.vehicleType}</span>
                        {v.vehicleNumber && (
                          <span className="font-mono text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 font-bold">
                            {v.vehicleNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">{v.tourTitle} · Departs {v.departureDate}</div>
                      {v.driverName && <div className="text-xs text-slate-500 mt-0.5">Driver: <span className="font-bold text-slate-700">{v.driverName}</span> {v.driverPhone && `· ${v.driverPhone}`}</div>}
                      {v.notes && <div className="text-xs text-slate-500 mt-1 line-clamp-1 italic bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{v.notes}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={v.status} />
                    {v.status !== "confirmed" && (
                      <button
                        onClick={async () => {
                          await updateVehicleAssignmentStatus(v.id, "confirmed");
                          showToast("Vehicle confirmed");
                          refresh();
                        }}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                      >
                        Confirm
                      </button>
                    )}
                    <RowActions
                      onEdit={() => {
                        setEditingVehicle(v);
                        setShowVehicleModal(true);
                      }}
                      onDelete={async () => {
                        if (!confirm(`Delete vehicle assignment "${v.vehicleType}"?`)) return;
                        await deleteVehicleAssignment(v.id);
                        showToast("Vehicle assignment deleted");
                        refresh();
                      }}
                    />
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* ============ VENDOR FINANCE SUBTAB ============ */}
          {subTab === "vendors" && (
            <Section
              title="Vendor Finance & Payables"
              count={vendors.length}
              onAdd={() => {
                setEditingVendor(null);
                setShowVendorModal(true);
              }}
            >
              {vendors.length === 0 && <EmptyState label="No vendor records added yet." />}
              {vendors.map((v) => (
                <div key={v.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap hover:shadow-md hover:border-slate-300 transition-all">
                  <div>
                    <div className="font-bold text-sm text-slate-900 capitalize flex items-center gap-2">
                      <span>{v.name}</span>
                      <span className="text-slate-400 font-normal text-xs uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                        {v.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Due: <span className="font-bold text-slate-800">₹{v.amountDue.toLocaleString()}</span> · Paid: <span className="font-bold text-emerald-600">₹{v.amountPaid.toLocaleString()}</span> · Balance: <span className="font-bold text-rose-600">₹{Math.max(0, v.amountDue - v.amountPaid).toLocaleString()}</span>
                    </div>
                    {v.contactPhone && <div className="text-xs text-slate-400 mt-0.5">{v.contactPhone} {v.contactEmail && `· ${v.contactEmail}`}</div>}
                    {v.notes && <div className="text-xs text-slate-500 mt-1 italic bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{v.notes}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={v.paymentStatus} />
                    {v.paymentStatus !== "paid" && (
                      <button
                        onClick={async () => {
                          await updateVendorPayment(v.id, v.amountDue, "paid");
                          showToast("Marked as fully paid");
                          refresh();
                        }}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                      >
                        Mark Paid
                      </button>
                    )}
                    <RowActions
                      onEdit={() => {
                        setEditingVendor(v);
                        setShowVendorModal(true);
                      }}
                      onDelete={async () => {
                        if (!confirm(`Delete vendor "${v.name}"?`)) return;
                        await deleteVendor(v.id);
                        showToast("Vendor deleted");
                        refresh();
                      }}
                    />
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* ============ VOUCHERS SUBTAB ============ */}
          {subTab === "vouchers" && (
            <Section
              title="Official Travel Vouchers"
              count={vouchers.length}
              onAdd={() => {
                setEditingVoucher(null);
                setShowVoucherModal(true);
              }}
            >
              {vouchers.length === 0 && <EmptyState label="No vouchers generated yet." />}
              {vouchers.map((v) => (
                <div key={v.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap hover:shadow-md hover:border-slate-300 transition-all">
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 font-bold">{v.id}</span>
                      <span className="text-slate-400 font-normal text-xs capitalize">({v.voucherType} voucher)</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Issued to <span className="font-bold text-slate-800">{v.issuedTo}</span> {v.bookingId && `· Linked Booking: ${v.bookingId}`}</div>
                    {v.details && <div className="text-xs text-slate-500 mt-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">{v.details}</div>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">{new Date(v.createdAt).toLocaleDateString()}</span>
                    <RowActions
                      onEdit={() => {
                        setEditingVoucher(v);
                        setShowVoucherModal(true);
                      }}
                      onDelete={async () => {
                        if (!confirm(`Delete voucher ${v.id}?`)) return;
                        await deleteVoucher(v.id);
                        showToast("Voucher deleted");
                        refresh();
                      }}
                    />
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* ============ TRIP CAPTAINS SUBTAB ============ */}
          {subTab === "captains" && (
            <Section
              title="Assign Trip Captains"
              count={trips.length}
              onAdd={() => {
                setEditingTrip(null);
                setShowCaptainModal(true);
              }}
            >
              {trips.length === 0 && <EmptyState label="No captains assigned to any departure yet." />}
              {trips.map((t) => {
                const assignedCaptain = captains.find((c) => c.id === t.captainId);
                return (
                  <div key={t.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap hover:shadow-md hover:border-slate-300 transition-all">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{t.tourTitle}</div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        Departs: <span className="font-bold text-slate-800">{t.departureDate}</span> · Assigned Captain: <span className="font-bold text-[#FFA429]">{assignedCaptain?.fullName || "Captain Rinchen Norbu (Expedition Lead)"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.status} />
                      <RowActions
                        onEdit={() => {
                          setEditingTrip(t);
                          setShowCaptainModal(true);
                        }}
                        onDelete={async () => {
                          if (!confirm(`Remove Trip Captain assignment for "${t.tourTitle}"?`)) return;
                          await deleteTripAssignment(t.id);
                          showToast("Trip Captain assignment removed");
                          refresh();
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </Section>
          )}
        </>
      )}

      {/* ============ MODAL POPUPS ============ */}

      {/* 1. Hotel Modal Popup */}
      {showHotelModal && (
        <HotelForm
          initial={editingHotel}
          departures={departures}
          onCancel={() => {
            setShowHotelModal(false);
            setEditingHotel(null);
          }}
          onSave={async (data) => {
            if (editingHotel) {
              await updateHotelAssignment(editingHotel.id, data);
              showToast("Hotel assignment updated");
            } else {
              await createHotelAssignment(data);
              showToast("Hotel assignment created");
            }
            setShowHotelModal(false);
            setEditingHotel(null);
            refresh();
          }}
        />
      )}

      {/* 2. Vehicle Modal Popup */}
      {showVehicleModal && (
        <VehicleForm
          initial={editingVehicle}
          departures={departures}
          onCancel={() => {
            setShowVehicleModal(false);
            setEditingVehicle(null);
          }}
          onSave={async (data) => {
            if (editingVehicle) {
              await updateVehicleAssignment(editingVehicle.id, data);
              showToast("Vehicle assignment updated");
            } else {
              await createVehicleAssignment(data);
              showToast("Vehicle assignment created");
            }
            setShowVehicleModal(false);
            setEditingVehicle(null);
            refresh();
          }}
        />
      )}

      {/* 3. Vendor Modal Popup */}
      {showVendorModal && (
        <VendorForm
          initial={editingVendor}
          onCancel={() => {
            setShowVendorModal(false);
            setEditingVendor(null);
          }}
          onSave={async (data) => {
            if (editingVendor) {
              await updateVendor(editingVendor.id, data);
              showToast("Vendor updated");
            } else {
              await createVendor(data);
              showToast("Vendor added");
            }
            setShowVendorModal(false);
            setEditingVendor(null);
            refresh();
          }}
        />
      )}

      {/* 4. Voucher Modal Popup */}
      {showVoucherModal && (
        <VoucherForm
          initial={editingVoucher}
          bookings={bookings}
          onCancel={() => {
            setShowVoucherModal(false);
            setEditingVoucher(null);
          }}
          onSave={async (data) => {
            if (editingVoucher) {
              await updateVoucher(editingVoucher.id, data);
              showToast(`Voucher ${editingVoucher.id} updated`);
            } else {
              const {
                data: { user },
              } = await supabase.auth.getUser();
              await createVoucher(data, user?.id || "");
              showToast(`Voucher ${data.id} generated`);
            }
            setShowVoucherModal(false);
            setEditingVoucher(null);
            refresh();
          }}
        />
      )}

      {/* 5. Captain Assignment Modal Popup */}
      {showCaptainModal && (
        <CaptainAssignForm
          initial={editingTrip}
          departures={departures}
          captains={captains}
          bookings={bookings}
          onCancel={() => {
            setShowCaptainModal(false);
            setEditingTrip(null);
          }}
          onSave={async (data) => {
            if (editingTrip) {
              await updateTripAssignment(editingTrip.id, data);
              showToast("Trip Captain assignment updated");
            } else {
              await createTripAssignment(data);
              showToast("Trip Captain assigned");
            }
            setShowCaptainModal(false);
            setEditingTrip(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

// ============ UI HELPER COMPONENTS ============

function Section({
  title,
  count,
  onAdd,
  children,
}: {
  title: string;
  count?: number;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-base text-slate-900">{title}</h3>
          {typeof count === "number" && (
            <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
              {count}
            </span>
          )}
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 bg-[#FFA429] hover:bg-[#e08b18] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-12 text-sm text-slate-400 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
      {label}
    </div>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3 ml-1">
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-[#FFA429] hover:text-white transition-all shadow-xs"
        title="Edit in popup modal"
      >
        <Pencil className="w-3.5 h-3.5" />
        <span>Edit</span>
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        title="Delete"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ============ MODAL SHELL COMPONENT ============

function ModalShell({
  title,
  subtitle,
  onCancel,
  onSubmit,
  children,
  saveLabel = "Save Changes",
}: {
  title: string;
  subtitle?: string;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  saveLabel?: string;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/70 sticky top-0 z-10 backdrop-blur-md">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {children}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-bold text-slate-600 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0A192F] hover:bg-[#152a4a] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-[#0A192F]/10 transition-all hover:shadow-lg"
            >
              {saveLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls = "w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFA429]/40 bg-white text-slate-800 transition-all";

interface DepartureFields {
  departureId: string;
  tourId: string | null;
  tourTitle: string;
  departureDate: string;
}

// Structured departure picker — resolves to a real `departures` row instead of
// free-text tour/date matching. Picking "custom" reveals manual fields and
// upserts a new departure record on save (see resolveDeparture below).
function DeparturePicker({
  departures,
  value,
  onChange,
}: {
  departures: Departure[];
  value: DepartureFields;
  onChange: (v: DepartureFields) => void;
}) {
  const isKnown = departures.some((d) => d.id === value.departureId);
  return (
    <>
      <div className="col-span-2">
        <label className="block text-[11px] font-bold text-slate-700 mb-1">Departure *</label>
        <select
          required
          className={inputCls}
          value={isKnown ? value.departureId : "__custom__"}
          onChange={(e) => {
            if (e.target.value === "__custom__") {
              onChange({ departureId: "", tourId: null, tourTitle: "", departureDate: "" });
            } else {
              const d = departures.find((x) => x.id === e.target.value)!;
              onChange({ departureId: d.id, tourId: d.tourId, tourTitle: d.tourTitle, departureDate: d.departureDate });
            }
          }}
        >
          <option value="__custom__">+ New / custom departure…</option>
          {departures.map((d) => (
            <option key={d.id} value={d.id}>{d.tourTitle} — {d.departureDate}</option>
          ))}
        </select>
      </div>
      {!isKnown && (
        <>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Tour / Departure Title *</label>
            <input required placeholder="e.g. Full Circuit Spiti" className={inputCls} value={value.tourTitle} onChange={(e) => onChange({ ...value, tourTitle: e.target.value })} />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Departure Date *</label>
            <input required placeholder="YYYY-MM-DD" className={inputCls} value={value.departureDate} onChange={(e) => onChange({ ...value, departureDate: e.target.value })} />
          </div>
        </>
      )}
    </>
  );
}

// Resolves a DepartureFields value to a real departure_id, creating the
// departure record first if the user picked "custom".
async function resolveDeparture(f: DepartureFields): Promise<DepartureFields> {
  if (f.departureId) return f;
  const id = await upsertDeparture({ tourId: f.tourId, tourTitle: f.tourTitle, departureDate: f.departureDate });
  return { ...f, departureId: id || "" };
}

// ============ POPUP FORMS ============

function HotelForm({
  initial,
  departures,
  onCancel,
  onSave,
}: {
  initial?: HotelAssignment | null;
  departures: Departure[];
  onCancel: () => void;
  onSave: (d: any) => void;
}) {
  const [dep, setDep] = useState<DepartureFields>(
    initial
      ? { departureId: initial.departureId || "", tourId: initial.tourId, tourTitle: initial.tourTitle, departureDate: initial.departureDate }
      : { departureId: "", tourId: null, tourTitle: "", departureDate: "" }
  );
  const [f, setF] = useState(
    initial
      ? {
          hotelName: initial.hotelName,
          location: initial.location,
          checkIn: initial.checkIn,
          checkOut: initial.checkOut,
          rooms: initial.rooms,
          status: initial.status,
          imageUrl: initial.imageUrl || "",
          notes: initial.notes || "",
        }
      : {
          hotelName: "",
          location: "",
          checkIn: "",
          checkOut: "",
          rooms: 1,
          status: "pending" as HotelAssignment["status"],
          imageUrl: "",
          notes: "",
        }
  );

  return (
    <ModalShell
      title={initial ? "Edit Hotel Assignment" : "Add Hotel Assignment"}
      subtitle={initial ? `Updating booking details for ${initial.hotelName}` : "Create a new hotel or stay assignment"}
      onCancel={onCancel}
      onSubmit={async (e) => {
        e.preventDefault();
        const resolved = await resolveDeparture(dep);
        onSave({ ...f, ...resolved });
      }}
      saveLabel={initial ? "Save Changes" : "Create Hotel"}
    >
      <div className="grid grid-cols-2 gap-3">
        <DeparturePicker departures={departures} value={dep} onChange={setDep} />
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Hotel or Camp Name *</label>
          <input required placeholder="e.g. Grand Himalayan Boutique Chalet" className={inputCls} value={f.hotelName} onChange={(e) => setF({ ...f, hotelName: e.target.value })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Location / Region</label>
          <input placeholder="e.g. Kaza, Spiti Valley" className={inputCls} value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Check-in Date</label>
          <input type="date" className={inputCls} value={f.checkIn} onChange={(e) => setF({ ...f, checkIn: e.target.value })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Check-out Date</label>
          <input type="date" className={inputCls} value={f.checkOut} onChange={(e) => setF({ ...f, checkOut: e.target.value })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Rooms Allocated</label>
          <input type="number" min={1} className={inputCls} value={f.rooms} onChange={(e) => setF({ ...f, rooms: Number(e.target.value) })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Booking Status</label>
          <select className={inputCls} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as any })}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Hotel Photo URL</label>
          <div className="flex items-center gap-3">
            <input placeholder="https://images.unsplash.com/..." className={inputCls} value={f.imageUrl} onChange={(e) => setF({ ...f, imageUrl: e.target.value })} />
            {f.imageUrl && (
              <img src={f.imageUrl} alt="preview" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
            )}
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Special Notes / Inclusions</label>
          <textarea rows={2} placeholder="Buffet breakfast, river view room, alpine heating..." className={inputCls} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
        </div>
      </div>
    </ModalShell>
  );
}

function VehicleForm({
  initial,
  departures,
  onCancel,
  onSave,
}: {
  initial?: VehicleAssignment | null;
  departures: Departure[];
  onCancel: () => void;
  onSave: (d: any) => void;
}) {
  const [dep, setDep] = useState<DepartureFields>(
    initial
      ? { departureId: initial.departureId || "", tourId: initial.tourId, tourTitle: initial.tourTitle, departureDate: initial.departureDate }
      : { departureId: "", tourId: null, tourTitle: "", departureDate: "" }
  );
  const [f, setF] = useState(
    initial
      ? {
          vehicleType: initial.vehicleType,
          vehicleNumber: initial.vehicleNumber,
          driverName: initial.driverName,
          driverPhone: initial.driverPhone,
          status: initial.status,
          imageUrl: initial.imageUrl || "",
          notes: initial.notes || "",
        }
      : {
          vehicleType: "",
          vehicleNumber: "",
          driverName: "",
          driverPhone: "",
          status: "pending" as VehicleAssignment["status"],
          imageUrl: "",
          notes: "",
        }
  );

  return (
    <ModalShell
      title={initial ? "Edit Vehicle Assignment" : "Add Vehicle Assignment"}
      subtitle={initial ? `Updating fleet assignment for ${initial.vehicleType}` : "Assign transport vehicle & driver"}
      onCancel={onCancel}
      onSubmit={async (e) => {
        e.preventDefault();
        const resolved = await resolveDeparture(dep);
        onSave({ ...f, ...resolved });
      }}
      saveLabel={initial ? "Save Changes" : "Assign Vehicle"}
    >
      <div className="grid grid-cols-2 gap-3">
        <DeparturePicker departures={departures} value={dep} onChange={setDep} />
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Vehicle Type / Model *</label>
          <input required placeholder="e.g. Force Urbania 12-Seater, Innova Crysta" className={inputCls} value={f.vehicleType} onChange={(e) => setF({ ...f, vehicleType: e.target.value })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Vehicle Number Plate</label>
          <input placeholder="e.g. HP-01-A-4482" className={inputCls} value={f.vehicleNumber} onChange={(e) => setF({ ...f, vehicleNumber: e.target.value })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Driver Full Name</label>
          <input placeholder="Driver name" className={inputCls} value={f.driverName} onChange={(e) => setF({ ...f, driverName: e.target.value })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Driver Phone Number</label>
          <input placeholder="+91 98XXX XXXXX" className={inputCls} value={f.driverPhone} onChange={(e) => setF({ ...f, driverPhone: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Status</label>
          <select className={inputCls} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as any })}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Vehicle Photo URL</label>
          <div className="flex items-center gap-3">
            <input placeholder="https://images.unsplash.com/..." className={inputCls} value={f.imageUrl} onChange={(e) => setF({ ...f, imageUrl: e.target.value })} />
            {f.imageUrl && (
              <img src={f.imageUrl} alt="preview" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
            )}
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Vehicle Features & Notes</label>
          <textarea rows={2} placeholder="Snow chains, high altitude cylinder, 2x1 pushback seats..." className={inputCls} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
        </div>
      </div>
    </ModalShell>
  );
}

function VendorForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: Vendor | null;
  onCancel: () => void;
  onSave: (d: any) => void;
}) {
  const [f, setF] = useState(
    initial
      ? {
          name: initial.name,
          type: initial.type,
          contactPhone: initial.contactPhone,
          contactEmail: initial.contactEmail,
          amountDue: initial.amountDue,
          amountPaid: initial.amountPaid,
          notes: initial.notes || "",
        }
      : {
          name: "",
          type: "hotel" as Vendor["type"],
          contactPhone: "",
          contactEmail: "",
          amountDue: 0,
          amountPaid: 0,
          notes: "",
        }
  );

  return (
    <ModalShell
      title={initial ? "Edit Vendor Account" : "Add New Vendor"}
      subtitle={initial ? `Managing financial record for ${initial.name}` : "Create a new partner vendor record"}
      onCancel={onCancel}
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...f,
          paymentStatus: f.amountPaid >= f.amountDue && f.amountDue > 0 ? "paid" : f.amountPaid > 0 ? "partial" : "pending",
        });
      }}
      saveLabel={initial ? "Save Changes" : "Add Vendor"}
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Vendor / Partner Name *</label>
          <input required placeholder="Vendor name" className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Category Type</label>
          <select className={inputCls} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as any })}>
            <option value="hotel">Hotel / Campsite</option>
            <option value="transport">Transport / Fleet Operator</option>
            <option value="activity">Activity / Safari Provider</option>
            <option value="other">Other Operations Vendor</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Phone</label>
          <input placeholder="+91 98XXX XXXXX" className={inputCls} value={f.contactPhone} onChange={(e) => setF({ ...f, contactPhone: e.target.value })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Email</label>
          <input type="email" placeholder="vendor@partner.com" className={inputCls} value={f.contactEmail} onChange={(e) => setF({ ...f, contactEmail: e.target.value })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Total Amount Due (₹)</label>
          <input type="number" min={0} placeholder="0" className={inputCls} value={f.amountDue} onChange={(e) => setF({ ...f, amountDue: Number(e.target.value) })} />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Amount Paid (₹)</label>
          <input type="number" min={0} placeholder="0" className={inputCls} value={f.amountPaid} onChange={(e) => setF({ ...f, amountPaid: Number(e.target.value) })} />
        </div>
        <div className="col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Notes / Terms</label>
          <textarea rows={2} placeholder="Advance paid, balance terms, seasonal contract..." className={inputCls} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
        </div>
      </div>
    </ModalShell>
  );
}

function VoucherForm({
  initial,
  bookings,
  onCancel,
  onSave,
}: {
  initial?: Voucher | null;
  bookings: Booking[];
  onCancel: () => void;
  onSave: (d: any) => void;
}) {
  const [f, setF] = useState({
    bookingId: initial?.bookingId || "",
    voucherType: (initial?.voucherType || "hotel") as Voucher["voucherType"],
    issuedTo: initial?.issuedTo || "",
    details: initial?.details || "",
  });

  return (
    <ModalShell
      title={initial ? `Edit Voucher (${initial.id})` : "Generate New Voucher"}
      subtitle={initial ? `Updating voucher issued to ${initial.issuedTo}` : "Create an official travel voucher for guest"}
      onCancel={onCancel}
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          id: initial?.id || `VCH-${Date.now().toString().slice(-6)}`,
          bookingId: f.bookingId || null,
          voucherType: f.voucherType,
          issuedTo: f.issuedTo,
          details: f.details,
          createdAt: initial?.createdAt || new Date().toISOString(),
        });
      }}
      saveLabel={initial ? "Update Voucher" : "Generate Voucher"}
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Linked Booking</label>
          <select className={inputCls} value={f.bookingId} onChange={(e) => setF({ ...f, bookingId: e.target.value })}>
            <option value="">No linked booking</option>
            {bookings.map((b) => (
              <option key={b.id} value={b.id}>{b.id} — {b.tourTitle}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Voucher Type</label>
          <select className={inputCls} value={f.voucherType} onChange={(e) => setF({ ...f, voucherType: e.target.value as any })}>
            <option value="hotel">Hotel Stay Voucher</option>
            <option value="transport">Transport / Fleet Voucher</option>
            <option value="activity">Activity / Safari Voucher</option>
            <option value="full_trip">Full Trip Package Voucher</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Issued To (Guest Name) *</label>
          <input required placeholder="Guest full name" className={inputCls} value={f.issuedTo} onChange={(e) => setF({ ...f, issuedTo: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Voucher Details & Inclusions</label>
          <textarea
            rows={3}
            placeholder="Room types, dates, inclusions, pickup point details..."
            className={inputCls}
            value={f.details}
            onChange={(e) => setF({ ...f, details: e.target.value })}
          />
        </div>
      </div>
    </ModalShell>
  );
}

function CaptainAssignForm({
  initial,
  departures,
  captains,
  bookings,
  onCancel,
  onSave,
}: {
  initial?: TripAssignment | null;
  departures: Departure[];
  captains: { id: string; fullName: string }[];
  bookings: Booking[];
  onCancel: () => void;
  onSave: (d: any) => void;
}) {
  const [dep, setDep] = useState<DepartureFields>(
    initial
      ? { departureId: initial.departureId || "", tourId: initial.tourId, tourTitle: initial.tourTitle, departureDate: initial.departureDate }
      : { departureId: "", tourId: null, tourTitle: "", departureDate: "" }
  );
  const [f, setF] = useState({
    captainId: initial?.captainId || "",
    status: (initial?.status || "scheduled") as TripAssignment["status"],
  });

  return (
    <ModalShell
      title={initial ? "Edit Trip Captain Assignment" : "Assign Trip Captain"}
      subtitle={initial ? `Managing lead captain assignment for ${initial.tourTitle}` : "Designate a certified Trip Captain to lead a departure"}
      onCancel={onCancel}
      onSubmit={async (e) => {
        e.preventDefault();
        const resolved = await resolveDeparture(dep);
        onSave({
          captainId: f.captainId,
          tourId: resolved.tourId,
          tourTitle: resolved.tourTitle,
          departureDate: resolved.departureDate,
          departureId: resolved.departureId,
          bookingIds: initial?.bookingIds || [],
          status: f.status,
        });
      }}
      saveLabel={initial ? "Save Assignment" : "Assign Captain"}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Certified Trip Captain *</label>
          <select required className={inputCls} value={f.captainId} onChange={(e) => setF({ ...f, captainId: e.target.value })}>
            <option value="">-- Choose Trip Captain --</option>
            {captains.map((c) => (
              <option key={c.id} value={c.id}>{c.fullName}</option>
            ))}
          </select>
        </div>
        <DeparturePicker departures={departures} value={dep} onChange={setDep} />
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Trip Status</label>
          <select className={inputCls} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as any })}>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing (In Progress)</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </ModalShell>
  );
}
