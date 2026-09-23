"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

// Where each role lands when they sign in without an explicit ?next= redirect.
const ROLE_HOME: Record<string, string> = {
  admin: "/admin",
  sales: "/admin",
  operations: "/admin",
  trip_captain: "/captain",
  traveler: "/dashboard",
};

function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitNext = searchParams.get("next");
  const linkError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    linkError === "invite_link_expired" ? "That invite/magic link has expired or was already used. Ask an Admin to resend it, or sign in with a password." : null
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await signIn(email.trim(), password);

    if (signInError) {
      setError(signInError);
      setSubmitting(false);
      return;
    }

    let destination = explicitNext || "/dashboard";

    if (!explicitNext) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
        destination = ROLE_HOME[profile?.role || "traveler"] || "/dashboard";
      }
    }

    router.push(destination);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] px-4 py-16">
      <Link href="/" className="mb-8 flex items-center justify-center group" title="Return to HumTripWale Home">
        <Image
          src="/logo-dark.svg"
          alt="HumTripWale Logo"
          width={220}
          height={75}
          className="h-20 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          priority
        />
      </Link>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0A192F] font-serif">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your HumTripWale account</p>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA429]/50 focus:border-[#FFA429]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA429]/50 focus:border-[#FFA429]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-[#0A192F] hover:bg-[#0F223D] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            <LogIn className="w-4 h-4" />
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#FFA429] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
