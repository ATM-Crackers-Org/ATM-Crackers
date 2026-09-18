"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaDownload, FaIndustry } from "react-icons/fa";
import { FaCartShopping, FaShieldHalved, FaTruckFast } from "react-icons/fa6";
import { LuSparkles } from "react-icons/lu";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    // Ensure muted autoplay starts smoothly across all browsers & iOS/Android
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
    if (bgVideoRef.current) {
      bgVideoRef.current.muted = true;
      bgVideoRef.current.play().catch(() => { });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        if (bgVideoRef.current && bgVideoRef.current.paused) {
          bgVideoRef.current.play().catch(() => { });
        }
      }).catch(() => { });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      if (bgVideoRef.current && !bgVideoRef.current.paused) {
        bgVideoRef.current.pause();
      }
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <section className="relative overflow-hidden bg-midnight text-white py-12 sm:py-16 lg:py-20 border-b border-zinc-800">
      {/* 1. Atmospheric Ambient Video Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <video
          ref={bgVideoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 sm:opacity-25 filter blur-[2px] scale-105"
        >
          <source src="/video/ATM_Crackers%20video.mp4" type="video/mp4" />
          <source src="/video/hero-fireworks.mp4" type="video/mp4" />
          <source src="/video/Generated%20Video%20August%2027,%202026%20-%206_02PM.mp4" type="video/mp4" />
        </video>
        {/* Dark radial and gradient overlays for perfect contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(127, 29, 29, 0.45) 0%, rgba(21, 21, 26, 0.82) 55%, #09090B 100%)",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-midnight/70 via-transparent to-midnight/90" />
      </div>

      {/* 2. Decorative festive sparkle particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <span className="absolute top-[12%] left-[6%] text-xs text-amber opacity-40 animate-float">✦</span>
        <span className="absolute top-[22%] right-[8%] text-sm text-gold opacity-50 animate-float" style={{ animationDelay: "1s" }}>✦</span>
        <span className="absolute top-[70%] left-[10%] text-xs text-gold opacity-30 animate-float" style={{ animationDelay: "1.5s" }}>✦</span>
        <span className="absolute top-[40%] right-[6%] text-sm text-amber opacity-40 animate-float" style={{ animationDelay: "0.5s" }}>✦</span>
        <span className="absolute bottom-[15%] right-[25%] text-xs text-gold-light opacity-30 animate-float" style={{ animationDelay: "2s" }}>✦</span>
      </div>

      {/* 3. Hero Content: 2-Column Desktop Grid / Fluid Mobile Stack */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left Column: Headlines, Highlights & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Direct Factory Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber/35 bg-amber/10 text-gold text-xs font-bold tracking-wider uppercase mb-5 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
              </span>
              Direct From Sivakasi Factories • 2026 Collection
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black leading-[1.1] tracking-tight mb-5">
              LIGHT UP YOUR{" "}
              <span className="text-linear-gold block sm:inline">
                CELEBRATIONS
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed font-normal">
              Premium authentic Sivakasi crackers with certified safety, factory direct wholesale prices, and secure pan-India doorstep delivery. Celebrate with the finest sparklers, aerial shots, and festive combos!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 sm:gap-4 mb-10">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-linear-crimson text-white font-bold rounded-xl shadow-lg shadow-crimson/25 hover:shadow-crimson/40 hover:opacity-95 active:scale-98 transition-all text-sm flex items-center justify-center gap-2 group"
              >
                <FaCartShopping className="text-sm" />
                <span>SHOP CRACKERS</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <a
                href="/ATM_Crackers_Price_List_2026.pdf"
                download="ATM_Crackers_Price_List_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 border-2 border-gold/80 text-gold font-bold rounded-xl hover:bg-gold/10 active:scale-98 transition-all text-sm flex items-center justify-center gap-2 backdrop-blur-xs"
              >
                <FaDownload className="text-xs" />
                <span>PRICE LIST 2026</span>
              </a>
              <button
                type="button"
                onClick={toggleMute}
                className="px-4 py-3.5 bg-surface-2/90 border border-zinc-700 hover:border-gold/50 text-zinc-300 hover:text-gold rounded-xl transition-all text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                title={isMuted ? "Turn sound on" : "Mute sound"}
              >
                {isMuted ? (
                  <>
                    <svg className="w-4 h-4 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <line x1="23" y1="9" x2="17" y2="15"></line>
                      <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                    <span>Unmute Audio</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-gold animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                    <span className="text-gold">Sound Playing</span>
                  </>
                )}
              </button>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-3 max-w-lg mx-auto lg:mx-0 pt-6 border-t border-zinc-800/80 gap-4">
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-display font-bold text-gold">191+</p>
                <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Products</p>
              </div>
              <div className="text-center lg:text-left border-x border-zinc-800 px-3">
                <p className="text-2xl sm:text-3xl font-display font-bold text-gold">80%</p>
                <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Off Wholesale</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-display font-bold text-gold">10k+</p>
                <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mt-0.5">Happy Families</p>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Video Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative group max-w-lg mx-auto">
              {/* Outer decorative ambient glow ring */}
              <div className="absolute -inset-1.5 bg-linear-to-r from-amber/40 via-crimson/50 to-gold/40 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>

              {/* Luxury Frame Container */}
              <div className="relative rounded-2xl sm:rounded-3xl bg-surface/90 border border-amber/30 p-2.5 sm:p-3.5 backdrop-blur-xl shadow-2xl shadow-black/80">
                {/* 16:9 Video Canvas */}
                <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-inner">
                  {/* Loading placeholder skeleton */}
                  {!isVideoLoaded && (
                    <div className="absolute inset-0 bg-surface-2 animate-pulse flex items-center justify-center">
                      <span className="text-amber text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber animate-ping" />
                        Loading celebration preview...
                      </span>
                    </div>
                  )}

                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onLoadedData={() => setIsVideoLoaded(true)}
                    className={`w-full h-full object-cover cursor-pointer transition-opacity duration-700 ${isVideoLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    onClick={togglePlay}
                  >
                    <source src="/video/ATM_Crackers%20video.mp4" type="video/mp4" />
                    <source src="/video/hero-fireworks.mp4" type="video/mp4" />
                    <source src="/video/Generated%20Video%20August%2027,%202026%20-%206_02PM.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Video Overlay: Top Bar with Badge & Controls */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-xs font-semibold shadow-md">
                      <span className="w-2 h-2 rounded-full bg-crimson-light animate-ping" />
                      <span>ATM Fireworks Live</span>
                    </div>

                    {/* Mute/Unmute quick toggle button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white hover:text-gold transition-all shadow-lg hover:scale-105 active:scale-95"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? (
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          <line x1="23" y1="9" x2="17" y2="15"></line>
                          <line x1="17" y1="9" x2="23" y2="15"></line>
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Play / Pause Center Overlay Button */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    className={`absolute inset-0 m-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-gold/40 text-gold flex items-center justify-center transition-all duration-300 shadow-xl z-10 ${isPlaying ? "opacity-0 group-hover:opacity-90 scale-95 group-hover:scale-100" : "opacity-100 scale-100 ring-2 ring-gold/50"
                      }`}
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                        <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    )}
                  </button>

                  {/* linear bottom bar for subtle contrast */}
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-black/80 to-transparent pointer-events-none" />

                  {/* Bottom Video Captions & Audio wave */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-zinc-300 pointer-events-none z-10">
                    <span className="font-medium text-gold-light/90 flex items-center gap-1.5">
                      <LuSparkles className="text-amber text-xs" /> Authentic Sivakasi Sparkle
                    </span>
                    {!isMuted && isPlaying && (
                      <div className="flex items-end gap-0.5 h-3 text-gold">
                        <span className="w-0.5 h-2 bg-gold animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-0.5 h-3 bg-gold animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-0.5 h-1.5 bg-gold animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        <span className="w-0.5 h-2.5 bg-gold animate-bounce" style={{ animationDelay: "450ms" }}></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-card Feature Pillars */}
                <div className="mt-3 pt-2.5 border-t border-zinc-800/90 grid grid-cols-3 gap-2 text-center">
                  <div className="py-1">
                    <FaIndustry className="text-sm text-amber mx-auto block mb-1" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-300 block mt-0.5">Sivakasi Direct</span>
                  </div>
                  <div className="py-1 border-x border-zinc-800/80">
                    <FaShieldHalved className="text-sm text-amber mx-auto block mb-1" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-300 block mt-0.5">100% Green Certified</span>
                  </div>
                  <div className="py-1">
                    <FaTruckFast className="text-sm text-amber mx-auto block mb-1" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-300 block mt-0.5">Pan-India Fast</span>
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

