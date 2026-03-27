"use client";

import Link from "next/link";
import { MobiusLogoMark } from "@/components/brand/MobiusLogo";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) {
        setError(updateError.message);
      } else {
        router.push("/app");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <MobiusLogoMark size={32} />
            <span className="text-xl font-semibold text-surface-800 tracking-tight">Otium</span>
          </Link>
          <h1 className="text-headline text-surface-900 font-display">Set new password</h1>
          <p className="text-body text-surface-400 mt-2">Choose a new password for your account.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-apple bg-red-50 border border-red-200">
            <p className="text-body-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-body-sm font-medium text-surface-700 mb-1.5">New password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="Create a new password (6+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-body-sm font-medium text-surface-700 mb-1.5">Confirm password</label>
            <input
              id="confirm-password"
              type="password"
              className="input-field"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-surface-900 text-white py-3.5 rounded-apple font-medium hover:bg-surface-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-center text-body-sm text-surface-400 mt-8">
          <Link href="/login" className="text-accent-600 hover:text-accent-700 font-medium">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-surface-400">Loading...</p></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
