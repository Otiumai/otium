"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdPage() {
  const [scene, setScene] = useState(-1);
  const [fade, setFade] = useState<"in"|"out">("out");
  const [started, setStarted] = useState(false);

  const durations = [3000,3500,3500,3000,3500,4000,4000,4000,4000,4000,4000,4500,3500,5000,2000];

  useEffect(() => {
    if (!started) return;
    const t1 = setTimeout(() => { setScene(0); setFade("in"); }, 600);
    return () => clearTimeout(t1);
  }, [started]);

  useEffect(() => {
    if (scene < 0 || scene >= durations.length) return;
    const dur = durations[scene];
    const t1 = setTimeout(() => setFade("out"), dur - 800);
    const t2 = setTimeout(() => {
      if (scene < durations.length - 1) {
        setScene(s => s + 1);
        setFade("in");
      }
    }, dur);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  if (!started) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center cursor-pointer" onClick={() => setStarted(true)}>
        <div className="text-center">
          <Image src="/images/otium-mark.png" alt="Otium" width={120} height={87} className="mx-auto mb-8 opacity-60" />
          <p className="text-white/40 text-lg tracking-wide">Click anywhere to play</p>
        </div>
      </div>
    );
  }

  const scenes: Record<number, React.ReactNode> = {
    0: (
      <div className="flex flex-col items-center gap-6 animate-[scaleIn_1.2s_ease-out]">
        <Image src="/images/otium-mark.png" alt="Otium" width={200} height={145} className="drop-shadow-2xl" />
        <p className="text-white/30 text-sm tracking-[0.5em] uppercase font-light mt-4">Otium</p>
      </div>
    ),
    1: (
      <div className="max-w-4xl text-center px-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.05]">
          What if learning<br/>
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">felt like play?</span>
        </h1>
      </div>
    ),
    2: (
      <div className="max-w-3xl text-center px-8">
        <p className="text-2xl md:text-4xl lg:text-5xl text-white/50 font-extralight leading-relaxed">
          You have always wanted to learn something new.
        </p>
      </div>
    ),
    3: (
      <div className="max-w-3xl text-center px-8">
        <p className="text-2xl md:text-4xl lg:text-5xl text-white/50 font-extralight leading-relaxed">
          But you never knew <span className="text-white font-normal">where to start.</span>
        </p>
      </div>
    ),
    4: (
      <div className="flex flex-col items-center gap-8">
        <p className="text-base text-white/20 tracking-[0.4em] uppercase font-light">Introducing</p>
        <Image src="/images/otium-mark.png" alt="Otium" width={160} height={116} className="drop-shadow-2xl" />
        <h2 className="text-7xl md:text-9xl font-bold text-white tracking-tight">Otium</h2>
      </div>
    ),
    5: (
      <div className="max-w-4xl text-center px-8">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
          Discover what you love.<br/>
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Go deeper.</span>
        </h2>
      </div>
    ),
    6: (
      <div className="max-w-3xl text-center px-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-500/30">
          <span className="text-4xl">💬</span>
        </div>
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-5">One conversation.</h3>
        <p className="text-lg md:text-2xl text-white/40 font-light leading-relaxed">
          Tell Otium what excites you. It builds your entire<br className="hidden md:block"/>
          learning journey — personalized, just for you.
        </p>
      </div>
    ),
    7: (
      <div className="max-w-3xl text-center px-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-orange-500/30">
          <span className="text-4xl">🗺️</span>
        </div>
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-5">30-day journeys.</h3>
        <p className="text-lg md:text-2xl text-white/40 font-light leading-relaxed">
          Day-by-day learning paths from first step<br className="hidden md:block"/>
          to finding your own style.
        </p>
      </div>
    ),
    8: (
      <div className="max-w-3xl text-center px-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-red-500/30">
          <span className="text-4xl">🎥</span>
        </div>
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-5">Curated videos.</h3>
        <p className="text-lg md:text-2xl text-white/40 font-light leading-relaxed">
          Hand-picked tutorials from the best creators<br className="hidden md:block"/>
          on every single day of your journey.
        </p>
      </div>
    ),
    9: (
      <div className="max-w-3xl text-center px-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-500/30">
          <span className="text-4xl">🎙️</span>
        </div>
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-5">Talk to it.</h3>
        <p className="text-lg md:text-2xl text-white/40 font-light leading-relaxed">
          Voice in. Voice out. Your AI companion<br className="hidden md:block"/>
          speaks and listens — hands free.
        </p>
      </div>
    ),
    10: (
      <div className="max-w-3xl text-center px-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-amber-500/30">
          <span className="text-4xl">✅</span>
        </div>
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-5">Track everything.</h3>
        <p className="text-lg md:text-2xl text-white/40 font-light leading-relaxed">
          Check off tasks. Hit milestones.<br className="hidden md:block"/>
          Watch yourself grow.
        </p>
      </div>
    ),
    11: (
      <div className="max-w-5xl text-center px-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {["📸","🎸","👨‍🍳","🏺","♟️","🌱","🛹","🧘","🎨","💻","🏄","🪵"].map((e,i) => (
            <div key={i} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl backdrop-blur-sm border border-white/10">
              {e}
            </div>
          ))}
        </div>
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Whatever you are curious about.
        </h3>
        <p className="text-xl md:text-2xl text-white/30 font-light">We will meet you there.</p>
      </div>
    ),
    12: (
      <div className="max-w-3xl text-center px-8">
        <p className="text-sm text-white/20 tracking-[0.3em] uppercase font-light mb-8">Powered by</p>
        <div className="flex items-center justify-center gap-6 md:gap-10 mb-8">
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-xl md:text-2xl font-semibold text-white/70">Claude AI</span>
          </div>
          <span className="text-white/15 text-2xl font-thin">+</span>
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-xl md:text-2xl font-semibold text-white/70">GPT-4o</span>
          </div>
        </div>
        <p className="text-lg text-white/30 font-light">Two AIs. One guides you. One organizes everything.</p>
      </div>
    ),
    13: (
      <div className="flex flex-col items-center gap-6">
        <Image src="/images/otium-mark.png" alt="Otium" width={140} height={102} className="drop-shadow-2xl mb-4" />
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">Coming Soon</h2>
        <div className="h-[2px] w-24 bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 rounded-full mt-2" />
        <p className="text-xl md:text-2xl bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent font-medium mt-2">
          Discover what you love. Go deeper.
        </p>
        <p className="text-base text-white/20 mt-6 tracking-wider">otium.ai</p>
      </div>
    ),
    14: null,
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden cursor-none select-none">
      <style jsx global>{`
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div className={`h-full w-full flex items-center justify-center transition-opacity duration-700 ease-in-out ${fade === "in" ? "opacity-100" : "opacity-0"}`}>
        {scene >= 0 && scene < 15 && scenes[scene]}
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-white/5">
        <div className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 transition-all duration-500 ease-out" style={{width:`${((scene+1)/15)*100}%`}} />
      </div>
    </div>
  );
}
