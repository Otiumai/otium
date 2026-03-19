import Link from "next/link";
import { MobiusLogo } from "@/components/brand/MobiusLogo";

export function Hero() {
  return (
    <section className="pt-32 pb-8 md:pt-44 md:pb-16 px-6">
      <div className="max-w-apple mx-auto text-center">
        {/* Möbius strip logo mark */}
        <div className="flex justify-center mb-10 animate-scale-in">
          <MobiusLogo size={120} />
        </div>

        {/* Headline — Apple-scale */}
        <h1 className="text-display-sm md:text-display lg:text-display-lg font-bold text-surface-900 mb-6 animate-fade-in-up font-display">
          Discover what you love.
          <br />
          <span className="bg-gradient-to-r from-accent-600 to-accent-400 bg-clip-text text-transparent">
            Go deeper.
          </span>
        </h1>

        <p
          className="text-body-lg md:text-[24px] md:leading-[1.4] text-surface-400 max-w-2xl mx-auto mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          One prompt. Personalized creators, learning paths, and courses — all
          powered by AI. Your interests, amplified.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Link href="/signup" className="btn-primary text-lg px-9 py-4">
            Get Started — It&apos;s Free
          </Link>
          <a href="#how-it-works" className="link-arrow text-lg">
            See how it works
          </a>
        </div>

        {/* Chat preview — minimal, Apple-style card */}
        <div
          className="mt-20 md:mt-28 max-w-2xl mx-auto animate-fade-in-up-slow"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="bg-surface-100 rounded-apple-xl p-1 shadow-2xl shadow-surface-900/5">
            <div className="bg-white rounded-[24px] overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-surface-200/60">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-surface-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-surface-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-surface-300" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-caption text-surface-400 font-medium">Otium AI</span>
                </div>
                <div className="w-12" />
              </div>
              {/* Messages */}
              <div className="p-6 space-y-4">
                <div className="flex justify-start">
                  <div className="bg-surface-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]">
                    <p className="text-body text-surface-700">Hey! 🌿 What are you interested in?</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-surface-900 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]">
                    <p className="text-body">I want to get into photography</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-surface-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <p className="text-body text-surface-700 font-medium mb-1">📸 Great choice! Here&apos;s your starter pack:</p>
                    <p className="text-body-sm text-surface-500">🎙️ Creators · 📚 Learning path · 🎓 Courses · 🚀 First steps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
