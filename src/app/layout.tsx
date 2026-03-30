import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Otium — Discover What You Love",
  description:
    "AI-powered platform that helps you discover, explore, and master your hobbies and interests. Personalized creators, learning paths, and 30-day courses.",
  metadataBase: new URL("https://otiumapp.com"),
  openGraph: {
    title: "Otium — Discover What You Love",
    description:
      "One prompt. Personalized creators, learning paths, and courses — all powered by AI. Your interests, amplified.",
    url: "https://otiumapp.com",
    siteName: "Otium",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Otium — Discover What You Love",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Otium — Discover What You Love",
    description:
      "One prompt. Personalized creators, learning paths, and courses — all powered by AI.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
