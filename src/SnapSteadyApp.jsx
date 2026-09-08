import React from 'react';
import { AetherHero } from './components/ui/aether-hero';
import { ContainerScroll } from './components/ui/container-scroll-animation';
import { PhoneExperience } from './components/ui/PhoneExperience';
import { CinematicFooter } from './components/ui/motion-footer';
import { CloudShader } from './components/ui/cloud-shader';

export default function SnapSteadyApp() {
  return (
    <div className="min-h-screen w-full bg-[#070e1c] text-white flex flex-col font-sans overflow-x-hidden selection:bg-[#FFD600]/30 selection:text-[#FFD600] relative">
      
      {/* 1. HERO SECTION: AetherHero with Prominent Visible Artwork & Glassmorphism */}
      <AetherHero
        title="Make the impossible feel inevitable."
        subtitle="SnapSteady AI — Flagship On-Device Vision Intelligence & Zero-Shake Optical Gyro Lock for the iQOO Hackathon."
        ctaLabel="Launch Live Viewfinder"
        ctaHref="#experience"
        secondaryCtaLabel="GitHub Repository"
        secondaryCtaHref="https://github.com"
        align="center"
      />

      {/* 2. DEDICATED PHONE SECTION: Visible Crisp Living Artwork Background & Glassmorphic Title */}
      <section className="relative w-full py-20 px-4 flex flex-col items-center overflow-hidden">
        {/* Living Artwork Background (Visible, Rich, Unblurred) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            style={{
              backgroundImage: `url('/bg-art.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            className="w-full h-full animate-art-bg opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070e1c]/60 via-[#050810]/40 to-[#04070e]/90" />
        </div>

        {/* Ambient Cloud Shader Over Artwork */}
        <CloudShader className="absolute inset-0 w-full h-full opacity-40 z-0 pointer-events-none" />

        <ContainerScroll
          titleComponent={
            <div className="space-y-4 backdrop-blur-2xl bg-black/50 border border-white/20 rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD600]/15 border border-[#FFD600]/40 text-xs font-mono text-[#FFD600] shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#FFD600] animate-ping" />
                <span>LIVE ON-DEVICE HARDWARE ENGINE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-xl">
                Scroll to Experience <br />
                <span className="text-[#FFD600]">SnapSteady AI</span> Viewfinder
              </h2>
              <p className="text-sm sm:text-base text-neutral-200 max-w-xl mx-auto leading-relaxed">
                Real-time WebRTC Camera &middot; Web Speech Mic &middot; Canvas Pixel LUX Meter &middot; OpenRouter AI Stream
              </p>
            </div>
          }
        >
          {/* Live Interactive 3D Smartphone Experience */}
          <PhoneExperience />
        </ContainerScroll>
      </section>

      {/* 3. CINEMATIC FOOTER */}
      <CinematicFooter />

    </div>
  );
}
