import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Sparkles, Sliders } from 'lucide-react';

const PALETTES = {
  amber: {
    name: 'Amber',
    on: '#f59e0b',
    off: '#1a1202',
    glow: 'rgba(245, 158, 11, 0.45)',
    ledDot: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
  },
  white: {
    name: 'White',
    on: '#f4f4f5',
    off: '#09090b',
    glow: 'rgba(244, 244, 245, 0.35)',
    ledDot: 'bg-zinc-200 shadow-[0_0_8px_#ffffff]',
  },
  cyan: {
    name: 'Cyan',
    on: '#06b6d4',
    off: '#02181f',
    glow: 'rgba(6, 182, 212, 0.45)',
    ledDot: 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]',
  },
  emerald: {
    name: 'Green',
    on: '#10b981',
    off: '#021a12',
    glow: 'rgba(16, 185, 129, 0.45)',
    ledDot: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
  },
};

export default function PhysicalOledDevice({
  mode,
  expression,
  text,
  speed,
  doodleGrid,
  actionCount,
  isTransmitting,
}) {
  const canvasRef = useRef(null);
  const [paletteKey, setPaletteKey] = useState('amber');
  const [isZoomed, setIsZoomed] = useState(false);
  const palette = PALETTES[paletteKey] || PALETTES.amber;

  // Games Physics and Animation State
  const simState = useRef({
    // Pong
    pong: { bx: 64, by: 32, vx: 2.0, vy: 1.2, p1: 24, p2: 24, s1: 4, s2: 2 },
    // Dino
    dino: { y: 40, vy: 0, grounded: true, score: 140, c1: 130, c2: 190, leg: 0 },
    // Space Invaders
    invaders: { px: 60, aliens: Array.from({ length: 12 }, (_, i) => ({ x: 12 + (i % 6) * 18, y: 12 + Math.floor(i / 6) * 12, alive: true })), bullets: [] },
    // Snake
    snake: { body: [{ x: 20, y: 10 }, { x: 19, y: 10 }, { x: 18, y: 10 }], food: { x: 28, y: 10 }, score: 8 },
    // Flappy
    flappy: { y: 28, vy: 0, pipeX: 110, score: 4 },
    // Warp Stars
    stars: Array.from({ length: 45 }, () => ({ x: (Math.random() - 0.5) * 140, y: (Math.random() - 0.5) * 70, z: Math.random() * 100 + 1 })),
    marqueeOffset: 0,
  });

  // Action Hotkey Trigger (Jump, Shoot, Flap)
  useEffect(() => {
    if (!actionCount) return;
    const s = simState.current;
    if (mode === 'dino' && s.dino.grounded) {
      s.dino.vy = -5.0;
      s.dino.grounded = false;
    }
    if (mode === 'invaders') {
      s.invaders.bullets.push({ x: s.invaders.px + 4, y: 52 });
    }
    if (mode === 'flappy') {
      s.flappy.vy = -3.2;
    }
  }, [actionCount, mode]);

  useEffect(() => {
    let animId;
    let tick = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 128;
    const H = 64;

    const render = () => {
      tick++;
      const s = simState.current;

      // Background unlit pixels
      ctx.fillStyle = palette.off;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = palette.on;
      ctx.strokeStyle = palette.on;
      ctx.lineWidth = 1;

      // -------------------------------------------------------------
      // 1. DINO RUNNER
      // -------------------------------------------------------------
      if (mode === 'dino') {
        const d = s.dino;
        d.y += d.vy;
        d.vy += 0.45;
        if (d.y >= 40) { d.y = 40; d.vy = 0; d.grounded = true; }

        if (d.c1 < 36 && d.c1 > 20 && d.grounded) {
          d.vy = -5.0;
          d.grounded = false;
        }

        d.c1 -= 2.2;
        d.c2 -= 2.2;
        if (d.c1 < -10) d.c1 = W + Math.random() * 30;
        if (d.c2 < -10) d.c2 = d.c1 + 60 + Math.random() * 30;

        d.score++;
        if (tick % 4 === 0) d.leg = (d.leg + 1) % 2;

        // Ground
        ctx.fillRect(0, 54, W, 1);
        for (let gx = 0; gx < W; gx += 16) ctx.fillRect((gx - (tick % 16) + W) % W, 56, 3, 1);

        // Dino Sprite
        const dx = 18, dy = Math.floor(d.y);
        ctx.fillRect(dx + 6, dy - 12, 6, 6);
        ctx.fillRect(dx + 10, dy - 10, 2, 2);
        ctx.fillRect(dx + 4, dy - 6, 7, 10);
        ctx.fillRect(dx + 1, dy - 2, 3, 4);
        ctx.fillRect(dx + 8, dy - 2, 3, 2);

        // Eye
        ctx.fillStyle = palette.off;
        ctx.fillRect(dx + 7, dy - 11, 1, 1);
        ctx.fillStyle = palette.on;

        // Legs
        if (d.leg === 0) {
          ctx.fillRect(dx + 4, dy + 4, 2, 6);
          ctx.fillRect(dx + 8, dy + 4, 2, 4);
        } else {
          ctx.fillRect(dx + 4, dy + 4, 2, 4);
          ctx.fillRect(dx + 8, dy + 4, 2, 6);
        }

        // Cacti
        [d.c1, d.c2].forEach((cx) => {
          const icx = Math.floor(cx);
          if (icx >= -10 && icx < W + 10) {
            ctx.fillRect(icx + 2, 42, 3, 12);
            ctx.fillRect(icx, 45, 2, 5);
            ctx.fillRect(icx + 5, 47, 2, 4);
          }
        });

        // Score
        ctx.font = '7px monospace';
        ctx.fillText(`HI 00980  ${String(Math.floor(d.score / 10)).padStart(5, '0')}`, 46, 10);
      }

      // -------------------------------------------------------------
      // 2. SPACE INVADERS
      // -------------------------------------------------------------
      else if (mode === 'invaders') {
        const inv = s.invaders;
        inv.px = 58 + Math.sin(tick * 0.05) * 40;

        if (tick % 16 === 0) inv.bullets.push({ x: inv.px + 4, y: 52 });

        for (let bi = inv.bullets.length - 1; bi >= 0; bi--) {
          const b = inv.bullets[bi];
          b.y -= 2.8;
          for (let ai = 0; ai < inv.aliens.length; ai++) {
            const al = inv.aliens[ai];
            if (al.alive && Math.abs(b.x - (al.x + 4)) < 6 && Math.abs(b.y - (al.y + 4)) < 5) {
              al.alive = false;
              inv.bullets.splice(bi, 1);
              break;
            }
          }
          if (b.y < 0) inv.bullets.splice(bi, 1);
          else ctx.fillRect(Math.floor(b.x), Math.floor(b.y), 1, 3);
        }

        if (inv.aliens.every((a) => !a.alive)) inv.aliens.forEach((a) => (a.alive = true));

        const step = Math.floor(tick / 15) % 2 === 0;
        inv.aliens.forEach((al) => {
          if (!al.alive) return;
          const ax = Math.floor(al.x + (step ? 2 : 0));
          ctx.fillRect(ax + 2, al.y, 4, 1);
          ctx.fillRect(ax + 1, al.y + 1, 6, 2);
          ctx.fillRect(ax, al.y + 3, 8, 2);
          ctx.fillRect(ax + 1, al.y + 5, 2, 2);
          ctx.fillRect(ax + 5, al.y + 5, 2, 2);
        });

        const px = Math.floor(inv.px);
        ctx.fillRect(px + 4, 52, 2, 3);
        ctx.fillRect(px + 2, 55, 6, 3);
        ctx.fillRect(px, 58, 10, 3);

        ctx.font = '7px monospace';
        ctx.fillText('SPACE INVADERS // 840', 4, 8);
      }

      // -------------------------------------------------------------
      // 3. RETRO PONG
      // -------------------------------------------------------------
      else if (mode === 'pong') {
        const p = s.pong;
        p.bx += p.vx;
        p.by += p.vy;

        if (p.by <= 2 || p.by >= H - 4) p.vy = -p.vy;
        if (p.p1 + 8 < p.by) p.p1 += 1.2;
        if (p.p1 + 8 > p.by) p.p1 -= 1.2;
        if (p.p2 + 8 < p.by) p.p2 += 1.3;
        if (p.p2 + 8 > p.by) p.p2 -= 1.3;

        p.p1 = Math.max(2, Math.min(H - 18, p.p1));
        p.p2 = Math.max(2, Math.min(H - 18, p.p2));

        if (p.bx <= 8 && p.by >= p.p1 && p.by <= p.p1 + 16) p.vx = Math.abs(p.vx);
        if (p.bx >= W - 10 && p.by >= p.p2 && p.by <= p.p2 + 16) p.vx = -Math.abs(p.vx);

        if (p.bx < 0) { p.bx = 64; p.by = 32; p.s2++; }
        if (p.bx > W) { p.bx = 64; p.by = 32; p.s1++; }

        for (let y = 2; y < H; y += 4) ctx.fillRect(63, y, 2, 2);
        ctx.fillRect(4, Math.floor(p.p1), 3, 16);
        ctx.fillRect(W - 7, Math.floor(p.p2), 3, 16);
        ctx.fillRect(Math.floor(p.bx), Math.floor(p.by), 3, 3);

        ctx.font = '8px monospace';
        ctx.fillText(`0${p.s1 % 10}`, 48, 12);
        ctx.fillText(`0${p.s2 % 10}`, 72, 12);
        ctx.font = '7px monospace';
        ctx.fillText('PONG ARCADE', 32, 60);
      }

      // -------------------------------------------------------------
      // 4. SNAKE
      // -------------------------------------------------------------
      else if (mode === 'snake') {
        const sn = s.snake;
        if (tick % 6 === 0) {
          const head = { ...sn.body[0] };
          if (head.x < sn.food.x) head.x++;
          else if (head.x > sn.food.x) head.x--;
          else if (head.y < sn.food.y) head.y++;
          else if (head.y > sn.food.y) head.y--;
          sn.body.unshift(head);
          if (head.x === sn.food.x && head.y === sn.food.y) {
            sn.score += 10;
            sn.food = { x: Math.floor(Math.random() * 38) + 2, y: Math.floor(Math.random() * 16) + 3 };
          } else {
            sn.body.pop();
          }
        }
        ctx.strokeRect(1, 10, W - 2, H - 12);
        if (Math.floor(tick / 6) % 2 === 0) ctx.fillRect(sn.food.x * 3, sn.food.y * 3, 3, 3);
        sn.body.forEach((b) => ctx.fillRect(b.x * 3, b.y * 3, 2, 2));
        ctx.font = '7px monospace';
        ctx.fillText(`SNAKE // SCORE: ${sn.score}`, 4, 8);
      }

      // -------------------------------------------------------------
      // 5. FLAPPY BIRD
      // -------------------------------------------------------------
      else if (mode === 'flappy') {
        const fl = s.flappy;
        fl.y += fl.vy;
        fl.vy += 0.28;
        if (fl.y > 38) fl.vy = -2.8;
        fl.y = Math.max(4, Math.min(52, fl.y));

        fl.pipeX -= 1.6;
        if (fl.pipeX < -15) fl.pipeX = 130;

        const ipx = Math.floor(fl.pipeX);
        ctx.fillRect(ipx, 0, 10, 20);
        ctx.fillRect(ipx, 42, 10, 22);

        const by = Math.floor(fl.y);
        ctx.fillRect(24, by, 6, 5);
        ctx.fillRect(30, by + 2, 2, 2);
        ctx.fillRect(0, 62, W, 2);

        ctx.font = '8px monospace';
        ctx.fillText('FLAPPY BIRD', 40, 10);
      }

      // -------------------------------------------------------------
      // 6. CYBER-PET
      // -------------------------------------------------------------
      else if (mode === 'pet') {
        const bounce = Math.sin(tick * 0.1) * 2;
        const cy = 26 + bounce;

        ctx.fillRect(40, cy - 14, 2, 6);
        ctx.fillRect(86, cy - 14, 2, 6);
        ctx.fillRect(38, cy - 16, 6, 3);
        ctx.fillRect(84, cy - 16, 6, 3);

        ctx.strokeRect(28, cy - 8, 72, 34);

        const blink = tick % 90 > 85;
        if (expression === 'happy') {
          if (blink) {
            ctx.fillRect(44, cy + 4, 12, 2);
            ctx.fillRect(72, cy + 4, 12, 2);
          } else {
            ctx.beginPath(); ctx.arc(50, cy + 6, 6, Math.PI, 0); ctx.stroke();
            ctx.beginPath(); ctx.arc(78, cy + 6, 6, Math.PI, 0); ctx.stroke();
          }
          ctx.beginPath(); ctx.arc(64, cy + 12, 5, 0, Math.PI); ctx.stroke();
        } else if (expression === 'goggles') {
          ctx.fillRect(38, cy + 2, 52, 10);
          ctx.fillRect(60, cy + 18, 8, 2);
        } else if (expression === 'hearts') {
          [46, 74].forEach((hx) => {
            ctx.fillRect(hx + 2, cy + 2, 3, 3);
            ctx.fillRect(hx + 7, cy + 2, 3, 3);
            ctx.fillRect(hx + 1, cy + 4, 10, 3);
            ctx.fillRect(hx + 4, cy + 9, 4, 2);
          });
          ctx.beginPath(); ctx.arc(64, cy + 16, 4, 0, Math.PI); ctx.stroke();
        } else {
          ctx.fillRect(44, cy + 6, 12, 2);
          ctx.fillRect(72, cy + 6, 12, 2);
          ctx.fillRect(62, cy + 14, 4, 2);
        }

        ctx.fillRect(2, 54, W - 4, 1);
        ctx.font = '7px monospace';
        ctx.fillText(`♥ COMPANION // ${text || 'READY'}`, 8, 62);
      }

      // -------------------------------------------------------------
      // 7. MARQUEE & DOODLE
      // -------------------------------------------------------------
      else if (mode === 'marquee') {
        ctx.strokeRect(1, 1, W - 2, H - 2);
        ctx.font = '7px monospace';
        ctx.fillText('VR DISPLAY STREAMER', 12, 14);
        ctx.fillRect(8, 17, W - 16, 1);

        const banner = `   ***   ${text || 'IN VR - DO NOT TOUCH'}   ***   `;
        ctx.font = 'bold 12px monospace';
        const strW = ctx.measureText(banner).width;
        s.marqueeOffset = (s.marqueeOffset + 1.2) % strW;
        ctx.fillText(banner, W - s.marqueeOffset, 36);
      } else if (mode === 'doodle' && doodleGrid) {
        const cols = doodleGrid.length;
        const rows = doodleGrid[0]?.length || 0;
        const cellW = Math.floor(W / cols);
        const cellH = Math.floor(H / rows);
        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            if (doodleGrid[x][y]) ctx.fillRect(x * cellW, y * cellH, cellW - 1, cellH - 1);
          }
        }
        ctx.font = '6px monospace';
        ctx.fillText('PIXEL DOODLE', 3, 7);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [mode, expression, text, speed, doodleGrid, palette]);

  return (
    <div className="flex flex-col items-center justify-center py-2 select-none">
      {/* CNC Anodized Chassis */}
      <div
        className={`relative bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 p-5 rounded-[2.5rem] border border-zinc-700/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] transition-all duration-300 ${
          isZoomed ? 'w-full max-w-2xl' : 'w-full max-w-lg'
        }`}
      >
        {/* 4 Corner Screws */}
        <div className="absolute top-4 left-4 w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-900 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[1px] bg-zinc-900 rotate-45" />
        </div>
        <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-900 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[1px] bg-zinc-900 -rotate-45" />
        </div>
        <div className="absolute bottom-4 left-4 w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-900 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[1px] bg-zinc-900 -rotate-30" />
        </div>
        <div className="absolute bottom-4 right-4 w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-900 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-[1px] bg-zinc-900 rotate-60" />
        </div>

        {/* Chassis Top Plate */}
        <div className="flex items-center justify-between px-2 pb-3 mb-1 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full transition-all duration-150 ${
                isTransmitting ? 'bg-amber-400 scale-125 shadow-[0_0_8px_#f59e0b]' : palette.ledDot
              }`}
            />
            <span className="font-semibold text-zinc-300 tracking-wider">
              SSD1306 &bull; 0.96″ I2C
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Phosphor Palette Switcher */}
            <div className="flex items-center gap-1 bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800">
              {Object.entries(PALETTES).map(([k, p]) => (
                <button
                  key={k}
                  onClick={() => setPaletteKey(k)}
                  title={p.name}
                  className={`w-3 h-3 rounded-full transition-all ${
                    paletteKey === k ? 'ring-2 ring-white scale-110' : 'opacity-30 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: p.on }}
                />
              ))}
            </div>

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              title={isZoomed ? 'Normal View' : 'Enlarge OLED'}
            >
              {isZoomed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* OLED Glass Housing Screen */}
        <div className="relative rounded-2xl overflow-hidden bg-black p-3 border-2 border-zinc-950 shadow-inner">
          <canvas
            ref={canvasRef}
            width={128}
            height={64}
            className="w-full aspect-[2/1] rounded"
            style={{
              imageRendering: 'pixelated',
              boxShadow: `0 0 40px ${palette.glow}`,
            }}
          />

          {/* CRT Scanline Texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 1px, transparent 1px, transparent 2px)',
            }}
          />

          {/* Glass Glare Reflection */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-2xl" />
        </div>

        {/* Chassis Bottom Markings */}
        <div className="flex items-center justify-between px-2 pt-3 mt-1 text-[10px] font-mono text-zinc-500">
          <span>ACTIVE: {mode.toUpperCase()}</span>
          <span>128 &times; 64 MONOCHROME</span>
        </div>
      </div>
    </div>
  );
}
