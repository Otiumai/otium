"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MobiusLogoMark } from "@/components/brand/MobiusLogo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl backdrop-saturate-150 border-b border-surface-200/60"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-apple-wide mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <MobiusLogoMark size={28} />
          <span className="text-lg font-semibold text-surface-800 tracking-tight">
            Otium
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-body-sm text-surface-500 hover:text-surface-800 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-body-sm text-surface-500 hover:text-surface-800 transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="text-body-sm text-surface-500 hover:text-surface-800 transition-colors">
            Pricing
          </a>
          <Link href="/app" className="text-body-sm text-surface-500 hover:text-surface-800 transition-colors">
            Sign In
          </Link>
          <Link
            href="/app"
            className="bg-surface-900 text-white text-body-sm font-medium px-5 py-2 rounded-full hover:bg-surface-800 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`w-5 h-0.5 bg-surface-800 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-1" : ""}`} />
          <span className={`w-5 h-0.5 bg-surface-800 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-1" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-surface-200/60 px-6 py-8 animate-fade-in">
          <div className="flex flex-col gap-6">
            <a href="#features" className="text-body text-surface-600 hover:text-surface-900" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-body text-surface-600 hover:text-surface-900" onClick={() => setMobileOpen(false)}>How It Works</a>
            <a href="#pricing" className="text-body text-surface-600 hover:text-surface-900" onClick={() => setMobileOpen(false)}>Pricing</a>
            <Link href="/app" className="text-body text-surface-600 hover:text-surface-900">Sign In</Link>
            <Link href="/app" className="btn-primary text-center">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
