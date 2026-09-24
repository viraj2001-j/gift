"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface FloatingSparkle {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
}

export default function SurprisePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sparkles, setSparkles] = useState<FloatingSparkle[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Initialize audio element with public audio file and loop continuously
    const audio = new Audio("/surprise.mp3");
    audio.loop = true;
    audioRef.current = audio;

    // Generate background sparkles
    const items: FloatingSparkle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 16 + Math.random() * 24,
      delay: Math.random() * 3,
    }));
    setSparkles(items);

    // Stop audio and video when user leaves or closes the page
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  const handleOpenGiftBox = () => {
    if (!isOpen) {
      setIsOpen(true);
    }

    if (isPlaying) {
      // Pause both video and audio
      if (audioRef.current) audioRef.current.pause();
      if (videoRef.current) videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // Play both video and audio together
      if (audioRef.current) {
        audioRef.current.loop = true;
        audioRef.current.play().catch((err) => console.log("Audio error:", err));
      }
      if (videoRef.current) {
        videoRef.current.muted = true; // Silence original video audio
        videoRef.current.play().catch((err) => console.log("Video error:", err));
      }
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 overflow-hidden font-sans select-none">
      {/* Background Sparkles & Floating Hearts */}
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

      {/* Decorative Glow Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300/30 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/30 rounded-full filter blur-3xl animate-pulse"></div>

      {/* Header Title */}
      <div className="relative z-10 text-center max-w-xl mx-auto mb-6">
        <div className="inline-block px-4 py-1.5 bg-pink-200/90 text-pink-900 text-sm font-bold rounded-full mb-3 shadow-sm animate-bounce">
          {isOpen ? "🎉 SURPRISE UNLOCKED! 🎉" : "🎁 YOUR SURPRISE GIFT"}
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-pink-950 tracking-tight">
          {isOpen ? "Yay! Surprise Video & Song! 💖" : "Tap To Open Your Gift! 🎁"}
        </h1>
      </div>

      {/* MAIN CONTAINER (GIFT BOX -> VIDEO REVEAL) */}
      <main className="relative z-10 mx-4 p-6 sm:p-8 max-w-md w-full bg-white/75 backdrop-blur-xl border border-pink-200/80 rounded-3xl shadow-2xl text-center flex flex-col items-center justify-center transition-all duration-300">
        {!isOpen ? (
          /* CLOSED GIFT BOX BUTTON */
          <button
            onClick={handleOpenGiftBox}
            className="relative group cursor-pointer transition-all duration-300 transform active:scale-95 focus:outline-none"
          >
            {/* Animated Glow Halo */}
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>

            {/* Single Gift Box Container */}
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-400 to-purple-400 p-2 shadow-2xl flex flex-col items-center justify-center border-4 border-white/80">
              <div className="w-full h-full rounded-2xl bg-white/95 backdrop-blur-md flex flex-col items-center justify-center shadow-inner p-4 group-hover:scale-105 transition duration-300">
                <span className="text-6xl sm:text-7xl animate-bounce-wiggle mb-2">🎁</span>
                <span className="text-xs font-black text-pink-800 tracking-wider uppercase animate-pulse">
                  TAP TO OPEN! ✨
                </span>
              </div>
            </div>
          </button>
        ) : (
          /* OPENED STATE: MUTED VIDEO + PLAYING PUBLIC AUDIO */
          <div className="flex flex-col items-center w-full animate-fade-in">
            <div className="relative w-full overflow-hidden rounded-2xl border-4 border-pink-300 shadow-2xl bg-black">
              <video
                ref={videoRef}
                src="/surprise.mp4"
                muted
                loop
                playsInline
                className="w-full h-auto max-h-[360px] object-cover rounded-xl"
                onClick={handleOpenGiftBox}
              />
              {!isPlaying && (
                <div
                  onClick={handleOpenGiftBox}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                >
                  <span className="text-5xl text-white drop-shadow-md">▶️</span>
                </div>
              )}
            </div>

            <p className="mt-4 text-pink-900 font-extrabold text-lg sm:text-xl">
              Surprise! 🎉💖
            </p>
            <p className="text-pink-700 font-medium text-xs sm:text-sm mt-1 leading-relaxed">
              Video is playing muted with your special public audio track! 🎶✨
            </p>

            {/* Play/Pause Media Button */}
            <button
              onClick={handleOpenGiftBox}
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm rounded-full shadow-md hover:scale-105 transition cursor-pointer"
            >
              <span>{isPlaying ? "⏸️ Pause Video & Music" : "▶️ Play Video & Music"}</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <div className="relative z-10 mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-md border border-pink-300 text-pink-800 font-bold text-sm rounded-full shadow-md hover:bg-white hover:scale-105 transition duration-200"
        >
          <span>🔄 Start From Beginning</span>
        </Link>
      </div>

      <footer className="relative z-10 mt-6 text-xs text-pink-400 font-medium">
        Made with ❤️ for a lovely friend
      </footer>
    </div>
  );
}
