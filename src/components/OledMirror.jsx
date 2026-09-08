import React, { useEffect, useRef, useState } from 'react';
import { Tv, Maximize2, Minimize2, Eye, Sparkles } from 'lucide-react';

const PALETTES = {
  cyan: {
    name: 'Cyber Cyan',
    pixelOn: '#22d3ee',
    pixelOff: '#041d27',
    glow: 'rgba(34, 211, 238, 0.4)',
    borderGlow: 'border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    tag: 'text-cyan-400',
  },
  amber: {
    name: 'Tactical Amber',
    pixelOn: '#f59e0b',
    pixelOff: '#1f1300',
    glow: 'rgba(245, 158, 11, 0.4)',
    borderGlow: 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    tag: 'text-amber-400',
  },
  matrix: {
    name: 'Bio Green',
    pixelOn: '#34d399',
    pixelOff: '#022013',
    glow: 'rgba(52, 211, 153, 0.4)',
    borderGlow: 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    tag: 'text-emerald-400',
  },
  white: {
    name: 'OLED White',
    pixelOn: '#f8fafc',
    pixelOff: '#090d16',
    glow: 'rgba(248, 250, 252, 0.4)',
    borderGlow: 'border-slate-500/40 shadow-[0_0_20px_rgba(255,255,255,0.15)]',
    tag: 'text-slate-300',
  },
};

export default function OledMirror({
  screen,
  message,
  depth,
  bpm,
  confidence,
  targetIp = '172.21.169.16',
}) {
  const canvasRef = useRef(null);
  const [paletteKey, setPaletteKey] = useState('cyan');
  const [isZoomed, setIsZoomed] = useState(false);
  const palette = PALETTES[paletteKey] || PALETTES.cyan;

  // Animation frame loop for real-time waveform and flashing
  useEffect(() => {
    let animId;
    let tick = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed 128x64 OLED resolution
    const W = 128;
    const H = 64;

    const render = () => {
      tick++;

      // Fill background (unlit pixel grid)
      ctx.fillStyle = palette.pixelOff;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = palette.pixelOn;
      ctx.strokeStyle = palette.pixelOn;
      ctx.lineWidth = 1;

      // ==========================================
      // SCREEN 0: TACTICAL HUD
      // ==========================================
      if (screen === 0) {
        // Outer decorative HUD frame with notches
        ctx.strokeRect(1, 1, W - 2, H - 2);

        // Corner tick marks
        ctx.fillRect(3, 3, 3, 1);
        ctx.fillRect(3, 3, 1, 3);
        ctx.fillRect(W - 6, 3, 3, 1);
        ctx.fillRect(W - 4, 3, 1, 3);
        ctx.fillRect(3, H - 4, 3, 1);
        ctx.fillRect(3, H - 6, 1, 3);
        ctx.fillRect(W - 6, H - 4, 3, 1);
        ctx.fillRect(W - 4, H - 6, 1, 3);

        // Header strip
        ctx.fillRect(1, 1, W - 2, 9);
        ctx.fillStyle = palette.pixelOff;
        ctx.font = '7px monospace';
        ctx.fillText('A.U.R.A. HUD // 01', 5, 8);

        // Signal icon (3 ascending bars)
        ctx.fillRect(W - 14, 6, 2, 3);
        ctx.fillRect(W - 11, 4, 2, 5);
        ctx.fillRect(W - 8, 2, 2, 7);

        ctx.fillStyle = palette.pixelOn;

        // Reticle / Crosshair in left area
        const cx = 24;
        const cy = 28;
        const r = 11;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair ticks
        ctx.beginPath();
        ctx.moveTo(cx - 15, cy);
        ctx.lineTo(cx - 8, cy);
        ctx.moveTo(cx + 8, cy);
        ctx.lineTo(cx + 15, cy);
        ctx.moveTo(cx, cy - 15);
        ctx.lineTo(cx, cy - 8);
        ctx.moveTo(cx, cy + 8);
        ctx.lineTo(cx, cy + 15);
        ctx.stroke();

        // Rotating scanner line
        const angle = (tick * 0.05) % (Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * (r - 2), cy + Math.sin(angle) * (r - 2));
        ctx.stroke();

        // Center dot
        ctx.fillRect(cx - 1, cy - 1, 2, 2);

        // Telemetry Data Readouts (Right column)
        ctx.font = '7px monospace';
        ctx.fillText(`DPTH:${depth.toFixed(1)}m`, 44, 20);
        ctx.fillText(`CONF:${confidence}%`, 44, 28);
        ctx.fillText(`PULS:${bpm}BPM`, 44, 36);

        // Confidence Horizontal Bar
        ctx.strokeRect(44, 40, 78, 5);
        const barWidth = Math.max(0, Math.min(74, Math.round((confidence / 100) * 74)));
        ctx.fillRect(46, 42, barWidth, 2);

        // Bottom Banner / Status Line
        ctx.fillRect(1, 50, W - 2, 1);
        ctx.font = '7px monospace';
        const displayMsg = (message || 'STANDBY').toUpperCase().slice(0, 19);
        ctx.fillText(`> ${displayMsg}`, 4, 59);
      }

      // ==========================================
      // SCREEN 1: BIO-WAVEFORM (Animated ECG/Sine)
      // ==========================================
      else if (screen === 1) {
        // Screen Header
        ctx.fillRect(1, 1, W - 2, 9);
        ctx.fillStyle = palette.pixelOff;
        ctx.font = '7px monospace';
        ctx.fillText(`BIO-VITALS // ${bpm} BPM`, 4, 8);

        // Pulsing heart symbol
        const heartPuff = Math.sin(tick * 0.15) > 0.3;
        if (heartPuff) {
          ctx.fillRect(W - 12, 3, 2, 2);
          ctx.fillRect(W - 9, 3, 2, 2);
          ctx.fillRect(W - 13, 5, 7, 2);
          ctx.fillRect(W - 11, 7, 3, 2);
        }

        ctx.fillStyle = palette.pixelOn;

        // Subtle background grid dots
        for (let gx = 10; gx < W; gx += 16) {
          for (let gy = 15; gy < 48; gy += 10) {
            ctx.fillRect(gx, gy, 1, 1);
          }
        }

        // Draw dynamic ECG/Sine Waveform
        const baselineY = 32;
        const speed = (bpm / 16) * 1.8;
        const shift = tick * speed;

        ctx.beginPath();
        for (let x = 2; x < W - 2; x++) {
          const t = (x + shift) % 70; // cycle length
          let y = baselineY;

          // ECG P-Q-R-S-T complex simulation
          if (t >= 15 && t < 20) {
            // P wave
            y -= Math.sin(((t - 15) / 5) * Math.PI) * 3;
          } else if (t >= 25 && t < 27) {
            // Q dip
            y += 3;
          } else if (t >= 27 && t < 31) {
            // R peak
            y -= 16;
          } else if (t >= 31 && t < 34) {
            // S dip
            y += 5;
          } else if (t >= 38 && t < 46) {
            // T wave
            y -= Math.sin(((t - 38) / 8) * Math.PI) * 5;
          } else {
            // Baseline noise
            y += (Math.sin(x * 0.3 + tick * 0.1) * 0.5);
          }

          if (x === 2) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Leading glowing sweep line
        const sweepX = (tick * 1.5) % (W - 4) + 2;
        ctx.fillRect(sweepX, 12, 1, 36);

        // Stats Footer Bar
        ctx.fillRect(1, 50, W - 2, 1);
        ctx.font = '7px monospace';
        const bioMsg = (message || 'VITALS STABLE').toUpperCase().slice(0, 19);
        ctx.fillText(`STATUS: ${bioMsg}`, 4, 59);
      }

      // ==========================================
      // SCREEN 2: LOCKDOWN ALERT (High-Contrast Flashing)
      // ==========================================
      else if (screen === 2) {
        const isFlash = Math.floor(tick / 10) % 2 === 0;

        if (isFlash) {
          // Inverted Emergency Screen
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = palette.pixelOff;
          ctx.strokeStyle = palette.pixelOff;
        }

        // Hazard border stripes
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, W - 2, H - 2);

        // Alert Header
        ctx.font = 'bold 8px monospace';
        ctx.fillText('! ! LOCKDOWN ALERT ! !', 10, 12);
        ctx.fillRect(4, 15, W - 8, 1);

        // Warning Diamond / Triangles
        ctx.strokeRect(6, 20, 18, 18);
        ctx.font = 'bold 11px monospace';
        ctx.fillText('!', 12, 33);

        ctx.strokeRect(W - 24, 20, 18, 18);
        ctx.fillText('!', W - 18, 33);

        // Center Alert Box
        const alertMsg = (message || 'TARGET LOCKED').toUpperCase().slice(0, 16);
        ctx.font = 'bold 8px monospace';
        ctx.fillText(alertMsg, 30, 27);

        ctx.font = '7px monospace';
        ctx.fillText(`RANGE: ${depth.toFixed(1)}m`, 30, 36);
        ctx.fillText(`PROB:  ${confidence}%`, 72, 36);

        // Bottom Emergency Action Strip
        ctx.fillRect(4, 42, W - 8, 1);
        ctx.font = '7px monospace';
        ctx.fillText('LETHAL AUTH: CONFIRMED', 12, 53);
        ctx.fillText('[ OVERRIDE REQUIRED ]', 14, 61);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [screen, message, depth, bpm, confidence, palette]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Mirror Container Box with CRT Aesthetic */}
      <div
        className={`relative p-3 rounded-2xl bg-slate-950/90 border transition-all duration-300 ${
          palette.borderGlow
        } ${isZoomed ? 'w-full max-w-2xl' : 'w-full max-w-md'}`}
      >
        {/* Mirror Header Bar */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Tv className={`w-3.5 h-3.5 ${palette.tag}`} />
            <span className="font-semibold tracking-wider text-slate-300">
              HARDWARE OLED MIRROR
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-400">
              128 &times; 64 SSD1306
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Palette Switcher */}
            <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
              {Object.entries(PALETTES).map(([k, p]) => (
                <button
                  key={k}
                  onClick={() => setPaletteKey(k)}
                  title={p.name}
                  className={`w-3.5 h-3.5 rounded-full transition-all ${
                    paletteKey === k
                      ? 'ring-2 ring-white scale-110'
                      : 'opacity-40 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: p.pixelOn }}
                />
              ))}
            </div>

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
              title={isZoomed ? 'Standard View' : 'Enlarge Screen'}
            >
              {isZoomed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* OLED Screen Housing */}
        <div className="relative rounded-xl overflow-hidden bg-black p-2 border-2 border-slate-900 shadow-inner flex items-center justify-center">
          {/* Authentic 128x64 Canvas Scaled with pixelated rendering */}
          <canvas
            ref={canvasRef}
            width={128}
            height={64}
            className="w-full aspect-[2/1] rounded"
            style={{
              imageRendering: 'pixelated',
              boxShadow: `0 0 25px ${palette.glow}`,
            }}
          />

          {/* CRT Scanline Overlay Effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.8) 0px, rgba(0,0,0,0.8) 1px, transparent 1px, transparent 2px)',
            }}
          />

          {/* Glass Specular Reflection */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-xl" />
        </div>

        {/* Mirror Sub-bar */}
        <div className="flex items-center justify-between mt-2 pt-1.5 text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SYNCHRONIZED CANVAS MIRROR
          </span>
          <span className="tracking-tight text-slate-400">
            MODE: {screen === 0 ? 'HUD [0]' : screen === 1 ? 'BIO [1]' : 'ALERT [2]'}
          </span>
        </div>
      </div>
    </div>
  );
}
