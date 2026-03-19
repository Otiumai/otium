"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function AdContent() {
  const searchParams = useSearchParams();
  const dark = searchParams.get("theme") === "dark";
  const autoplay = searchParams.get("autoplay") === "1";

  // Colors based on theme
  const bgColor = dark ? "#000000" : "#ffffff";
  const fgColor = dark ? "#ffffff" : "#000000";
  const fgA = (a: number) => dark ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
  const cardBg = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const cardBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const shadowAlpha = dark ? "0.3" : "0.15";

  const [scene, setScene] = useState(-1);
  const [fade, setFade] = useState<"in"|"out">("out");
  const [started, setStarted] = useState(autoplay);
  const [showLiquidMorph, setShowLiquidMorph] = useState(false);

  // Updated durations for new scene flow:
  // 0: Logo (3s), 1: Liquid morph + text (3.5s), 2: "wanted to learn" (3.5s),
  // 3: "never knew where" (3s), 4: Introducing + Logo (3.5s), 5: Discover deeper (4s),
  // 6: Features list (7s), 7: "Whatever curious" (4.5s), 8: Powered by (3.5s),
  // 9: Coming Soon (5s), 10: null (end)
  const durations = [3000, 3500, 3500, 3000, 3500, 4000, 7000, 4500, 3500, 5000, 2000];

  useEffect(() => {
    if (!started) return;
    const t1 = setTimeout(() => { setScene(0); setFade("in"); }, 600);
    return () => clearTimeout(t1);
  }, [started]);

  useEffect(() => {
    if (scene < 0 || scene >= durations.length) return;
    const dur = durations[scene];

    // Trigger liquid morph effect at scene 0 midway through
    if (scene === 0) {
      const morphStart = dur - 1500; // Start morph 1.5s before scene ends
      const t0 = setTimeout(() => setShowLiquidMorph(true), morphStart);
      const t1 = setTimeout(() => setFade("out"), dur - 800);
      const t2 = setTimeout(() => {
        if (scene < durations.length - 1) {
          setScene(s => s + 1);
          setFade("in");
          setShowLiquidMorph(false);
        }
      }, dur);
      return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
    }

    // Normal fade-out/next for other scenes
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
      <div
        className="h-screen w-screen flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: bgColor }}
        onClick={() => setStarted(true)}
      >
        <div className="text-center">
          <Image src="/images/otium-mark.png" alt="Otium" width={120} height={87} className="mx-auto mb-8 opacity-60" />
          <p style={{ color: fgA(0.4) }} className="text-lg tracking-wide">Click anywhere to play</p>
        </div>
      </div>
    );
  }

  // Feature data for the staggered bullet list (scene 6)
  const features = [
    { emoji: "💬", title: "One conversation", subtitle: "Tell Otium what excites you" },
    { emoji: "🗺️", title: "30-day journeys", subtitle: "Day-by-day learning paths" },
    { emoji: "🎥", title: "Curated videos", subtitle: "Hand-picked tutorials from the best creators" },
    { emoji: "🎙️", title: "Talk to it", subtitle: "Voice in. Voice out. Hands free." },
    { emoji: "✅", title: "Track everything", subtitle: "Check off tasks. Hit milestones." },
  ];

  // Gradient colors for feature icons
  const featureGradients = [
    "from-blue-500 to-violet-600",
    "from-orange-500 to-rose-600",
    "from-red-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-yellow-600",
  ];

  const scenes: Record<number, React.ReactNode> = {
    0: (
      <div className="flex flex-col items-center gap-6 relative">
        {/* Static logo with scaleIn animation */}
        <div className={`${!showLiquidMorph ? "animate-[scaleIn_1.2s_ease-out]" : ""}`}>
          <Image src="/images/otium-mark.png" alt="Otium" width={200} height={145} className="drop-shadow-2xl" />
        </div>

        {/* Liquid morph overlay — animates only when showLiquidMorph is true */}
        {showLiquidMorph && (
          <>
            {/* Falling & splashing logo */}
            <div className="absolute animate-[logoMorph_1.5s_ease-in_forwards]">
              <Image
                src="/images/otium-mark.png"
                alt="Otium"
                width={200}
                height={145}
                className="drop-shadow-2xl"
                style={{
                  filter: "blur(0px)",
                }}
              />
            </div>

            {/* Ripple effect — expands outward from impact */}
            <div className="absolute w-96 h-96 rounded-full animate-[ripple_1.5s_ease-out_forwards]" style={{
              border: `2px solid ${fgA(0.2)}`,
              boxShadow: `inset 0 0 30px ${fgA(0.1)}`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }} />
          </>
        )}

        <p style={{ color: fgA(0.3) }} className="text-sm tracking-[0.5em] uppercase font-light mt-4">Otium</p>
      </div>
    ),

    1: (
      <div className="max-w-4xl text-center px-8 relative">
        {/* Initial blurred text that clears (liquid resolving effect) */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] animate-[textLiquidResolve_1.5s_ease-out_forwards]"
          style={{ color: fgColor }}
        >
          What if learning<br/>
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">felt like play?</span>
        </h1>
      </div>
    ),

    2: (
      <div className="max-w-3xl text-center px-8">
        <p className="text-2xl md:text-4xl lg:text-5xl font-extralight leading-relaxed" style={{ color: fgA(0.4) }}>
          You have always wanted to learn something new.
        </p>
      </div>
    ),

    3: (
      <div className="max-w-3xl text-center px-8">
        <p className="text-2xl md:text-4xl lg:text-5xl font-extralight leading-relaxed" style={{ color: fgA(0.4) }}>
          But you never knew <span style={{ color: fgColor }} className="font-normal">where to start.</span>
        </p>
      </div>
    ),

    4: (
      <div className="flex flex-col items-center gap-8">
        <p style={{ color: fgA(0.2) }} className="text-base tracking-[0.4em] uppercase font-light">Introducing</p>
        <Image src="/images/otium-mark.png" alt="Otium" width={160} height={116} className="drop-shadow-2xl" />
        <h2 className="text-7xl md:text-9xl font-bold tracking-tight" style={{ color: fgColor }}>Otium</h2>
      </div>
    ),

    5: (
      <div className="max-w-4xl text-center px-8">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]" style={{ color: fgColor }}>
          Discover what you love.<br/>
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Go deeper.</span>
        </h2>
      </div>
    ),

    6: (
      <div className="max-w-4xl px-8">
        <div className="space-y-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-6 animate-[featureFadeSlide_0.6s_ease-out_forwards] opacity-0"
              style={{
                animationDelay: `${idx * 0.4}s`,
              }}
            >
              {/* Icon box */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${featureGradients[idx]} flex items-center justify-center flex-shrink-0 shadow-lg`} style={{ boxShadow: `0 10px 30px -8px ${featureGradients[idx].split(" ")[1]}30` }}>
                <span className="text-2xl">{feature.emoji}</span>
              </div>

              {/* Text content */}
              <div className="flex-1 text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: fgColor }}>
                  {feature.title}
                </h3>
                <p className="text-base md:text-lg font-light leading-relaxed" style={{ color: fgA(0.5) }}>
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    7: (
      <div className="max-w-5xl text-center px-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {["📸","🎸","👨‍🍳","🏺","♟️","🌱","🛹","🧘","🎨","💻","🏄","🪵"].map((e,i) => (
            <div key={i} className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
              {e}
            </div>
          ))}
        </div>
        <h3 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: fgColor }}>
          Whatever you are curious about.
        </h3>
        <p className="text-xl md:text-2xl font-light" style={{ color: fgA(0.3) }}>We will meet you there.</p>
      </div>
    ),

    8: (
      <div className="max-w-3xl text-center px-8">
        <p style={{ color: fgA(0.2) }} className="text-sm tracking-[0.3em] uppercase font-light mb-8">Powered by</p>
        <div className="flex items-center justify-center gap-6 md:gap-10 mb-8">
          <div className="px-6 py-3 rounded-2xl" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
            <span className="text-xl md:text-2xl font-semibold" style={{ color: fgA(0.7) }}>Claude AI</span>
          </div>
          <span className="text-2xl font-thin" style={{ color: fgA(0.15) }}>+</span>
          <div className="px-6 py-3 rounded-2xl" style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
            <span className="text-xl md:text-2xl font-semibold" style={{ color: fgA(0.7) }}>GPT-4o</span>
          </div>
        </div>
        <p className="text-lg font-light" style={{ color: fgA(0.3) }}>Two AIs. One guides you. One organizes everything.</p>
      </div>
    ),

    9: (
      <div className="flex flex-col items-center gap-6">
        <Image src="/images/otium-mark.png" alt="Otium" width={140} height={102} className="drop-shadow-2xl mb-4" />
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight" style={{ color: fgColor }}>Coming Soon</h2>
        <div className="h-[2px] w-24 bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 rounded-full mt-2" />
        <p className="text-xl md:text-2xl bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent font-medium mt-2">
          Discover what you love. Go deeper.
        </p>
        <p style={{ color: fgA(0.2) }} className="text-base mt-6 tracking-wider">otium.ai</p>
      </div>
    ),

    10: null,
  };

  return (
    <div className="h-screen w-screen overflow-hidden cursor-none select-none" style={{ backgroundColor: bgColor }}>
      <style jsx global>{`
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes logoMorph {
          0% {
            transform: translateY(-80px) scale(1);
            filter: blur(0px);
            opacity: 1;
          }
          60% {
            transform: translateY(40px) scale(1.1);
            filter: blur(8px);
          }
          100% {
            transform: translateY(100px) scaleX(2) scaleY(0.3);
            filter: blur(25px);
            opacity: 0;
          }
        }

        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
        }

        @keyframes textLiquidResolve {
          0% {
            filter: blur(20px);
            opacity: 0.3;
          }
          50% {
            filter: blur(10px);
            opacity: 0.7;
          }
          100% {
            filter: blur(0px);
            opacity: 1;
          }
        }

        @keyframes featureFadeSlide {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }
      `}</style>

      <div className={`h-full w-full flex items-center justify-center transition-opacity duration-700 ease-in-out ${fade === "in" ? "opacity-100" : "opacity-0"}`}>
        {scene >= 0 && scene < 10 && scenes[scene]}
      </div>

      {/* Persistent logo watermark — top left */}
      {scene >= 0 && scene < 9 && (
        <div className="fixed top-8 left-8 flex items-center gap-3 opacity-30 transition-opacity duration-700">
          <Image src="/images/otium-mark-sm.png" alt="" width={28} height={20} />
          <span style={{ color: fgColor }} className="text-sm font-medium tracking-wider">OTIUM</span>
        </div>
      )}

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: fgA(0.05) }}>
        <div className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 transition-all duration-500 ease-out" style={{width:`${((scene+1)/10)*100}%`}} />
      </div>
    </div>
  );
}

export default function AdPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-black" />}>
      <AdContent />
    </Suspense>
  );
}
