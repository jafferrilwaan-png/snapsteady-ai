import React from 'react';
import { ArrowRight, Sparkles, Terminal, Camera, Zap } from 'lucide-react';
import { CloudShader } from './cloud-shader';

export function AetherHero({
  title = 'Give your big idea the vision it deserves.',
  subtitle = 'SnapSteady AI — Flagship On-Device Vision Intelligence & Zero-Shake Optical Gyro Lock for the iQOO Hackathon.',
  ctaLabel = 'Launch Live Viewfinder',
  ctaHref = '#experience',
  secondaryCtaLabel = 'GitHub Repository',
  secondaryCtaHref = 'https://github.com',
  className = '',
}) {
  return (
    <section
      className={`relative min-h-[92vh] w-full overflow-hidden flex flex-col justify-between ${className}`}
      aria-label="Hero"
    >
      {/* 1. VISIBLE ARTWORK BACKGROUND (Crisp, Rich & Unblurred Across Page) */}
      <div className="absolute inset-0 z-0">
        <div
          style={{
            backgroundImage: `url('/bg-art.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          className="w-full h-full animate-art-bg opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#070e1c] pointer-events-none" />
      </div>

      {/* 2. Transparent Floating Cloud Shader Layer */}
      <CloudShader className="absolute inset-0 w-full h-full z-10 opacity-50 pointer-events-none" />

      {/* 3. Ultra-Clean Minimalist Navbar matching Reference Style */}
      <header className="relative z-30 w-full px-4 sm:px-8 pt-4">
        <nav className="mx-auto max-w-7xl backdrop-blur-2xl bg-black/60 border border-white/15 rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-2xl">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD600] text-sm font-black text-black shadow-md shadow-[#FFD600]/30">
              iQ
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              SnapSteady <span className="text-[#FFD600]">AI</span>
            </span>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
            <a href="#experience" className="hover:text-white transition-colors">
              Getting started
            </a>
            <a href="#experience" className="hover:text-white transition-colors">
              Components
            </a>
            <a href="#experience" className="hover:text-white transition-colors">
              AI Vision Pipeline
            </a>
            <a href="#experience" className="hover:text-white transition-colors">
              Documentation
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors px-3 py-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href={ctaHref}
              className="rounded-full bg-white text-black px-5 py-2 text-sm font-bold shadow-lg hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95"
            >
              Launch App
            </a>
          </div>
        </nav>
      </header>

      {/* 4. Hero Centerstage */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-16 text-center max-w-5xl mx-auto">
        
        {/* Centered Pill Notification Tag */}
        <a
          href="#experience"
          className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-xs font-medium text-neutral-200 hover:border-[#FFD600]/60 transition-all mb-8 shadow-xl"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600] animate-ping" />
          <span>New AI Camera Agent is live!</span>
          <span className="text-[#FFD600] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Try demo <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </a>

        {/* Big Bold Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.04] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-6 text-base sm:text-xl text-neutral-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            {subtitle}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center items-center">
          <a
            href={ctaHref}
            className="px-8 py-4 rounded-2xl bg-[#FFD600] text-black font-extrabold text-sm hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#FFD600]/30 flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>{ctaLabel}</span>
          </a>

          <a
            href={secondaryCtaHref}
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/25 text-white font-bold text-sm hover:bg-white/20 hover:border-white/40 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            <span>{secondaryCtaLabel}</span>
          </a>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-4 relative z-10" />
    </section>
  );
}
