import React, { useEffect, useRef, useState } from 'react';
import { Gamepad2, Maximize2, Minimize2 } from 'lucide-react';

const SCREEN_PALETTES = {
  amber: {
    name: 'Retro Amber',
    on: '#fbbf24',
    off: '#1e1402',
    glow: 'rgba(251, 191, 36, 0.45)',
    border: 'border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    tag: 'text-amber-400',
  },
  green: {
    name: 'Matrix Green',
    on: '#4ade80',
    off: '#032011',
    glow: 'rgba(74, 222, 128, 0.45)',
    border: 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]',
    tag: 'text-emerald-400',
  },
  cyan: {
    name: 'Electric Cyan',
    on: '#22d3ee',
    off: '#041d27',
    glow: 'rgba(34, 211, 238, 0.45)',
    border: 'border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]',
    tag: 'text-cyan-400',
  },
  purple: {
    name: 'Cyber Violet',
    on: '#c084fc',
    off: '#160d26',
    glow: 'rgba(192, 132, 252, 0.45)',
    border: 'border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.3)]',
    tag: 'text-purple-400',
  },
  white: {
    name: 'Classic White',
    on: '#f8fafc',
    off: '#0b0f19',
    glow: 'rgba(248, 250, 252, 0.35)',
    border: 'border-slate-500/40 shadow-[0_0_30px_rgba(255,255,255,0.2)]',
    tag: 'text-slate-300',
  },
};

export default function ArcadeOledScreen({
  mode, // 'pong' | 'dino' | 'invaders' | 'snake' | 'flappy' | 'pet' | 'viz' | 'warp' | 'marquee' | 'doodle'
  expression = 'happy',
  text = '',
  speed = 15,
  doodleGrid,
  actionCount = 0, // incremented when user presses Space or action button
}) {
  const canvasRef = useRef(null);
  const [paletteKey, setPaletteKey] = useState('amber');
  const [isZoomed, setIsZoomed] = useState(false);
  const palette = SCREEN_PALETTES[paletteKey] || SCREEN_PALETTES.amber;

  // Games State Cache
  const gameStateRef = useRef({
    // Pong
    pong: { bx: 64, by: 32, vx: 2.0, vy: 1.2, p1: 24, p2: 24, s1: 4, s2: 2 },
    // Dino Runner
    dino: {
      y: 40,
      vy: 0,
      isGrounded: true,
      score: 120,
      cactusX: 130,
      cactus2X: 190,
      legState: 0,
    },
    // Space Invaders
    invaders: {
      playerX: 60,
      aliens: Array.from({ length: 12 }, (_, i) => ({
        x: 14 + (i % 6) * 18,
        y: 12 + Math.floor(i / 6) * 12,
        alive: true,
      })),
      dir: 1,
      bullets: [],
    },
    // Snake
    snake: {
      body: [
        { x: 20, y: 10 },
        { x: 19, y: 10 },
        { x: 18, y: 10 },
        { x: 17, y: 10 },
      ],
      dir: { x: 1, y: 0 },
      food: { x: 28, y: 10 },
      score: 5,
    },
    // Flappy
    flappy: {
      y: 28,
      vy: 0,
      pipes: [
        { x: 110, gapY: 26 },
        { x: 180, gapY: 34 },
      ],
      score: 3,
    },
    // Stars for Warp
    stars: Array.from({ length: 50 }, () => ({
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 80,
      z: Math.random() * 100 + 1,
    })),
    marqueeOffset: 0,
  });

  // Handle Action Trigger (Jump / Fire / Flap)
  useEffect(() => {
    if (actionCount === 0) return;
    const g = gameStateRef.current;

    // Dino Jump
    if (mode === 'dino' && g.dino.isGrounded) {
      g.dino.vy = -5.2;
      g.dino.isGrounded = false;
    }

    // Space Invaders Fire
    if (mode === 'invaders') {
      g.invaders.bullets.push({
        x: g.invaders.playerX + 4,
        y: 52,
      });
    }

    // Flappy Flap
    if (mode === 'flappy') {
      g.flappy.vy = -3.5;
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
      const g = gameStateRef.current;

      // Clear with OLED background unlit color
      ctx.fillStyle = palette.off;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = palette.on;
      ctx.strokeStyle = palette.on;
      ctx.lineWidth = 1;

      // ===============================================
      // 1. DINO RUNNER GAME
      // ===============================================
      if (mode === 'dino') {
        const d = g.dino;

        // Gravity & Jump Physics
        d.y += d.vy;
        d.vy += 0.45; // gravity
        if (d.y >= 40) {
          d.y = 40;
          d.vy = 0;
          d.isGrounded = true;
        }

        // Auto-jump in demo mode if obstacle gets close
        if (d.cactusX < 36 && d.cactusX > 20 && d.isGrounded) {
          d.vy = -5.0;
          d.isGrounded = false;
        }

        // Move Cacti
        const gameSpeed = 1.8 + (speed || 15) * 0.05;
        d.cactusX -= gameSpeed;
        d.cactus2X -= gameSpeed;
        if (d.cactusX < -10) d.cactusX = W + Math.random() * 40;
        if (d.cactus2X < -10) d.cactus2X = d.cactusX + 60 + Math.random() * 40;

        d.score += 1;
        if (tick % 4 === 0) d.legState = (d.legState + 1) % 2;

        // Ground line
        ctx.fillRect(0, 54, W, 1);
        for (let gx = 0; gx < W; gx += 16) {
          ctx.fillRect((gx - (tick % 16) + W) % W, 56, 3, 1);
        }

        // Draw Pixel Dino (12x14 pixels)
        const dx = 18;
        const dy = Math.floor(d.y);

        // Dino Body & Head
        ctx.fillRect(dx + 6, dy - 12, 6, 6); // head
        ctx.fillRect(dx + 10, dy - 10, 2, 2); // snout
        ctx.fillRect(dx + 4, dy - 6, 7, 10); // body
        ctx.fillRect(dx + 1, dy - 2, 3, 4); // tail
        ctx.fillRect(dx + 8, dy - 2, 3, 2); // arms

        // Eye (empty)
        ctx.fillStyle = palette.off;
        ctx.fillRect(dx + 7, dy - 11, 1, 1);
        ctx.fillStyle = palette.on;

        // Animated Legs
        if (d.legState === 0) {
          ctx.fillRect(dx + 4, dy + 4, 2, 6);
          ctx.fillRect(dx + 8, dy + 4, 2, 4);
        } else {
          ctx.fillRect(dx + 4, dy + 4, 2, 4);
          ctx.fillRect(dx + 8, dy + 4, 2, 6);
        }

        // Draw Cacti (Obstacles)
        [d.cactusX, d.cactus2X].forEach((cx) => {
          const icx = Math.floor(cx);
          if (icx >= -10 && icx < W + 10) {
            ctx.fillRect(icx + 2, 42, 3, 12);
            ctx.fillRect(icx, 45, 2, 5);
            ctx.fillRect(icx + 5, 47, 2, 4);
          }
        });

        // Scoreboard
        ctx.font = '7px monospace';
        ctx.fillText(`HI 00980  ${String(Math.floor(d.score / 10)).padStart(5, '0')}`, 46, 10);
      }

      // ===============================================
      // 2. SPACE INVADERS ARCADE
      // ===============================================
      else if (mode === 'invaders') {
        const inv = g.invaders;

        // Move Player Spaceship
        inv.playerX = 58 + Math.sin(tick * 0.05) * 40;

        // Move Alien Fleet
        const moveStep = Math.floor(tick / 15) % 2 === 0;
        if (tick % 25 === 0) {
          inv.dir = -inv.dir;
        }

        // Auto fire bullet
        if (tick % 18 === 0) {
          inv.bullets.push({ x: inv.playerX + 4, y: 52 });
        }

        // Update Bullets
        for (let bi = inv.bullets.length - 1; bi >= 0; bi--) {
          const b = inv.bullets[bi];
          b.y -= 2.5;

          // Check bullet collision with aliens
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

        // Respawn aliens if all dead
        if (inv.aliens.every((a) => !a.alive)) {
          inv.aliens.forEach((a) => (a.alive = true));
        }

        // Draw Aliens (Pixel Bugs)
        inv.aliens.forEach((al, i) => {
          if (!al.alive) return;
          const ax = Math.floor(al.x + (moveStep ? 2 : 0));
          const ay = al.y;

          // Alien pixel shape
          ctx.fillRect(ax + 2, ay, 4, 1);
          ctx.fillRect(ax + 1, ay + 1, 6, 2);
          ctx.fillRect(ax, ay + 3, 8, 2);
          ctx.fillRect(ax + 1, ay + 5, 2, 2);
          ctx.fillRect(ax + 5, ay + 5, 2, 2);
        });

        // Draw Player Spaceship
        const px = Math.floor(inv.playerX);
        ctx.fillRect(px + 4, 52, 2, 3);
        ctx.fillRect(px + 2, 55, 6, 3);
        ctx.fillRect(px, 58, 10, 3);

        // Header score
        ctx.font = '7px monospace';
        ctx.fillText('SCORE: 01480  LIVES: 3', 6, 8);
      }

      // ===============================================
      // 3. PIXEL SNAKE
      // ===============================================
      else if (mode === 'snake') {
        const s = g.snake;

        // Auto move snake towards food
        if (tick % 6 === 0) {
          const head = { ...s.body[0] };
          if (head.x < s.food.x) head.x += 1;
          else if (head.x > s.food.x) head.x -= 1;
          else if (head.y < s.food.y) head.y += 1;
          else if (head.y > s.food.y) head.y -= 1;

          s.body.unshift(head);

          // Eat food
          if (head.x === s.food.x && head.y === s.food.y) {
            s.score += 10;
            s.food = {
              x: Math.floor(Math.random() * 38) + 2,
              y: Math.floor(Math.random() * 16) + 3,
            };
          } else {
            s.body.pop();
          }
        }

        // Draw Arena Boundary
        ctx.strokeRect(1, 10, W - 2, H - 12);

        // Draw Food (blinking pixel dot)
        if (Math.floor(tick / 6) % 2 === 0) {
          ctx.fillRect(s.food.x * 3, s.food.y * 3, 3, 3);
        }

        // Draw Snake Body
        s.body.forEach((seg, idx) => {
          ctx.fillRect(seg.x * 3, seg.y * 3, 2, 2);
        });

        // Score header
        ctx.font = '7px monospace';
        ctx.fillText(`SNAKE // SCORE: ${s.score}  LENGTH: ${s.body.length}`, 4, 8);
      }

      // ===============================================
      // 4. FLAPPY PIXEL BIRD
      // ===============================================
      else if (mode === 'flappy') {
        const fl = g.flappy;

        // Gravity & Flap Physics
        fl.y += fl.vy;
        fl.vy += 0.28; // gravity
        fl.y = Math.max(4, Math.min(54, fl.y));

        // Auto-flap if falling too low
        if (fl.y > 38) {
          fl.vy = -2.8;
        }

        // Move Pipes
        fl.pipes.forEach((p) => {
          p.x -= 1.4;
          if (p.x < -16) {
            p.x = W + 20;
            p.gapY = Math.floor(Math.random() * 24) + 18;
            fl.score += 1;
          }

          // Draw Top Pipe
          const px = Math.floor(p.x);
          ctx.fillRect(px, 0, 10, p.gapY - 10);
          ctx.fillRect(px - 2, p.gapY - 12, 14, 2);

          // Draw Bottom Pipe
          ctx.fillRect(px, p.gapY + 14, 10, H - (p.gapY + 14));
          ctx.fillRect(px - 2, p.gapY + 14, 14, 2);
        });

        // Draw Flappy Bird (8x6 pixels)
        const bx = 24;
        const by = Math.floor(fl.y);
        ctx.fillRect(bx + 2, by, 5, 5); // body
        ctx.fillRect(bx + 7, by + 2, 2, 2); // beak
        ctx.fillRect(bx, by + 2, 3, 2); // wing (flapping)

        // Ground
        ctx.fillRect(0, 60, W, 4);

        // Score
        ctx.font = '8px monospace';
        ctx.fillText(`0${fl.score % 100}`, 60, 10);
      }

      // ===============================================
      // 5. RETRO PONG ARCADE
      // ===============================================
      else if (mode === 'pong') {
        const p = g.pong;

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

      // ===============================================
      // 6. CYBER-PET VR COMPANION
      // ===============================================
      else if (mode === 'pet') {
        const bounce = Math.sin(tick * 0.1) * 2;
        const cy = 26 + bounce;

        ctx.fillRect(40, cy - 14, 2, 6);
        ctx.fillRect(86, cy - 14, 2, 6);
        ctx.fillRect(38, cy - 16, 6, 3);
        ctx.fillRect(84, cy - 16, 6, 3);

        ctx.strokeRect(28, cy - 8, 72, 34);

        const isBlinking = tick % 90 > 85;
        if (isBlinking) {
          ctx.fillRect(44, cy + 4, 12, 2);
          ctx.fillRect(72, cy + 4, 12, 2);
        } else {
          ctx.beginPath();
          ctx.arc(50, cy + 6, 6, Math.PI, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(78, cy + 6, 6, Math.PI, 0);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(64, cy + 12, 5, 0, Math.PI);
        ctx.stroke();

        ctx.fillRect(2, 54, W - 4, 1);
        ctx.font = '7px monospace';
        ctx.fillText(`♥ COMPANION // ${text || 'READY'}`, 8, 62);
      }

      // ===============================================
      // 7. AUDIO SPECTRUM VIZ
      // ===============================================
      else if (mode === 'viz') {
        ctx.fillRect(2, 2, W - 4, 9);
        ctx.fillStyle = palette.off;
        ctx.font = '7px monospace';
        ctx.fillText('NEON SOUND SPECTRUM', 6, 9);
        ctx.fillStyle = palette.on;

        for (let i = 0; i < 16; i++) {
          const wave = Math.abs(Math.sin(tick * 0.1 + i * 0.5) * 32);
          const h = Math.max(3, Math.floor(wave));
          ctx.fillRect(8 + i * 7, 50 - h, 5, h);
        }
        ctx.fillRect(4, 52, W - 8, 1);
        ctx.font = '7px monospace';
        ctx.fillText(text || 'AUDIO GROOVE', 6, 60);
      }

      // ===============================================
      // 8. 3D STARFIELD WARP
      // ===============================================
      else if (mode === 'warp') {
        g.stars.forEach((star) => {
          star.z -= 2.0;
          if (star.z <= 0) {
            star.z = 100;
            star.x = (Math.random() - 0.5) * 160;
            star.y = (Math.random() - 0.5) * 80;
          }
          const k = 45 / star.z;
          const px = 64 + star.x * k;
          const py = 32 + star.y * k;
          if (px >= 0 && px < W && py >= 0 && py < H) {
            ctx.fillRect(Math.floor(px), Math.floor(py), 1, 1);
          }
        });
        ctx.strokeRect(59, 27, 10, 10);
        ctx.font = '7px monospace';
        ctx.fillText('WARP SPEED', 4, 10);
      }

      // ===============================================
      // 9. MARQUEE BANNER
      // ===============================================
      else if (mode === 'marquee') {
        ctx.strokeRect(1, 1, W - 2, H - 2);
        ctx.font = '7px monospace';
        ctx.fillText('VR DISPLAY STREAMER', 12, 14);
        ctx.fillRect(8, 17, W - 16, 1);

        const bannerStr = `   ***   ${text || 'IN VR - DO NOT TOUCH'}   ***   `;
        ctx.font = 'bold 12px monospace';
        const strW = ctx.measureText(bannerStr).width;
        g.marqueeOffset = (g.marqueeOffset + 1.2) % strW;
        ctx.fillText(bannerStr, W - g.marqueeOffset, 36);
      }

      // ===============================================
      // 10. DOODLE CANVAS
      // ===============================================
      else if (mode === 'doodle' && doodleGrid) {
        const cols = doodleGrid.length;
        const rows = doodleGrid[0]?.length || 0;
        const cellW = Math.floor(W / cols);
        const cellH = Math.floor(H / rows);

        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            if (doodleGrid[x][y]) {
              ctx.fillRect(x * cellW, y * cellH, cellW - 1, cellH - 1);
            }
          }
        }
        ctx.font = '6px monospace';
        ctx.fillText('LIVE PIXEL DOODLE', 3, 7);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [mode, expression, text, speed, doodleGrid, palette]);

  return (
    <div className="flex flex-col items-center select-none">
      <div
        className={`relative p-3.5 rounded-3xl bg-slate-950/90 border transition-all duration-300 ${
          palette.border
        } ${isZoomed ? 'w-full max-w-2xl' : 'w-full max-w-md'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Gamepad2 className={`w-4 h-4 ${palette.tag}`} />
            <span className="font-bold tracking-wider text-slate-200">
              128&times;64 PIXEL OLED DISPLAY
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Palette Switcher */}
            <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
              {Object.entries(SCREEN_PALETTES).map(([k, p]) => (
                <button
                  key={k}
                  onClick={() => setPaletteKey(k)}
                  title={p.name}
                  className={`w-3.5 h-3.5 rounded-full transition-all ${
                    paletteKey === k
                      ? 'ring-2 ring-white scale-110'
                      : 'opacity-40 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: p.on }}
                />
              ))}
            </div>

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
              title={isZoomed ? 'Standard View' : 'Enlarge Screen'}
            >
              {isZoomed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* The Screen Bezel */}
        <div className="relative rounded-2xl overflow-hidden bg-black p-2.5 border-2 border-slate-900 shadow-inner flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={128}
            height={64}
            className="w-full aspect-[2/1] rounded-lg"
            style={{
              imageRendering: 'pixelated',
              boxShadow: `0 0 35px ${palette.glow}`,
            }}
          />

          {/* CRT Scanline Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.85) 0px, rgba(0,0,0,0.85) 1px, transparent 1px, transparent 2px)',
            }}
          />

          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none rounded-t-2xl" />
        </div>

        {/* Live Sub-bar */}
        <div className="flex items-center justify-between mt-2.5 pt-1 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold uppercase">{mode} ACTIVE</span>
          </span>
          <span className="text-slate-400">
            Speed: {speed} &bull; SSD1306 128&times;64
          </span>
        </div>
      </div>
    </div>
  );
}
