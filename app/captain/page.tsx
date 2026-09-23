"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Compass, Users, Camera, Bell, CheckCircle2, Circle, ArrowUpRight, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import {
  TripAssignment,
  TripAttendanceEntry,
  TripPhoto,
  TripNotification,
  fetchMyTrips,
  updateTripStatus,
  fetchAttendance,
  seedAttendance,
  markAttendance,
  fetchTripPhotos,
  addTripPhoto,
  fetchTripNotifications,
  sendTripNotification,
} from "@/lib/captainService";

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function CaptainConsole() {
  const { profile, loading: authLoading, signOut } = useAuth();
  const { bookings, showToast } = useApp();
  const router = useRouter();

  // Server proxy already blocks non-captains from this route; this is a
  // defense-in-depth client check that also kicks in on client-side nav.
  useEffect(() => {
    if (!authLoading && profile && profile.role !== "trip_captain" && profile.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [authLoading, profile, router]);

  const [trips, setTrips] = useState<TripAssignment[]>([]);
  const [selected, setSelected] = useState<TripAssignment | null>(null);
  const [attendance, setAttendance] = useState<TripAttendanceEntry[]>([]);
  const [photos, setPhotos] = useState<TripPhoto[]>([]);
  const [notifications, setNotifications] = useState<TripNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [notifyMsg, setNotifyMsg] = useState("");

  const loadTrips = async () => {
    setLoading(true);
    const t = await fetchMyTrips();
    setTrips(t);
    setLoading(false);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const openTrip = async (trip: TripAssignment) => {
    setSelected(trip);
    let att = await fetchAttendance(trip.id);
    if (att.length === 0) {
      const names = trip.bookingIds
        .flatMap((id) => bookings.find((b) => b.id === id)?.travelerNames || [])
        .filter(Boolean);
      if (names.length > 0) {
        await seedAttendance(trip.id, names);
        att = await fetchAttendance(trip.id);
      }
    }
    setAttendance(att);
    setPhotos(await fetchTripPhotos(trip.id));
    setNotifications(await fetchTripNotifications(trip.id));
  };

  if (!selected) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] pt-8 pb-20 text-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-[#0A192F] text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex items-center justify-between gap-4 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Compass className="w-8 h-8" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold">Trip Captain Console</h1>
                <p className="text-xs text-slate-300">{profile?.fullName} · {profile?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/15 flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> Visit Site
              </Link>
              <button onClick={() => signOut()} className="px-3.5 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-200 text-xs font-semibold rounded-xl border border-red-400/20 flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>

          <h2 className="font-bold text-slate-800 mb-4">My Assigned Trips</h2>
          {loading ? (
            <div className="text-center py-16 text-slate-400 text-sm">Loading trips…</div>
          ) : trips.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm border border-dashed border-slate-300 rounded-2xl bg-white">
              No departures assigned to you yet. Check back once Operations assigns your next trip.
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map((t) => (
                <button
                  key={t.id}
                  onClick={() => openTrip(t)}
                  className="w-full text-left bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-[#FFA429] transition-colors"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">{t.tourTitle}</div>
                    <div className="text-xs text-slate-500 mt-1">Departs {t.departureDate} · {t.bookingIds.length} booking(s)</div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${STATUS_STYLES[t.status]}`}>{t.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const presentCount = attendance.filter((a) => a.present).length;

  return (
    <div className="min-h-screen bg-[#F1F5F9] pt-8 pb-20 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <button onClick={() => setSelected(null)} className="text-xs font-bold text-slate-500 hover:text-[#FFA429] mb-4">← Back to My Trips</button>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-xl font-bold text-slate-900">{selected.tourTitle}</h1>
            <p className="text-xs text-slate-500 mt-1">Departs {selected.departureDate}</p>
          </div>
          <div className="flex items-center gap-2">
            {(["scheduled", "ongoing", "completed"] as const).map((s) => (
              <button
                key={s}
                onClick={async () => {
                  await updateTripStatus(selected.id, s);
                  setSelected({ ...selected, status: s });
                  showToast(`Trip marked ${s}`);
                }}
                className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border transition-all ${
                  selected.status === s ? STATUS_STYLES[s] : "bg-slate-50 text-slate-400 border-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Passenger List / Attendance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /> Passenger List & Attendance</h2>
            <span className="text-xs font-semibold text-slate-500">{presentCount} / {attendance.length} checked in</span>
          </div>
          {attendance.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400 border border-dashed border-slate-200 rounded-2xl">No passenger data linked to this departure.</div>
          ) : (
            <div className="space-y-2">
              {attendance.map((a) => (
                <button
                  key={a.id}
                  onClick={async () => {
                    await markAttendance(a.id, !a.present);
                    setAttendance((prev) => prev.map((x) => (x.id === a.id ? { ...x, present: !x.present } : x)));
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                    a.present ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-sm font-medium text-slate-800">{a.travelerName}</span>
                  {a.present ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 text-slate-300" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Trip Photos */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Camera className="w-4 h-4 text-purple-500" /> Trip Photos</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!photoUrl) return;
              await addTripPhoto(selected.id, photoUrl, photoCaption);
              setPhotoUrl("");
              setPhotoCaption("");
              setPhotos(await fetchTripPhotos(selected.id));
              showToast("Photo added");
            }}
            className="flex flex-col sm:flex-row gap-2 mb-4"
          >
            <input placeholder="Image URL" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2" />
            <input placeholder="Caption (optional)" value={photoCaption} onChange={(e) => setPhotoCaption(e.target.value)} className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2" />
            <button type="submit" className="bg-[#0A192F] text-white text-xs font-bold px-4 py-2 rounded-xl">Upload</button>
          </form>
          {photos.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-400">No photos uploaded yet.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {photos.map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={p.id} src={p.url} alt={p.caption} className="w-full h-24 object-cover rounded-xl border border-slate-200" />
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Bell className="w-4 h-4 text-amber-500" /> Send Notification to Travelers</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!notifyMsg.trim()) return;
              await sendTripNotification(selected.id, notifyMsg.trim());
              setNotifyMsg("");
              setNotifications(await fetchTripNotifications(selected.id));
              showToast("Notification sent");
            }}
            className="flex gap-2 mb-4"
          >
            <input placeholder="e.g. Bus departs from lobby at 6 AM sharp" value={notifyMsg} onChange={(e) => setNotifyMsg(e.target.value)} className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2" />
            <button type="submit" className="bg-[#FFA429] text-white text-xs font-bold px-4 py-2 rounded-xl">Send</button>
          </form>
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <span className="text-slate-800">{n.message}</span>
                <span className="text-slate-400 ml-2">{new Date(n.sentAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
