"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Mail, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useApp } from "@/context/AppContext";

type StaffRole = "admin" | "sales" | "operations" | "trip_captain";

interface StaffEntry {
  email: string;
  role: StaffRole;
  fullName: string | null;
  invitedAt: string;
  joined: boolean;
}

const ROLE_LABELS: Record<StaffRole, string> = {
  admin: "Super Admin",
  sales: "Sales Executive",
  operations: "Operations Team",
  trip_captain: "Trip Captain",
};

export default function TeamInvites() {
  const { showToast } = useApp();
  const [staff, setStaff] = useState<StaffEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<StaffRole>("sales");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: map }, { data: profiles }] = await Promise.all([
      supabase.from("staff_role_map").select("email, role, full_name, invited_at").order("invited_at", { ascending: false }),
      supabase.from("profiles").select("email").in("role", ["admin", "sales", "operations", "trip_captain"]),
    ]);
    const joinedEmails = new Set((profiles || []).map((p: any) => p.email));
    setStaff(
      (map || []).map((m: any) => ({
        email: m.email,
        role: m.role,
        fullName: m.full_name,
        invitedAt: m.invited_at,
        joined: joinedEmails.has(m.email),
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);

    // 1. Allow-list the email with its role — the DB trigger auto-assigns
    //    this role the moment the invite is accepted and the account is created.
    const { error: mapError } = await supabase.from("staff_role_map").upsert({
      email: email.trim().toLowerCase(),
      role,
      full_name: fullName.trim() || null,
      invited_at: new Date().toISOString(),
    });

    if (mapError) {
      showToast(`Could not save invite: ${mapError.message}`);
      setSubmitting(false);
      return;
    }

    // 2. Send a passwordless magic link — clicking it creates (or signs into)
    //    their account and the trigger above assigns the role automatically.
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: fullName.trim() ? { full_name: fullName.trim() } : undefined,
      },
    });

    setSubmitting(false);

    if (otpError) {
      showToast(`Invite saved but email failed: ${otpError.message}`);
    } else {
      showToast(`Magic link invite sent to ${email}`);
      setEmail("");
      setFullName("");
    }
    load();
  };

  const handleResend = async (targetEmail: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: targetEmail,
      options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    showToast(error ? `Resend failed: ${error.message}` : `Magic link resent to ${targetEmail}`);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleInvite} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-end gap-3">
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Karan Verma"
            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFA429]/40"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFA429]/40"
          />
        </div>
        <div className="w-full sm:w-48">
          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as StaffRole)}
            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFA429]/40"
          >
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-1.5 bg-[#FFA429] hover:bg-[#e08b18] disabled:opacity-60 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
        >
          <UserPlus className="w-3.5 h-3.5" />
          {submitting ? "Sending..." : "Send Invite"}
        </button>
      </form>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 font-bold text-sm text-slate-800">Team Members</div>
        {loading ? (
          <div className="text-center py-10 text-sm text-slate-400">Loading...</div>
        ) : staff.length === 0 ? (
          <div className="text-center py-10 text-sm text-slate-400">No staff invited yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {staff.map((s) => (
              <div key={s.email} className="px-5 py-3.5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-semibold text-sm text-slate-800">{s.fullName || s.email}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3 h-3" /> {s.email} <span className="text-slate-300">·</span> {ROLE_LABELS[s.role]}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {s.joined ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Joined
                    </span>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                      <button
                        onClick={() => handleResend(s.email)}
                        className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#FFA429]"
                      >
                        <RefreshCw className="w-3 h-3" /> Resend
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
