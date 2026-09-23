"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const TAUNT_MESSAGES = [
  "Nice try! 😜",
  "Nope! You gotta click Continue! 💕",
  "Can't catch me! 🌸",
  "Too slow! ⚡",
  "Only Continue is allowed!✨",
  "Nope nope nope! 🙈",
  "Try again! 🎀",
  "Almost had it! 💖",
];

interface FloatingHeart {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

export default function Home() {
  const router = useRouter();
  const [isMoved, setIsMoved] = useState(false);
  const [cancelPos, setCancelPos] = useState({ top: 0, left: 0 });
  const [taunt, setTaunt] = useState("Cancel ❌");
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Generate initial hearts for background animation
    const hearts: FloatingHeart[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 14 + Math.random() * 24,
      duration: 5 + Math.random() * 6,
      delay: Math.random() * 5,
    }));
    setFloatingHearts(hearts);
  }, []);

  const moveCancelButton = () => {
    // Calculate random position within screen bounds
    const padding = 80;
    const maxW = typeof window !== "undefined" ? window.innerWidth - 160 : 300;
    const maxH = typeof window !== "undefined" ? window.innerHeight - 100 : 300;

    const newLeft = Math.max(padding, Math.floor(Math.random() * maxW));
    const newTop = Math.max(padding, Math.floor(Math.random() * maxH));

    setCancelPos({ top: newTop, left: newLeft });
    setIsMoved(true);

    // Pick a random fun message
    const randomTaunt = TAUNT_MESSAGES[Math.floor(Math.random() * TAUNT_MESSAGES.length)];
    setTaunt(randomTaunt);
  };

  const handleContinue = () => {
    router.push("/next");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 overflow-hidden font-sans select-none">
      {/* Floating Animated Hearts Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute animate-float-heart text-pink-300/60"
            style={{
              left: `${heart.left}%`,
              fontSize: `${heart.size}px`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
            }}
          >
            💖
          </div>
        ))}
      </div>

      {/* Decorative background glow circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300/30 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/30 rounded-full filter blur-3xl animate-pulse"></div>

      {/* Main Glassmorphism Card */}
      <main className="relative z-10 mx-4 p-8 sm:p-10 max-w-lg w-full bg-white/70 backdrop-blur-xl border border-pink-200/80 rounded-3xl shadow-2xl text-center flex flex-col items-center">
        {/* Lovely Friend Avatar / Badge */}
        <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 p-1 shadow-lg animate-bounce-wiggle flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl shadow-inner">
            🧸
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-pink-900 mb-3 tracking-tight">
          Hey Friend! 💕
        </h1>

        <p className="text-pink-700/80 text-base sm:text-lg mb-8 leading-relaxed font-medium">
          I crafted something very special just for you! <br />
          Ready to continue to see your surprise? ✨
        </p>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full min-h-[60px] relative">
          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-pink-300/50 hover:scale-105 active:scale-95 transition-all duration-200 animate-pulse-glow flex items-center justify-center gap-2 cursor-pointer z-10"
          >
            <span>Continue</span>
            <span className="text-xl">➔</span>
          </button>

          {/* Cancel Button (Inline when static, fixed runaway when hovered) */}
          {!isMoved && (
            <button
              ref={cancelBtnRef}
              onMouseEnter={moveCancelButton}
              onTouchStart={moveCancelButton}
              onClick={moveCancelButton}
              className="w-full sm:w-auto px-6 py-3.5 bg-gray-200/80 hover:bg-gray-300 text-gray-700 font-semibold text-base rounded-full border border-gray-300/60 shadow-sm transition-all cursor-pointer"
            >
              Cancel ❌
            </button>
          )}
        </div>
      </main>

      {/* Teleported / Runaway Cancel Button when moved */}
      {isMoved && (
        <button
          onMouseEnter={moveCancelButton}
          onTouchStart={moveCancelButton}
          onClick={moveCancelButton}
          style={{
            position: "fixed",
            top: `${cancelPos.top}px`,
            left: `${cancelPos.left}px`,
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
        Made with ❤️ for a wonderful friend
      </footer>
    </div>
  );
}
