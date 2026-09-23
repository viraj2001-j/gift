"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const TAUNT_MESSAGES = [
  "No way! 😜",
  "You definitely want it! 💕",
  "Can't refuse a gift! 🌸",
  "Too slow! ⚡",
  "Click Want instead! ✨",
  "Nope nope nope! 🙈",
  "Try clicking Want! 🎁",
  "You know you want it! 💖",
];

interface FloatingSparkle {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
}

export default function NextPage() {
  const router = useRouter();
  const [isMoved, setIsMoved] = useState(false);
  const [noPos, setNoPos] = useState({ top: 0, left: 0 });
  const [taunt, setTaunt] = useState("Don't Want ❌");
  const [sparkles, setSparkles] = useState<FloatingSparkle[]>([]);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Generate sparkle positions
    const items: FloatingSparkle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 16 + Math.random() * 20,
      delay: Math.random() * 3,
    }));
    setSparkles(items);
  }, []);

  const moveNoButton = () => {
    // Calculate random position within screen bounds
    const padding = 80;
    const maxW = typeof window !== "undefined" ? window.innerWidth - 180 : 300;
    const maxH = typeof window !== "undefined" ? window.innerHeight - 100 : 300;

    const newLeft = Math.max(padding, Math.floor(Math.random() * maxW));
    const newTop = Math.max(padding, Math.floor(Math.random() * maxH));

    setNoPos({ top: newTop, left: newLeft });
    setIsMoved(true);

    // Pick a random fun message
    const randomTaunt = TAUNT_MESSAGES[Math.floor(Math.random() * TAUNT_MESSAGES.length)];
    setTaunt(randomTaunt);
  };

  const handleWantGift = () => {
    router.push("/surprise");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 overflow-hidden font-sans select-none">
      {/* Background Sparkles / Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute animate-pulse text-pink-400/50"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              fontSize: `${sparkle.size}px`,
              animationDelay: `${sparkle.delay}s`,
            }}
          >
            {sparkle.id % 2 === 0 ? "✨" : "💖"}
          </div>
        ))}
      </div>

      {/* Decorative background glow circles */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-pink-300/30 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-300/30 rounded-full filter blur-3xl animate-pulse"></div>

      {/* Main Card with Gift Box */}
      <main className="relative z-10 mx-4 p-8 sm:p-10 max-w-lg w-full bg-white/75 backdrop-blur-xl border border-pink-200/80 rounded-3xl shadow-2xl text-center flex flex-col items-center">
        {/* Animated Gift Box Icon */}
        <div className="relative w-28 h-28 mb-6 rounded-3xl bg-gradient-to-tr from-pink-400 via-rose-400 to-purple-400 p-1.5 shadow-xl animate-bounce-wiggle flex items-center justify-center">
          <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-5xl shadow-inner">
            🎁
          </div>
          <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">
            NEW!
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-pink-950 mb-3 tracking-tight">
          A Special Gift For You! 🎁
        </h1>

        <p className="text-pink-800/80 text-base sm:text-lg mb-8 leading-relaxed font-semibold">
          Do you want to open your gift box? <br />
          Choose wisely! 😉✨
        </p>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full min-h-[60px] relative">
          {/* Want Gift Button */}
          <button
            onClick={handleWantGift}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-pink-300/50 hover:scale-105 active:scale-95 transition-all duration-200 animate-pulse-glow flex items-center justify-center gap-2 cursor-pointer z-10"
          >
            <span>I Want Gift! 🎁</span>
          </button>

          {/* Don't Want Button (Inline initially, runaway on hover/touch) */}
          {!isMoved && (
            <button
              ref={noBtnRef}
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onClick={moveNoButton}
              className="w-full sm:w-auto px-6 py-3.5 bg-gray-200/80 hover:bg-gray-300 text-gray-700 font-semibold text-base rounded-full border border-gray-300/60 shadow-sm transition-all cursor-pointer"
            >
              Don't Want ❌
            </button>
          )}
        </div>
      </main>

      {/* Teleported / Runaway Don't Want Button when moved */}
      {isMoved && (
        <button
          onMouseEnter={moveNoButton}
          onTouchStart={moveNoButton}
          onClick={moveNoButton}
          style={{
            position: "fixed",
            top: `${noPos.top}px`,
            left: `${noPos.left}px`,
            transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
            zIndex: 50,
          }}
          className="px-6 py-3 bg-pink-500 text-white font-bold text-sm rounded-full border-2 border-white shadow-2xl hover:bg-pink-600 cursor-pointer animate-bounce flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <span>{taunt}</span>
        </button>
      )}

      {/* Footer message */}
      <footer className="relative z-10 mt-8 text-xs text-pink-400 font-medium">
        You can't say no to love! 💕
      </footer>
    </div>
  );
}
