"use client";

import React, { useEffect, useState } from "react";
import { Hotel, Car, Wallet, FileText, UserCheck, Plus, CheckCircle2, Clock, XCircle, Pencil, Trash2 } from "lucide-react";
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
  deleteVoucher,
} from "@/lib/operationsService";
import { createTripAssignment, deleteTripAssignment, fetchMyTrips, TripAssignment } from "@/lib/captainService";
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
  const [loading, setLoading] = useState(true);

  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showVoucherForm, setShowVoucherForm] = useState(false);
  const [showCaptainForm, setShowCaptainForm] = useState(false);

  const [editingHotel, setEditingHotel] = useState<HotelAssignment | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<VehicleAssignment | null>(null);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const refresh = async () => {
    setLoading(true);
    const [h, v, vd, vc, t, { data: caps }] = await Promise.all([
      fetchHotelAssignments(),
      fetchVehicleAssignments(),
      fetchVendors(),
      fetchVouchers(),
      fetchMyTrips(),
      supabase.from("profiles").select("id, full_name, email").eq("role", "trip_captain"),
    ]);
    setHotels(h);
    setVehicles(v);
    setVendors(vd);
    setVouchers(vc);
    setTrips(t);
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
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
        {subTabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                subTab === t.id ? "bg-[#0A192F] text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label} ({t.count})</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading logistics data…</div>
      ) : (
        <>
          {subTab === "hotels" && (
            <Section
              title="Hotel Assignments"
              onAdd={() => { setEditingHotel(null); setShowHotelForm(true); }}
            >
              {hotels.length === 0 && <EmptyState label="No hotel assignments yet." />}
              {hotels.map((h) => (
                <div key={h.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap hover:shadow-sm transition-shadow">
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
                      <div className="font-bold text-sm text-slate-800">{h.hotelName} <span className="text-slate-400 font-normal">— {h.location}</span></div>
                      <div className="text-xs text-slate-500 mt-0.5">{h.tourTitle} · Departs {h.departureDate} · {h.rooms} room(s)</div>
                      {h.checkIn && <div className="text-xs text-slate-400 mt-0.5">{h.checkIn} → {h.checkOut}</div>}
                      {h.notes && <div className="text-xs text-slate-500 mt-1 line-clamp-1 italic">{h.notes}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={h.status} />
                    {h.status !== "confirmed" && (
                      <button onClick={async () => { await updateHotelAssignmentStatus(h.id, "confirmed"); showToast("Hotel confirmed"); refresh(); }} className="text-xs font-bold text-emerald-600 hover:underline">Confirm</button>
                    )}
                    <RowActions
                      onEdit={() => { setEditingHotel(h); setShowHotelForm(true); }}
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
              {showHotelForm && (
                <HotelForm
                  initial={editingHotel}
                  onCancel={() => { setShowHotelForm(false); setEditingHotel(null); }}
                  onSave={async (data) => {
                    if (editingHotel) {
                      await updateHotelAssignment(editingHotel.id, data);
                      showToast("Hotel assignment updated");
                    } else {
                      await createHotelAssignment(data);
                      showToast("Hotel assignment created");
                    }
                    setShowHotelForm(false);
                    setEditingHotel(null);
                    refresh();
                  }}
                />
              )}
            </Section>
          )}

          {subTab === "vehicles" && (
            <Section title="Vehicle Assignments" onAdd={() => { setEditingVehicle(null); setShowVehicleForm(true); }}>
              {vehicles.length === 0 && <EmptyState label="No vehicle assignments yet." />}
              {vehicles.map((v) => (
                <div key={v.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap hover:shadow-sm transition-shadow">
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
                      <div className="font-bold text-sm text-slate-800 flex items-center gap-2 flex-wrap">
                        <span>{v.vehicleType}</span>
                        {v.vehicleNumber && (
                          <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-bold">
                            {v.vehicleNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{v.tourTitle} · Departs {v.departureDate}</div>
                      {v.driverName && <div className="text-xs text-slate-400 mt-0.5">Driver: {v.driverName} {v.driverPhone && `· ${v.driverPhone}`}</div>}
                      {v.notes && <div className="text-xs text-slate-500 mt-1 line-clamp-1 italic">{v.notes}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={v.status} />
                    {v.status !== "confirmed" && (
                      <button onClick={async () => { await updateVehicleAssignmentStatus(v.id, "confirmed"); showToast("Vehicle confirmed"); refresh(); }} className="text-xs font-bold text-emerald-600 hover:underline">Confirm</button>
                    )}
                    <RowActions
                      onEdit={() => { setEditingVehicle(v); setShowVehicleForm(true); }}
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
              {showVehicleForm && (
                <VehicleForm
                  initial={editingVehicle}
                  onCancel={() => { setShowVehicleForm(false); setEditingVehicle(null); }}
                  onSave={async (data) => {
                    if (editingVehicle) {
                      await updateVehicleAssignment(editingVehicle.id, data);
                      showToast("Vehicle assignment updated");
                    } else {
                      await createVehicleAssignment(data);
                      showToast("Vehicle assignment created");
                    }
                    setShowVehicleForm(false);
                    setEditingVehicle(null);
                    refresh();
                  }}
                />
              )}
            </Section>
          )}

          {subTab === "vendors" && (
            <Section title="Vendor Finance" onAdd={() => { setEditingVendor(null); setShowVendorForm(true); }}>
              {vendors.length === 0 && <EmptyState label="No vendors added yet." />}
              {vendors.map((v) => (
                <div key={v.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-bold text-sm text-slate-800 capitalize">{v.name} <span className="text-slate-400 font-normal text-xs">({v.type})</span></div>
                    <div className="text-xs text-slate-500 mt-0.5">Due ₹{v.amountDue.toLocaleString()} · Paid ₹{v.amountPaid.toLocaleString()}</div>
                    {v.notes && <div className="text-xs text-slate-400 mt-0.5 italic">{v.notes}</div>}
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
                        className="text-xs font-bold text-emerald-600 hover:underline"
                      >
                        Mark Paid
                      </button>
                    )}
                    <RowActions
                      onEdit={() => { setEditingVendor(v); setShowVendorForm(true); }}
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
              {showVendorForm && (
                <VendorForm
                  initial={editingVendor}
                  onCancel={() => { setShowVendorForm(false); setEditingVendor(null); }}
                  onSave={async (data) => {
                    if (editingVendor) {
                      await updateVendor(editingVendor.id, data);
                      showToast("Vendor updated");
                    } else {
                      await createVendor(data);
                      showToast("Vendor added");
                    }
                    setShowVendorForm(false);
                    setEditingVendor(null);
                    refresh();
                  }}
                />
              )}
            </Section>
          )}

          {subTab === "vouchers" && (
            <Section title="Generate Vouchers" onAdd={() => setShowVoucherForm(true)}>
              {vouchers.length === 0 && <EmptyState label="No vouchers generated yet." />}
              {vouchers.map((v) => (
                <div key={v.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-bold text-sm text-slate-800">{v.id} <span className="text-slate-400 font-normal text-xs capitalize">({v.voucherType})</span></div>
                    <div className="text-xs text-slate-500 mt-0.5">Issued to {v.issuedTo} {v.bookingId && `· Booking ${v.bookingId}`}</div>
                    {v.details && <div className="text-xs text-slate-400">{v.details}</div>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400">{new Date(v.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete voucher ${v.id}?`)) return;
                        await deleteVoucher(v.id);
                        showToast("Voucher deleted");
                        refresh();
                      }}
                      className="text-slate-400 hover:text-rose-600"
                      title="Delete voucher"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {showVoucherForm && (
                <VoucherForm
                  bookings={bookings}
                  onCancel={() => setShowVoucherForm(false)}
                  onSave={async (data) => {
                    const {
                      data: { user },
                    } = await supabase.auth.getUser();
                    await createVoucher(data, user?.id || "");
                    setShowVoucherForm(false);
                    showToast(`Voucher ${data.id} generated`);
                    refresh();
                  }}
                />
              )}
            </Section>
          )}

          {subTab === "captains" && (
            <Section title="Assign Trip Captains" onAdd={() => setShowCaptainForm(true)}>
              {trips.length === 0 && <EmptyState label="No captains assigned to any departure yet." />}
              {trips.map((t) => (
                <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-bold text-sm text-slate-800">{t.tourTitle}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Departs {t.departureDate} · Captain: {captains.find((c) => c.id === t.captainId)?.fullName || "Unassigned"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={t.status} />
                    <button
                      onClick={async () => {
                        if (!confirm(`Remove Trip Captain assignment for "${t.tourTitle}"?`)) return;
                        await deleteTripAssignment(t.id);
                        showToast("Trip Captain assignment removed");
                        refresh();
                      }}
                      className="text-slate-400 hover:text-rose-600"
                      title="Remove assignment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {showCaptainForm && (
                <CaptainAssignForm
                  captains={captains}
                  bookings={bookings}
                  onCancel={() => setShowCaptainForm(false)}
                  onSave={async (data) => {
                    await createTripAssignment(data);
                    setShowCaptainForm(false);
                    showToast("Trip Captain assigned");
                    refresh();
                  }}
                />
              )}
            </Section>
          )}
        </>
      )}
    </div>
  );
}

function Section({ title, onAdd, children }: { title: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">{title}</h3>
        <button onClick={onAdd} className="flex items-center gap-1.5 bg-[#FFA429] hover:bg-[#e08b18] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="text-center py-10 text-sm text-slate-400 border border-dashed border-slate-200 rounded-2xl">{label}</div>;
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2 ml-1">
      <button onClick={onEdit} className="text-slate-400 hover:text-[#FFA429]" title="Edit">
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button onClick={onDelete} className="text-slate-400 hover:text-rose-600" title="Delete">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function FormShell({ onCancel, onSubmit, children }: { onCancel: () => void; onSubmit: (e: React.FormEvent) => void; children: React.ReactNode }) {
  return (
    <form onSubmit={onSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mt-2">
      {children}
      <div className="flex items-center gap-2 pt-1">
        <button type="submit" className="bg-[#0A192F] text-white text-xs font-bold px-4 py-2 rounded-xl">Save</button>
        <button type="button" onClick={onCancel} className="text-xs font-bold text-slate-500 px-4 py-2">Cancel</button>
      </div>
    </form>
  );
}

const inputCls = "w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFA429]/40";

function HotelForm({ initial, onCancel, onSave }: { initial?: HotelAssignment | null; onCancel: () => void; onSave: (d: any) => void }) {
  const [f, setF] = useState(
    initial
      ? { tourTitle: initial.tourTitle, departureDate: initial.departureDate, hotelName: initial.hotelName, location: initial.location, checkIn: initial.checkIn, checkOut: initial.checkOut, rooms: initial.rooms, imageUrl: initial.imageUrl || "", notes: initial.notes || "" }
      : { tourTitle: "", departureDate: "", hotelName: "", location: "", checkIn: "", checkOut: "", rooms: 1, imageUrl: "", notes: "" }
  );
  return (
    <FormShell onCancel={onCancel} onSubmit={(e) => { e.preventDefault(); onSave({ ...f, tourId: initial?.tourId ?? null, status: initial?.status ?? "pending" }); }}>
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="Tour / Departure" className={inputCls} value={f.tourTitle} onChange={(e) => setF({ ...f, tourTitle: e.target.value })} />
        <input required placeholder="Departure Date" className={inputCls} value={f.departureDate} onChange={(e) => setF({ ...f, departureDate: e.target.value })} />
        <input required placeholder="Hotel Name" className={inputCls} value={f.hotelName} onChange={(e) => setF({ ...f, hotelName: e.target.value })} />
        <input placeholder="Location (e.g. Kaza, Spiti Valley)" className={inputCls} value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} />
        <input type="date" placeholder="Check-in" className={inputCls} value={f.checkIn} onChange={(e) => setF({ ...f, checkIn: e.target.value })} />
        <input type="date" placeholder="Check-out" className={inputCls} value={f.checkOut} onChange={(e) => setF({ ...f, checkOut: e.target.value })} />
        <input type="number" min={1} placeholder="Rooms" className={inputCls} value={f.rooms} onChange={(e) => setF({ ...f, rooms: Number(e.target.value) })} />
        <input placeholder="Image URL (Unsplash or direct photo link)" className={inputCls} value={f.imageUrl} onChange={(e) => setF({ ...f, imageUrl: e.target.value })} />
        <input placeholder="Notes / meal plan / inclusions" className={`${inputCls} col-span-2`} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
      </div>
    </FormShell>
  );
}

function VehicleForm({ initial, onCancel, onSave }: { initial?: VehicleAssignment | null; onCancel: () => void; onSave: (d: any) => void }) {
  const [f, setF] = useState(
    initial
      ? { tourTitle: initial.tourTitle, departureDate: initial.departureDate, vehicleType: initial.vehicleType, vehicleNumber: initial.vehicleNumber, driverName: initial.driverName, driverPhone: initial.driverPhone, imageUrl: initial.imageUrl || "", notes: initial.notes || "" }
      : { tourTitle: "", departureDate: "", vehicleType: "", vehicleNumber: "", driverName: "", driverPhone: "", imageUrl: "", notes: "" }
  );
  return (
    <FormShell onCancel={onCancel} onSubmit={(e) => { e.preventDefault(); onSave({ ...f, tourId: initial?.tourId ?? null, status: initial?.status ?? "pending" }); }}>
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="Tour / Departure" className={inputCls} value={f.tourTitle} onChange={(e) => setF({ ...f, tourTitle: e.target.value })} />
        <input required placeholder="Departure Date" className={inputCls} value={f.departureDate} onChange={(e) => setF({ ...f, departureDate: e.target.value })} />
        <input required placeholder="Vehicle Type (e.g. Force Urbania 12-Seater)" className={inputCls} value={f.vehicleType} onChange={(e) => setF({ ...f, vehicleType: e.target.value })} />
        <input placeholder="Vehicle Number (e.g. HP-01-A-4482)" className={inputCls} value={f.vehicleNumber} onChange={(e) => setF({ ...f, vehicleNumber: e.target.value })} />
        <input placeholder="Driver Name" className={inputCls} value={f.driverName} onChange={(e) => setF({ ...f, driverName: e.target.value })} />
        <input placeholder="Driver Phone" className={inputCls} value={f.driverPhone} onChange={(e) => setF({ ...f, driverPhone: e.target.value })} />
        <input placeholder="Image URL (Unsplash or direct vehicle photo)" className={`${inputCls} col-span-2`} value={f.imageUrl} onChange={(e) => setF({ ...f, imageUrl: e.target.value })} />
        <input placeholder="Vehicle notes / features (e.g. snow chains, pushback recliners)" className={`${inputCls} col-span-2`} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
      </div>
    </FormShell>
  );
}

function VendorForm({ initial, onCancel, onSave }: { initial?: Vendor | null; onCancel: () => void; onSave: (d: any) => void }) {
  const [f, setF] = useState(
    initial
      ? { name: initial.name, type: initial.type, contactPhone: initial.contactPhone, contactEmail: initial.contactEmail, amountDue: initial.amountDue, amountPaid: initial.amountPaid, notes: initial.notes || "" }
      : { name: "", type: "hotel", contactPhone: "", contactEmail: "", amountDue: 0, amountPaid: 0, notes: "" }
  );
  return (
    <FormShell onCancel={onCancel} onSubmit={(e) => { e.preventDefault(); onSave({ ...f, paymentStatus: f.amountPaid >= f.amountDue && f.amountDue > 0 ? "paid" : f.amountPaid > 0 ? "partial" : "pending" }); }}>
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="Vendor Name" className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <select className={inputCls} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
          <option value="hotel">Hotel</option>
          <option value="transport">Transport</option>
          <option value="activity">Activity</option>
          <option value="other">Other</option>
        </select>
        <input placeholder="Contact Phone" className={inputCls} value={f.contactPhone} onChange={(e) => setF({ ...f, contactPhone: e.target.value })} />
        <input placeholder="Contact Email" className={inputCls} value={f.contactEmail} onChange={(e) => setF({ ...f, contactEmail: e.target.value })} />
        <input type="number" placeholder="Amount Due" className={inputCls} value={f.amountDue} onChange={(e) => setF({ ...f, amountDue: Number(e.target.value) })} />
        <input type="number" placeholder="Amount Paid" className={inputCls} value={f.amountPaid} onChange={(e) => setF({ ...f, amountPaid: Number(e.target.value) })} />
        <input placeholder="Notes" className={`${inputCls} col-span-2`} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
      </div>
    </FormShell>
  );
}

function VoucherForm({ bookings, onCancel, onSave }: { bookings: Booking[]; onCancel: () => void; onSave: (d: Voucher) => void }) {
  const [f, setF] = useState({ bookingId: "", voucherType: "hotel" as Voucher["voucherType"], issuedTo: "", details: "" });
  return (
    <FormShell
      onCancel={onCancel}
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          id: `VCH-${Date.now().toString().slice(-6)}`,
          bookingId: f.bookingId || null,
          voucherType: f.voucherType,
          issuedTo: f.issuedTo,
          details: f.details,
          createdAt: new Date().toISOString(),
        });
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <select className={inputCls} value={f.bookingId} onChange={(e) => setF({ ...f, bookingId: e.target.value })}>
          <option value="">No linked booking</option>
          {bookings.map((b) => (
            <option key={b.id} value={b.id}>{b.id} — {b.tourTitle}</option>
          ))}
        </select>
        <select className={inputCls} value={f.voucherType} onChange={(e) => setF({ ...f, voucherType: e.target.value as any })}>
          <option value="hotel">Hotel</option>
          <option value="transport">Transport</option>
          <option value="activity">Activity</option>
          <option value="full_trip">Full Trip</option>
        </select>
        <input required placeholder="Issued To (guest name)" className={inputCls} value={f.issuedTo} onChange={(e) => setF({ ...f, issuedTo: e.target.value })} />
        <input placeholder="Details" className={inputCls} value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} />
      </div>
    </FormShell>
  );
}

function CaptainAssignForm({
  captains,
  bookings,
  onCancel,
  onSave,
}: {
  captains: { id: string; fullName: string }[];
  bookings: Booking[];
  onCancel: () => void;
  onSave: (d: any) => void;
}) {
  const [f, setF] = useState({ captainId: "", tourTitle: "", departureDate: "" });
  return (
    <FormShell
      onCancel={onCancel}
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ captainId: f.captainId, tourId: null, tourTitle: f.tourTitle, departureDate: f.departureDate, bookingIds: [], status: "scheduled" });
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <select required className={inputCls} value={f.captainId} onChange={(e) => setF({ ...f, captainId: e.target.value })}>
          <option value="">Select Trip Captain</option>
          {captains.map((c) => (
            <option key={c.id} value={c.id}>{c.fullName}</option>
          ))}
        </select>
        <input required placeholder="Tour / Departure Title" className={inputCls} value={f.tourTitle} onChange={(e) => setF({ ...f, tourTitle: e.target.value })} />
        <input required placeholder="Departure Date" className={inputCls} value={f.departureDate} onChange={(e) => setF({ ...f, departureDate: e.target.value })} />
      </div>
    </FormShell>
  );
}
