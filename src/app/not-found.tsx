import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-sm px-6">
        <div className="text-6xl mb-4 font-bold text-surface-200">404</div>
        <h2 className="text-title font-display text-surface-900 mb-2">
          Page not found
        </h2>
        <p className="text-body-sm text-surface-400 mb-6">
          This page doesn&apos;t exist. Maybe you were looking for something else?
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 bg-surface-900 text-white rounded-apple font-medium hover:bg-surface-800 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/app"
            className="px-6 py-2.5 border border-surface-300 text-surface-700 rounded-apple font-medium hover:bg-surface-50 transition-colors"
          >
            Open App
          </Link>
        </div>
      </div>
    </div>
  );
}
