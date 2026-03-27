"use client";

import Link from "next/link";
import { MobiusLogoMark } from "@/components/brand/MobiusLogo";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error: resetError } = await resetPassword(email);
      if (resetError) {
        setError(resetError.message);
      } else {
        setSent(true);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm text-center">
          <div className="mb-8">
            <MobiusLogoMark size={48} className="mx-auto mb-6" />
            <h1 className="text-headline text-surface-900 font-display mb-2">Check your email</h1>
            <p className="text-body text-surface-400">
              We sent a password reset link to <strong className="text-surface-700">{email}</strong>.
              Click it to reset your password.
            </p>
          </div>
          <Link href="/login" className="text-accent-600 hover:text-accent-700 font-medium text-body-sm">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <MobiusLogoMark size={32} />
            <span className="text-xl font-semibold text-surface-800 tracking-tight">Otium</span>
          </Link>
          <h1 className="text-headline text-surface-900 font-display">Reset your password</h1>
          <p className="text-body text-surface-400 mt-2">Enter your email and we&apos;ll send you a reset link.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-apple bg-red-50 border border-red-200">
            <p className="text-body-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-body-sm font-medium text-surface-700 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-surface-900 text-white py-3.5 rounded-apple font-medium hover:bg-surface-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-body-sm text-surface-400 mt-8">
          Remember your password?{" "}
          <Link href="/login" className="text-accent-600 hover:text-accent-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
