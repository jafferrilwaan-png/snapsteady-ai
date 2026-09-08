import React from 'react';

const MarqueeItem = () => (
  <div className="flex items-center space-x-10 px-6 font-mono text-xs font-bold tracking-widest text-neutral-300 uppercase">
    <span>SnapSteady AI</span> <span className="text-[#FFD600]">✦</span>
    <span>Zero-Shake Auto-Capture</span> <span className="text-[#FFD600]">✦</span>
    <span>On-Device Gemma 2B NPU</span> <span className="text-[#FFD600]">✦</span>
    <span>Real Speech Recognition</span> <span className="text-[#FFD600]">✦</span>
    <span>iQOO Hackathon Flagship</span> <span className="text-[#FFD600]">✦</span>
  </div>
);

export function CinematicFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full border-t border-white/10 pt-16 pb-12 overflow-hidden text-neutral-200">
      {/* Living Artwork Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          style={{
            backgroundImage: `url('/bg-art.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom'
          }}
          className="w-full h-full opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Marquee Ticker */}
      <div className="relative z-10 w-full overflow-hidden border-y border-white/10 bg-black/50 backdrop-blur-xl py-3.5 mb-14">
        <div className="flex w-max animate-marquee">
          <MarqueeItem />
          <MarqueeItem />
        </div>
      </div>

      {/* Center Content */}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        <div className="backdrop-blur-2xl bg-black/60 border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl w-full flex flex-col items-center">
          <img
            src="/logo.webp"
            alt="iQOO Hackathon"
            className="h-10 w-auto object-contain mb-4 drop-shadow-lg"
          />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD600]/15 border border-[#FFD600]/40 text-xs font-mono text-[#FFD600] mb-4">
            <span>iQOO HACKATHON 2026</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Ready to experience the future of camera AI?
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto mb-8">
            SnapSteady AI runs 100% on-device. Real hardware video stream, real Web Speech AI, real canvas pixel analysis, and instant local photo caching.
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href="#experience"
              className="px-8 py-4 rounded-2xl bg-[#FFD600] hover:bg-yellow-400 text-black font-black text-sm transition-transform hover:scale-105 shadow-xl shadow-[#FFD600]/30"
            >
              Try Live Viewfinder
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/15 border border-white/30 hover:border-white/60 text-white font-bold text-sm transition-all"
            >
              GitHub Repository
            </a>
          </div>

          {/* Bottom Credits & Scroll to Top */}
          <div className="w-full pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-mono">
            <div>© 2026 SnapSteady AI &middot; Built for iQOO Hackathon</div>
            
            <button
              onClick={scrollToTop}
              className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 hover:border-[#FFD600] text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>↑</span> Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
