"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: signUpError } = await signUp(email.trim(), password, fullName.trim());

    if (signUpError) {
      setError(signUpError);
      setSubmitting(false);
      return;
    }

    setDone(true);
    setSubmitting(false);
    setTimeout(() => router.push("/login"), 2500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF7F2] px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0A192F] font-serif">Create Your Account</h1>
          <p className="text-sm text-slate-500 mt-1">Join HumTripWale to book and manage your trips</p>
        </div>

        {done ? (
          <div className="flex flex-col items-center text-center gap-3 py-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            <p className="text-sm text-slate-600">
              Account created! Check your email to confirm, then sign in. Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA429]/50 focus:border-[#FFA429]"
                  />
                </div>
              </div>

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
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA429]/50 focus:border-[#FFA429]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-[#FFA429] hover:bg-[#E5921E] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                {submitting ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-[#FFA429] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
