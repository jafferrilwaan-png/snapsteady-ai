import React, { useState } from 'react';
import { AetherHero } from './components/ui/aether-hero';
import { ContainerScroll } from './components/ui/container-scroll-animation';
import { PhoneExperience } from './components/ui/PhoneExperience';
import { AISlideDeck } from './components/ui/AISlideDeck';
import { CinematicFooter } from './components/ui/motion-footer';
import { CloudShader } from './components/ui/cloud-shader';
import bgArt from './assets/bg-art.png';

const INITIAL_SLIDES = [
  {
    tag: "iQOO HACKATHON 2026",
    title: "SnapSteady AI — On-Device Vision Intelligence",
    subtitle: "Eliminating motion blur and optimizing computational photography in real-time on flagship mobile hardware.",
    bullets: [
      { label: "Zero-Shake Optical Gyro", desc: "Monitors X/Y angular velocity at 120Hz to trigger the instant the frame is steady." },
      { label: "On-Device Multimodal NPU", desc: "Runs quantized vision models locally with zero cloud latency and total privacy." },
      { label: "Autonomous Voice Agent", desc: "Speak natural language commands to control zoom, filters, capture, and framing." }
    ]
  },
  {
    tag: "ARCHITECTURE & PIPELINE",
    title: "Real-Time Pixel & Gyro Fusion Engine",
    subtitle: "Combining browser hardware streams, 60fps canvas computer vision, and OpenRouter intelligence.",
    bullets: [
      { label: "WebRTC Video Stream", desc: "Pure uncompressed master sensor pipeline with front/rear lens switching." },
      { label: "Canvas Pixel LUX Meter", desc: "Offscreen 2D context calculating real ambient brightness and daylight Kelvin." },
      { label: "Pro LUT Color Pipeline", desc: "Hardware CSS & Canvas filters for Cinematic 35mm, Leica B&W, and Vivid HDR." }
    ]
  }
];

export default function SnapSteadyApp() {
  const [slides, setSlides] = useState(INITIAL_SLIDES);
  const [activeVoicePrompt, setActiveVoicePrompt] = useState('iQOO Flagship Vision Intelligence');

  const handleNewVoiceSlide = (newSlideData, promptText) => {
    if (newSlideData) {
      setSlides([newSlideData, ...slides]);
      setActiveVoicePrompt(promptText || 'Voice Pitch');
    }
  };

  return (
    <div className="min-h-screen w-full text-white flex flex-col font-sans overflow-x-hidden selection:bg-[#FFD600]/30 selection:text-[#FFD600] relative bg-[#070b14]">
      
      {/* GLOBAL FULL-PAGE CRISP VIBRANT LIVING ARTWORK BACKGROUND (100% Visible & Bright) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={bgArt}
          alt="Living Background Art"
          className="w-full h-full object-cover object-center animate-art-bg opacity-90 scale-105"
        />
        {/* Subtle luminous glass tint - NO black wash out */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      {/* Ambient Drifting Transparent Cloud Shader */}
      <CloudShader className="fixed inset-0 w-full h-full opacity-35 z-0 pointer-events-none" />

      {/* 1. HERO SECTION */}
      <AetherHero
        title="Give your big idea the vision it deserves."
        subtitle="SnapSteady AI — Flagship On-Device Vision Intelligence & Zero-Shake Optical Gyro Lock for the iQOO Hackathon."
        ctaLabel="Launch Live Viewfinder"
        ctaHref="#experience"
        secondaryCtaLabel="GitHub Repository"
        secondaryCtaHref="https://github.com/jafferrilwaan-png/snapsteady-ai"
      />

      {/* 2. DEDICATED PHONE SECTION */}
      <section className="relative w-full py-16 px-4 flex flex-col items-center z-10" id="experience">


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
          {/* Live Interactive 3D Smartphone Experience with Live Slide Dispatch */}
          <PhoneExperience onGenerateSlide={handleNewVoiceSlide} />
        </ContainerScroll>

        {/* 3. LIVE AI GENERATED SLIDE DECK (Created directly from your voice) */}
        <div className="relative z-20 w-full max-w-5xl px-4 mt-12">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD600]/10 border border-[#FFD600]/30 text-xs font-mono text-[#FFD600] mb-2">
              <span>VOICE-DRIVEN AI SLIDE DECK</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Live Presentation Slides Generated from What You Say
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
              Speak to the AI camera above to dynamically generate pitch slides matching your spoken topic.
            </p>
          </div>

          <AISlideDeck slides={slides} currentPrompt={activeVoicePrompt} />
        </div>
      </section>

      {/* 4. CINEMATIC FOOTER */}
      <CinematicFooter />

    </div>
  );
}
