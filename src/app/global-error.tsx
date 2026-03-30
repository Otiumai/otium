"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="text-4xl mb-4">💥</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Something broke
          </h2>
          <p className="text-gray-500 mb-6">
            We hit an unexpected error. Try refreshing the page.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
