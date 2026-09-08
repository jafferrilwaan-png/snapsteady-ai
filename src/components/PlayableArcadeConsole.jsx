import React, { useEffect, useRef, useState, useCallback } from 'react';
import { arcadeSound } from '../utils/arcadeAudio';
import { RefreshCw, Zap, Trophy, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

const PALETTES = {
  amber: { name: 'Amber', on: '#fbbf24', off: '#150f02', glow: '#fbbf2466' },
  green: { name: 'Matrix', on: '#4ade80', off: '#02180c', glow: '#4ade8066' },
  cyan: { name: 'Cyan', on: '#22d3ee', off: '#03161c', glow: '#22d3ee66' },
  white: { name: 'OLED', on: '#f8fafc', off: '#090d16', glow: '#ffffff44' },
};

export default function PlayableArcadeConsole({
  targetIp,
  connectionStatus,
  onSync,
  onSendGameToEsp32,
  onOpenCodeModal,
}) {
  const canvasRef = useRef(null);
  const [activeGame, setActiveGame] = useState('dino'); // 'dino' | 'pong' | 'invaders' | 'snake' | 'flappy'
  const [paletteKey, setPaletteKey] = useState('amber');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const palette = PALETTES[paletteKey] || PALETTES.amber;

  // Real Playable Game Engine State
  const gameRef = useRef({
    // Dino
    dino: { y: 40, vy: 0, jumping: false, cacti: [140, 220], score: 0, dead: false },
    // Pong
    pong: { bx: 64, by: 32, vx: 2.2, vy: 1.4, p1: 24, p2: 24, s1: 0, s2: 0, dead: false },
    // Space Invaders
    invaders: { px: 60, aliens: [], bullets: [], dead: false, score: 0 },
    // Snake
    snake: { body: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }], dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, food: { x: 22, y: 10 }, dead: false, score: 0 },
    // Flappy
    flappy: { y: 28, vy: 0, pipes: [{ x: 130, gapY: 28 }], dead: false, score: 0 },
  });

  // Init Invaders fleet
  const initInvaders = () => {
    const aliens = [];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 6; c++) {
        aliens.push({ x: 14 + c * 18, y: 12 + r * 12, alive: true });
      }
    }
    gameRef.current.invaders = { px: 60, aliens, bullets: [], dead: false, score: 0 };
  };

  // Reset current game
  const resetGame = useCallback((gameKey = activeGame) => {
    setGameOver(false);
    setScore(0);
    const g = gameRef.current;

    if (gameKey === 'dino') {
      g.dino = { y: 40, vy: 0, jumping: false, cacti: [130, 200], score: 0, dead: false };
    } else if (gameKey === 'pong') {
      g.pong = { bx: 64, by: 32, vx: 2.2, vy: 1.4, p1: 24, p2: 24, s1: 0, s2: 0, dead: false };
    } else if (gameKey === 'invaders') {
      initInvaders();
    } else if (gameKey === 'snake') {
      g.snake = { body: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }], dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, food: { x: 22, y: 10 }, dead: false, score: 0 };
    } else if (gameKey === 'flappy') {
      g.flappy = { y: 28, vy: 0, pipes: [{ x: 130, gapY: 28 }, { x: 200, gapY: 34 }], dead: false, score: 0 };
    }

    // Inform ESP32
    onSendGameToEsp32(gameKey);
  }, [activeGame, onSendGameToEsp32]);

  // Select game
  const handleSelectGame = (key) => {
    setActiveGame(key);
    resetGame(key);
    if (soundOn) arcadeSound.playCoin();
  };

  // Player Input Handlers
  const handleActionA = () => {
    const g = gameRef.current;
    if (gameOver) {
      resetGame();
      if (soundOn) arcadeSound.playPowerUp();
      return;
    }

    if (activeGame === 'dino') {
      if (!g.dino.jumping && g.dino.y >= 40) {
        g.dino.vy = -5.4;
        g.dino.jumping = true;
        if (soundOn) arcadeSound.playJump();
      }
    } else if (activeGame === 'invaders') {
      if (g.invaders.bullets.length < 3) {
        g.invaders.bullets.push({ x: g.invaders.px + 4, y: 52 });
        if (soundOn) arcadeSound.playLaser();
      }
    } else if (activeGame === 'flappy') {
      g.flappy.vy = -3.4;
      if (soundOn) arcadeSound.playJump();
    }
  };

  const handleActionB = () => {
    resetGame();
    if (soundOn) arcadeSound.playPowerUp();
  };

  const handleMove = (dir) => {
    const g = gameRef.current;
    if (gameOver) return;

    if (activeGame === 'pong') {
      if (dir === 'up') g.pong.p1 = Math.max(2, g.pong.p1 - 6);
      if (dir === 'down') g.pong.p1 = Math.min(46, g.pong.p1 + 6);
    } else if (activeGame === 'invaders') {
      if (dir === 'left') g.invaders.px = Math.max(4, g.invaders.px - 6);
      if (dir === 'right') g.invaders.px = Math.min(116, g.invaders.px + 6);
    } else if (activeGame === 'snake') {
      const cur = g.snake.dir;
      if (dir === 'up' && cur.y === 0) g.snake.nextDir = { x: 0, y: -1 };
      if (dir === 'down' && cur.y === 0) g.snake.nextDir = { x: 0, y: 1 };
      if (dir === 'left' && cur.x === 0) g.snake.nextDir = { x: -1, y: 0 };
      if (dir === 'right' && cur.x === 0) g.snake.nextDir = { x: 1, y: 0 };
    } else if (activeGame === 'dino') {
      if (dir === 'up') handleActionA();
    } else if (activeGame === 'flappy') {
      if (dir === 'up') handleActionA();
    }
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space' || e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleActionA();
      } else if (e.key === 'r' || e.key === 'R' || e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        handleActionB();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleMove('up');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleMove('down');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleMove('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleMove('right');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeGame, gameOver, soundOn]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animId;
    let tick = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 128;
    const H = 64;

    initInvaders();

    const loop = () => {
      tick++;
      const g = gameRef.current;

      // Clear Screen
      ctx.fillStyle = palette.off;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = palette.on;
      ctx.strokeStyle = palette.on;
      ctx.lineWidth = 1;

      // ==========================================
      // 1. DINO RUNNER
      // ==========================================
      if (activeGame === 'dino') {
        const d = g.dino;

        if (!d.dead) {
          d.y += d.vy;
          d.vy += 0.45;
          if (d.y >= 40) {
            d.y = 40;
            d.vy = 0;
            d.jumping = false;
          }

          d.cacti = d.cacti.map((cx) => cx - 2.2);
          if (d.cacti[0] < -10) d.cacti[0] = W + Math.random() * 30;
          if (d.cacti[1] < -10) d.cacti[1] = d.cacti[0] + 65 + Math.random() * 30;

          d.score += 1;
          setScore(Math.floor(d.score / 10));

          // Collision Check
          d.cacti.forEach((cx) => {
            if (cx > 12 && cx < 28 && d.y > 32) {
              d.dead = true;
              setGameOver(true);
              if (soundOn) arcadeSound.playLaser();
            }
          });
        }

        // Draw Ground
        ctx.fillRect(0, 54, W, 1);
        for (let x = 0; x < W; x += 18) {
          ctx.fillRect((x - (tick * 2) % 18 + 18) % W, 56, 3, 1);
        }

        // Draw Dino
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

        // Animated Legs
        const leg = (tick % 6 > 3) ? 1 : 0;
        if (leg === 0 || d.jumping) {
          ctx.fillRect(dx + 4, dy + 4, 2, 6);
          ctx.fillRect(dx + 8, dy + 4, 2, 4);
        } else {
          ctx.fillRect(dx + 4, dy + 4, 2, 4);
          ctx.fillRect(dx + 8, dy + 4, 2, 6);
        }

        // Draw Cacti
        d.cacti.forEach((cx) => {
          const icx = Math.floor(cx);
          if (icx >= -5 && icx < W) {
            ctx.fillRect(icx + 2, 42, 3, 12);
            ctx.fillRect(icx, 45, 2, 5);
            ctx.fillRect(icx + 5, 47, 2, 4);
          }
        });

        // Top Score Bar
        ctx.font = '7px monospace';
        ctx.fillText(`DINO // SCORE: ${String(Math.floor(d.score / 10)).padStart(4, '0')}`, 4, 8);

        if (d.dead) {
          ctx.fillRect(20, 20, 88, 22);
          ctx.fillStyle = palette.off;
          ctx.font = 'bold 8px monospace';
          ctx.fillText('GAME OVER', 38, 30);
          ctx.font = '6px monospace';
          ctx.fillText('PRESS [A] TO RESTART', 24, 38);
        }
      }

      // ==========================================
      // 2. RETRO PONG
      // ==========================================
      else if (activeGame === 'pong') {
        const p = g.pong;

        p.bx += p.vx;
        p.by += p.vy;

        if (p.by <= 2 || p.by >= H - 4) {
          p.vy = -p.vy;
          if (soundOn) arcadeSound.playBlip();
        }

        // AI Paddle 2
        if (p.p2 + 8 < p.by) p.p2 += 1.3;
        if (p.p2 + 8 > p.by) p.p2 -= 1.3;
        p.p2 = Math.max(2, Math.min(46, p.p2));

        // Player 1 Collision
        if (p.bx <= 7 && p.by >= p.p1 && p.by <= p.p1 + 16) {
          p.vx = Math.abs(p.vx);
          p.bx = 8;
          if (soundOn) arcadeSound.playBlip();
        }

        // AI Player 2 Collision
        if (p.bx >= 120 && p.by >= p.p2 && p.by <= p.p2 + 16) {
          p.vx = -Math.abs(p.vx);
          p.bx = 119;
          if (soundOn) arcadeSound.playBlip();
        }

        // Goals
        if (p.bx < 0) {
          p.s2++;
          p.bx = 64; p.by = 32;
          p.vx = 2.0;
        }
        if (p.bx > 128) {
          p.s1++;
          setScore(p.s1);
          p.bx = 64; p.by = 32;
          p.vx = -2.0;
        }

        // Center Net
        for (let y = 0; y < 64; y += 4) ctx.fillRect(63, y, 1, 2);

        // Paddles
        ctx.fillRect(3, Math.floor(p.p1), 3, 16);
        ctx.fillRect(122, Math.floor(p.p2), 3, 16);

        // Ball
        ctx.fillRect(Math.floor(p.bx), Math.floor(p.by), 3, 3);

        // Scores
        ctx.font = '8px monospace';
        ctx.fillText(`YOU: ${p.s1}`, 18, 10);
        ctx.fillText(`CPU: ${p.s2}`, 76, 10);
      }

      // ==========================================
      // 3. SPACE INVADERS
      // ==========================================
      else if (activeGame === 'invaders') {
        const inv = g.invaders;

        // Bullets
        for (let bi = inv.bullets.length - 1; bi >= 0; bi--) {
          const b = inv.bullets[bi];
          b.y -= 3.0;

          // Check hit
          for (let ai = 0; ai < inv.aliens.length; ai++) {
            const al = inv.aliens[ai];
            if (al.alive && Math.abs(b.x - (al.x + 4)) < 6 && Math.abs(b.y - (al.y + 4)) < 6) {
              al.alive = false;
              inv.bullets.splice(bi, 1);
              inv.score += 10;
              setScore(inv.score);
              if (soundOn) arcadeSound.playLaser();
              break;
            }
          }
          if (b.y < 0) inv.bullets.splice(bi, 1);
          else ctx.fillRect(Math.floor(b.x), Math.floor(b.y), 1, 3);
        }

        // Respawn if cleared
        if (inv.aliens.every((a) => !a.alive)) {
          initInvaders();
          if (soundOn) arcadeSound.playVictory();
        }

        // Draw Aliens
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

        // Player Ship
        const px = Math.floor(inv.px);
        ctx.fillRect(px + 4, 52, 2, 3);
        ctx.fillRect(px + 2, 55, 6, 3);
        ctx.fillRect(px, 58, 10, 3);

        // Header
        ctx.font = '7px monospace';
        ctx.fillText(`INVADERS // SCORE: ${inv.score}`, 4, 8);
      }

      // ==========================================
      // 4. PIXEL SNAKE
      // ==========================================
      else if (activeGame === 'snake') {
        const s = g.snake;

        if (!s.dead && tick % 6 === 0) {
          s.dir = s.nextDir;
          const head = { x: s.body[0].x + s.dir.x, y: s.body[0].y + s.dir.y };

          // Wall hit
          if (head.x < 1 || head.x > 40 || head.y < 4 || head.y > 19) {
            s.dead = true;
            setGameOver(true);
            if (soundOn) arcadeSound.playLaser();
          }

          // Self hit
          if (s.body.some((seg) => seg.x === head.x && seg.y === head.y)) {
            s.dead = true;
            setGameOver(true);
            if (soundOn) arcadeSound.playLaser();
          }

          if (!s.dead) {
            s.body.unshift(head);
            if (head.x === s.food.x && head.y === s.food.y) {
              s.score += 10;
              setScore(s.score);
              s.food = { x: Math.floor(Math.random() * 36) + 3, y: Math.floor(Math.random() * 14) + 4 };
              if (soundOn) arcadeSound.playCoin();
            } else {
              s.body.pop();
            }
          }
        }

        ctx.strokeRect(1, 10, W - 2, H - 12);
        // Food
        if (Math.floor(tick / 4) % 2 === 0) ctx.fillRect(s.food.x * 3, s.food.y * 3, 3, 3);
        // Snake
        s.body.forEach((b) => ctx.fillRect(b.x * 3, b.y * 3, 2, 2));

        ctx.font = '7px monospace';
        ctx.fillText(`SNAKE // SCORE: ${s.score}`, 4, 8);

        if (s.dead) {
          ctx.fillRect(20, 20, 88, 22);
          ctx.fillStyle = palette.off;
          ctx.font = 'bold 8px monospace';
          ctx.fillText('SNAKE CRASHED', 28, 30);
          ctx.font = '6px monospace';
          ctx.fillText('PRESS [A] TO RETRY', 30, 38);
        }
      }

      // ==========================================
      // 5. FLAPPY BIRD
      // ==========================================
      else if (activeGame === 'flappy') {
        const fl = g.flappy;

        if (!fl.dead) {
          fl.y += fl.vy;
          fl.vy += 0.28;
          if (fl.y >= 54 || fl.y <= 0) {
            fl.dead = true;
            setGameOver(true);
            if (soundOn) arcadeSound.playLaser();
          }

          fl.pipes.forEach((p) => {
            p.x -= 1.6;
            if (p.x < -15) {
              p.x = W + 15;
              p.gapY = Math.floor(Math.random() * 20) + 16;
              fl.score++;
              setScore(fl.score);
              if (soundOn) arcadeSound.playCoin();
            }

            // Pipe Collision Check
            if (p.x > 14 && p.x < 32) {
              if (fl.y < p.gapY || fl.y > p.gapY + 16) {
                fl.dead = true;
                setGameOver(true);
                if (soundOn) arcadeSound.playLaser();
              }
            }
          });
        }

        // Draw Pipes
        fl.pipes.forEach((p) => {
          const ipx = Math.floor(p.x);
          ctx.fillRect(ipx, 0, 10, p.gapY);
          ctx.fillRect(ipx, p.gapY + 18, 10, H - (p.gapY + 18));
        });

        // Bird
        const by = Math.floor(fl.y);
        ctx.fillRect(24, by, 6, 5);
        ctx.fillRect(30, by + 2, 2, 2);

        // Ground
        ctx.fillRect(0, 60, W, 4);

        ctx.font = '7px monospace';
        ctx.fillText(`FLAPPY // SCORE: ${fl.score}`, 4, 8);

        if (fl.dead) {
          ctx.fillRect(20, 20, 88, 22);
          ctx.fillStyle = palette.off;
          ctx.font = 'bold 8px monospace';
          ctx.fillText('GAME OVER', 40, 30);
          ctx.font = '6px monospace';
          ctx.fillText('PRESS [A] TO FLAP AGAIN', 22, 38);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [activeGame, palette, soundOn]);

  return (
    <div className="flex flex-col items-center justify-center py-4 w-full max-w-2xl mx-auto select-none">
      {/* Console Housing */}
      <div className="w-full bg-gradient-to-b from-zinc-800 via-zinc-900 to-black p-6 sm:p-8 rounded-[3rem] border border-zinc-700/70 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col items-center gap-6 relative">
        {/* Top Metallic Branding */}
        <div className="w-full flex items-center justify-between px-3 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="font-bold text-zinc-200 tracking-widest uppercase">
              ESP32 RETRO CONSOLE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundOn(!soundOn)}
              className="p-1 rounded text-zinc-400 hover:text-white"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-zinc-800">
              {Object.entries(PALETTES).map(([k, p]) => (
                <button
                  key={k}
                  onClick={() => setPaletteKey(k)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    paletteKey === k ? 'ring-2 ring-white scale-110' : 'opacity-40'
                  }`}
                  style={{ backgroundColor: p.on }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* The Screen (128x64 OLED) */}
        <div className="w-full relative bg-black p-4 rounded-2xl border-4 border-zinc-950 shadow-inner flex flex-col items-center justify-center">
          <canvas
            ref={canvasRef}
            width={128}
            height={64}
            className="w-full aspect-[2/1] rounded"
            style={{
              imageRendering: 'pixelated',
              boxShadow: `0 0 45px ${palette.glow}`,
            }}
          />
          {/* CRT scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 2px)',
            }}
          />
          {/* Glass reflection */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-xl" />
        </div>

        {/* 5 Cartridge Selector Buttons */}
        <div className="w-full grid grid-cols-5 gap-1.5 p-1.5 bg-black/60 rounded-2xl border border-zinc-800">
          {[
            { id: 'dino', label: 'DINO', emoji: '🦖' },
            { id: 'pong', label: 'PONG', emoji: '🏓' },
            { id: 'invaders', label: 'SPACE', emoji: '👾' },
            { id: 'snake', label: 'SNAKE', emoji: '🐍' },
            { id: 'flappy', label: 'FLAP', emoji: '🐦' },
          ].map((game) => {
            const isSel = activeGame === game.id;
            return (
              <button
                key={game.id}
                onClick={() => handleSelectGame(game.id)}
                className={`flex flex-col items-center justify-center py-2 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 ${
                  isSel
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <span className="text-base">{game.emoji}</span>
                <span className="text-[10px] mt-0.5">{game.label}</span>
              </button>
            );
          })}
        </div>

        {/* Physical Gamepad Controls (D-Pad & A/B Action Buttons) */}
        <div className="w-full flex items-center justify-between px-4 sm:px-8 pt-2">
          {/* Directional D-Pad */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Center Background */}
            <div className="w-10 h-10 bg-zinc-800 rounded-lg absolute" />

            {/* UP */}
            <button
              onClick={() => handleMove('up')}
              className="absolute top-0 w-10 h-10 bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500 text-zinc-200 rounded-t-lg shadow flex items-center justify-center font-bold text-sm active:scale-95 transition-all"
            >
              ▲
            </button>
            {/* DOWN */}
            <button
              onClick={() => handleMove('down')}
              className="absolute bottom-0 w-10 h-10 bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500 text-zinc-200 rounded-b-lg shadow flex items-center justify-center font-bold text-sm active:scale-95 transition-all"
            >
              ▼
            </button>
            {/* LEFT */}
            <button
              onClick={() => handleMove('left')}
              className="absolute left-0 w-10 h-10 bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500 text-zinc-200 rounded-l-lg shadow flex items-center justify-center font-bold text-sm active:scale-95 transition-all"
            >
              ◄
            </button>
            {/* RIGHT */}
            <button
              onClick={() => handleMove('right')}
              className="absolute right-0 w-10 h-10 bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500 text-zinc-200 rounded-r-lg shadow flex items-center justify-center font-bold text-sm active:scale-95 transition-all"
            >
              ►
            </button>
          </div>

          {/* Action A & B Buttons */}
          <div className="flex items-center gap-4">
            {/* B Button (Restart) */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={handleActionB}
                className="w-14 h-14 rounded-full bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border-2 border-zinc-600 text-zinc-300 font-bold font-mono text-base shadow-lg active:scale-95 transition-all flex items-center justify-center"
              >
                B
              </button>
              <span className="text-[10px] font-mono text-zinc-500">RESTART</span>
            </div>

            {/* A Button (Jump / Fire / Flap) */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={handleActionA}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:from-amber-600 active:to-amber-700 text-zinc-950 font-black font-mono text-lg shadow-[0_4px_20px_rgba(245,158,11,0.4)] active:scale-95 transition-all flex items-center justify-center"
              >
                A
              </button>
              <span className="text-[10px] font-mono text-amber-400 font-bold">JUMP/FIRE</span>
            </div>
          </div>
        </div>

        {/* Keyboard Helper Footnote */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-500 px-2 pt-2 border-t border-zinc-800/80">
          <span>Keyboard: <kbd className="text-zinc-300 font-bold bg-zinc-800 px-1.5 py-0.5 rounded">Arrow Keys</kbd> + <kbd className="text-amber-400 font-bold bg-zinc-800 px-1.5 py-0.5 rounded">Spacebar</kbd></span>
          <button
            onClick={onOpenCodeModal}
            className="text-amber-400 hover:underline"
          >
            Get Arduino IDE Code &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
