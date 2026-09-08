import React, { useState } from 'react';
import { Sparkles, Download, Copy, Check, Presentation, ChevronRight, ChevronLeft, Layers } from 'lucide-react';

export function AISlideDeck({ slides = [], currentPrompt = '', onClose }) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[activeSlideIndex] || slides[0];

  const copyMarkdown = () => {
    const text = `# ${currentSlide.title}\n\n${currentSlide.subtitle}\n\n` +
      currentSlide.bullets.map(b => `- **${b.label}**: ${b.desc}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-6 rounded-3xl bg-black/85 backdrop-blur-2xl border border-white/20 shadow-[0_20px_70px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#FFD600]/20 text-[#FFD600]">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">AI Generated Pitch Slide</span>
              <span className="px-2 py-0.5 rounded-full bg-[#FFD600] text-black font-black text-[10px] font-mono">
                SLIDE {activeSlideIndex + 1} OF {slides.length}
              </span>
            </div>
            {currentPrompt && (
              <p className="text-[11px] text-neutral-400 font-mono">From Voice: "{currentPrompt}"</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyMarkdown}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Slide'}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Slide Canvas Frame (16:9 Aspect Ratio Presentation Layout) */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gradient-to-br from-[#060b17] via-[#09152b] to-[#040711] border border-white/15 p-8 sm:p-12 flex flex-col justify-between shadow-2xl">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD600]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Slide Badge */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FFD600]/20 border border-[#FFD600]/40 text-[#FFD600] text-xs font-mono font-bold">
              {currentSlide.tag || 'AI HACKATHON PITCH'}
            </span>
          </div>
          <span className="text-xs font-mono text-neutral-400">SnapSteady AI &middot; iQOO 2026</span>
        </div>

        {/* Slide Title & Hook */}
        <div className="relative z-10 my-auto">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">
            {currentSlide.title}
          </h2>
          <p className="text-sm sm:text-lg text-neutral-300 max-w-2xl font-normal leading-relaxed">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Slide Feature / Bullet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10 pt-4 border-t border-white/10">
          {currentSlide.bullets?.map((bullet, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 space-y-1 hover:border-[#FFD600]/50 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-[#FFD600] font-bold text-xs">
                <span>✦</span>
                <span>{bullet.label}</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-snug">{bullet.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Carousel Pagination */}
      {slides.length > 1 && (
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
          <button
            disabled={activeSlideIndex === 0}
            onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Slide
          </button>

          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlideIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeSlideIndex === idx ? 'w-8 bg-[#FFD600]' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            disabled={activeSlideIndex === slides.length - 1}
            onClick={() => setActiveSlideIndex(Math.min(slides.length - 1, activeSlideIndex + 1))}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 cursor-pointer"
          >
            Next Slide <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
