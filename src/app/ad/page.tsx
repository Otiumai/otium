"use client";

import { useState, useEffect } from "react";

interface Scene {
  id: number;
  duration: number;
  bg: string;
  content: React.ReactNode;
}

function MobiusLogo({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path
        d="M60 20C35 20 20 40 20 60C20 80 35 100 60 100C85 100 100 80 100 60"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M100 60C100 40 85 20 60 20"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}

export default function AdPage() {
  const [currentScene, setCurrentScene] = useState(-1);
  const [fadeState, setFadeState] = useState<"in" | "out" | "hold">("out");

  const scenes: Scene[] = [
    // Scene 0: Black silence, then logo fade in
    {
      id: 0,
      duration: 3000,
      bg: "bg-black",
      content: (
        <div className="flex flex-col items-center gap-6">
          <MobiusLogo size={100} />
          <p className="text-white/40 text-sm tracking-[0.4em] uppercase font-light">
            Otium
          </p>
        </div>
      ),
    },
    // Scene 1: The question
    {
      id: 1,
      duration: 3500,
      bg: "bg-black",
      content: (
        <div className="max-w-3xl text-center px-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
            What if learning
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              felt like play?
            </span>
          </h1>
        </div>
      ),
    },
    // Scene 2: The problem
    {
      id: 2,
      duration: 3500,
      bg: "bg-black",
      content: (
        <div className="max-w-2xl text-center px-8">
          <p className="text-2xl md:text-4xl text-white/60 font-light leading-relaxed">
            You&apos;ve always wanted to learn something new.
          </p>
        </div>
      ),
    },
    // Scene 3: But...
    {
      id: 3,
      duration: 3000,
      bg: "bg-black",
      content: (
        <div className="max-w-2xl text-center px-8">
          <p className="text-2xl md:text-4xl text-white/60 font-light leading-relaxed">
            But you never knew{" "}
            <span className="text-white font-medium">where to start.</span>
          </p>
        </div>
      ),
    },
    // Scene 4: Introducing
    {
      id: 4,
      duration: 2500,
      bg: "bg-black",
      content: (
        <div className="text-center">
          <p className="text-lg text-white/30 tracking-[0.3em] uppercase font-light mb-6">
            Introducing
          </p>
          <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tight">
            Otium
          </h2>
        </div>
      ),
    },
    // Scene 5: Tagline
    {
      id: 5,
      duration: 3500,
      bg: "bg-black",
      content: (
        <div className="max-w-3xl text-center px-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.15]">
            Discover what you love.
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Go deeper.
            </span>
          </h2>
        </div>
      ),
    },
    // Scene 6: Feature 1 — AI Chat
    {
      id: 6,
      duration: 4000,
      bg: "bg-black",
      content: (
        <div className="max-w-2xl text-center px-8">
          <div className="text-5xl mb-8">💬</div>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
            One conversation.
          </h3>
          <p className="text-xl md:text-2xl text-white/50 font-light">
            Tell Otium what excites you. It builds your entire learning journey — personalized creators, resources, and daily tasks.
          </p>
        </div>
      ),
    },
    // Scene 7: Feature 2 — 30-Day Journeys
    {
      id: 7,
      duration: 4000,
      bg: "bg-black",
      content: (
        <div className="max-w-2xl text-center px-8">
          <div className="text-5xl mb-8">🗺️</div>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
            30-day journeys.
          </h3>
          <p className="text-xl md:text-2xl text-white/50 font-light">
            Not a playlist. Not a course catalog. A day-by-day path designed just for you — from first step to finding your style.
          </p>
        </div>
      ),
    },
    // Scene 8: Feature 3 — Videos
    {
      id: 8,
      duration: 4000,
      bg: "bg-black",
      content: (
        <div className="max-w-2xl text-center px-8">
          <div className="text-5xl mb-8">🎥</div>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Curated videos.
          </h3>
          <p className="text-xl md:text-2xl text-white/50 font-light">
            Every day comes with hand-picked video tutorials from the best creators. Watch, learn, practice.
          </p>
        </div>
      ),
    },
    // Scene 9: Feature 4 — Voice
    {
      id: 9,
      duration: 4000,
      bg: "bg-black",
      content: (
        <div className="max-w-2xl text-center px-8">
          <div className="text-5xl mb-8">🎙️</div>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Talk to it.
          </h3>
          <p className="text-xl md:text-2xl text-white/50 font-light">
            Voice in. Voice out. Ask questions, get guidance, hear your daily plan — hands free.
          </p>
        </div>
      ),
    },
    // Scene 10: Feature 5 — Track Progress
    {
      id: 10,
      duration: 4000,
      bg: "bg-black",
      content: (
        <div className="max-w-2xl text-center px-8">
          <div className="text-5xl mb-8">✅</div>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Track everything.
          </h3>
          <p className="text-xl md:text-2xl text-white/50 font-light">
            Check off tasks. Watch your progress grow. Celebrate milestones. Stay motivated.
          </p>
        </div>
      ),
    },
    // Scene 11: The grid of hobbies
    {
      id: 11,
      duration: 4500,
      bg: "bg-black",
      content: (
        <div className="max-w-4xl text-center px-8">
          <p className="text-lg text-white/30 tracking-wide uppercase font-light mb-10">
            Photography · Guitar · Cooking · Pottery · Chess · Gardening · Skateboarding · Yoga · Painting · Coding · Surfing · Woodworking
          </p>
          <h3 className="text-3xl md:text-5xl font-bold text-white">
            Whatever you&apos;re curious about.
            <br />
            <span className="text-white/40">We&apos;ll meet you there.</span>
          </h3>
        </div>
      ),
    },
    // Scene 12: Powered by AI
    {
      id: 12,
      duration: 3500,
      bg: "bg-black",
      content: (
        <div className="max-w-2xl text-center px-8">
          <p className="text-lg text-white/30 tracking-[0.2em] uppercase font-light mb-6">
            Powered by
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-2xl md:text-3xl font-semibold text-white/80">Claude AI</span>
            <span className="text-white/20">×</span>
            <span className="text-2xl md:text-3xl font-semibold text-white/80">GPT-4o</span>
          </div>
          <p className="text-xl text-white/40 font-light">
            Two AIs working together. One to guide you. One to organize everything.
          </p>
        </div>
      ),
    },
    // Scene 13: Coming Soon
    {
      id: 13,
      duration: 4000,
      bg: "bg-black",
      content: (
        <div className="flex flex-col items-center gap-8">
          <MobiusLogo size={80} />
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            Coming Soon
          </h2>
          <p className="text-xl md:text-2xl bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent font-medium">
            Discover what you love. Go deeper.
          </p>
          <p className="text-lg text-white/30 mt-4">
            otium.ai
          </p>
        </div>
      ),
    },
    // Scene 14: Final black
    {
      id: 14,
      duration: 2000,
      bg: "bg-black",
      content: null,
    },
  ];

  // Auto-advance scenes
  useEffect(() => {
    // Start after a brief pause
    const startTimer = setTimeout(() => {
      setCurrentScene(0);
      setFadeState("in");
    }, 800);

    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (currentScene < 0 || currentScene >= scenes.length) return;

    const scene = scenes[currentScene];

    // Hold for the scene duration, then fade out
    const holdTimer = setTimeout(() => {
      setFadeState("out");
    }, scene.duration - 800);

    // After fade out, advance to next scene
    const advanceTimer = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene((prev) => prev + 1);
        setFadeState("in");
      }
    }, scene.duration);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(advanceTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene]);

  const currentContent = currentScene >= 0 && currentScene < scenes.length
    ? scenes[currentScene].content
    : null;

  return (
    <div className="h-screen w-screen bg-black overflow-hidden cursor-none select-none">
      {/* Scene content */}
      <div
        className={`h-full w-full flex items-center justify-center transition-opacity duration-700 ease-in-out ${
          fadeState === "in" ? "opacity-100" : "opacity-0"
        }`}
      >
        {currentContent}
      </div>

      {/* Subtle progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-white/5">
        <div
          className="h-full bg-white/20 transition-all duration-300"
          style={{
            width: `${((currentScene + 1) / scenes.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
