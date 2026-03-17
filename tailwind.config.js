/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Apple-inspired neutral palette */
        surface: {
          50: "#fafafa",
          100: "#f5f5f7",   /* Apple's signature light gray */
          200: "#e8e8ed",
          300: "#d2d2d7",
          400: "#86868b",   /* Apple's secondary text */
          500: "#6e6e73",
          600: "#424245",
          700: "#2c2c2e",
          800: "#1d1d1f",   /* Apple's primary text */
          900: "#0a0a0a",
          950: "#000000",
        },
        /* Tech blue accent */
        accent: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        /* Chrome/metallic tones */
        chrome: {
          light: "#f0f0f0",
          DEFAULT: "#c0c0c0",
          dark: "#8e8e93",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Inter",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      fontSize: {
        /* Apple-scale typography */
        "display-xl": ["96px", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-lg": ["80px", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display": ["64px", { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-sm": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline": ["32px", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" }],
        "title": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["21px", { lineHeight: "1.5", letterSpacing: "-0.003em", fontWeight: "400" }],
        "body": ["17px", { lineHeight: "1.5", letterSpacing: "-0.003em", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
        "caption": ["12px", { lineHeight: "1.4", letterSpacing: "0", fontWeight: "400" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      maxWidth: {
        "apple": "980px",
        "apple-wide": "1200px",
      },
      borderRadius: {
        "apple": "12px",
        "apple-lg": "20px",
        "apple-xl": "28px",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "fade-in-up-slow": "fadeInUp 1s ease-out forwards",
        "scale-in": "scaleIn 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
