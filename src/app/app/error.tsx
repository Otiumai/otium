"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-sm px-6">
        <div className="text-4xl mb-4">😵</div>
        <h2 className="text-title font-display text-surface-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-body-sm text-surface-400 mb-6">
          Don&apos;t worry — your data is safe. Try refreshing, or head back to the homepage.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-surface-900 text-white rounded-apple font-medium hover:bg-surface-800 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 border border-surface-300 text-surface-700 rounded-apple font-medium hover:bg-surface-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
