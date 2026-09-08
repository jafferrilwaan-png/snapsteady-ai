import React from 'react';
import { Gamepad2, Play, Flame, Trophy, Crosshair, Sparkles } from 'lucide-react';
import { arcadeSound } from '../utils/arcadeAudio';

const GAMES = [
  {
    id: 'pong',
    name: 'Retro Pong',
    icon: '🏓',
    tag: 'Classic 1972',
    desc: 'Bouncing ball, dual AI paddles & live score counter.',
    actionLabel: 'Serve Ball',
    color: 'border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/20 text-emerald-300',
    activeColor: 'border-emerald-400 bg-emerald-950/50 text-emerald-200 ring-2 ring-emerald-400',
  },
  {
    id: 'dino',
    name: 'Pixel Dino Run',
    icon: '🦖',
    tag: 'Chrome Runner',
    desc: 'T-Rex running through the desert jumping over cacti!',
    actionLabel: 'Jump (Space)',
    color: 'border-amber-500/40 hover:border-amber-400 bg-amber-950/20 text-amber-300',
    activeColor: 'border-amber-400 bg-amber-950/50 text-amber-200 ring-2 ring-amber-400',
  },
  {
    id: 'invaders',
    name: 'Space Invaders',
    icon: '👾',
    tag: 'Arcade Classic',
    desc: 'Defend Earth! Alien fleet marching with laser blasters.',
    actionLabel: 'Fire Laser (Space)',
    color: 'border-purple-500/40 hover:border-purple-400 bg-purple-950/20 text-purple-300',
    activeColor: 'border-purple-400 bg-purple-950/50 text-purple-200 ring-2 ring-purple-400',
  },
  {
    id: 'snake',
    name: 'Pixel Snake',
    icon: '🐍',
    tag: 'Nokia Retro',
    desc: 'Hungry snake slithering, eating pixel pellets & growing.',
    actionLabel: 'Boost Speed',
    color: 'border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/20 text-cyan-300',
    activeColor: 'border-cyan-400 bg-cyan-950/50 text-cyan-200 ring-2 ring-cyan-400',
  },
  {
    id: 'flappy',
    name: 'Flappy Pixel',
    icon: '🐦',
    tag: 'Obstacle Flight',
    desc: 'Flap through green pipes! Gravity & tap timing test.',
    actionLabel: 'Flap Wings (Space)',
    color: 'border-pink-500/40 hover:border-pink-400 bg-pink-950/20 text-pink-300',
    activeColor: 'border-pink-400 bg-pink-950/50 text-pink-200 ring-2 ring-pink-400',
  },
];

export default function ArcadeGameCenter({
  currentGame, // 'pong' | 'dino' | 'invaders' | 'snake' | 'flappy'
  onSelectGame,
  onGameAction, // Trigger jump, fire, or flap
}) {
  const activeGameObj = GAMES.find((g) => g.id === currentGame) || GAMES[0];

  return (
    <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-100 flex items-center gap-2">
              Retro Pixel Arcade Console
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700">
                5 PLAYABLE OLED GAMES
              </span>
            </h2>
          </div>
        </div>

        {/* Big Action Button for active game */}
        <button
          onClick={() => {
            if (activeGameObj.id === 'invaders') arcadeSound.playLaser();
            else if (activeGameObj.id === 'dino' || activeGameObj.id === 'flappy') arcadeSound.playJump();
            else arcadeSound.playCoin();
            onGameAction(activeGameObj.id);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-lg shadow-amber-950/60"
        >
          <Flame className="w-4 h-4 fill-current" />
          <span>{activeGameObj.actionLabel}</span>
        </button>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {GAMES.map((game) => {
          const isActive = currentGame === game.id;
          return (
            <button
              key={game.id}
              onClick={() => {
                arcadeSound.playCoin();
                onSelectGame(game.id);
              }}
              className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all duration-200 active:scale-95 relative overflow-hidden ${
                isActive ? game.activeColor : game.color
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xl">{game.icon}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 border border-white/10 text-slate-300">
                  {game.tag}
                </span>
              </div>

              <div className="text-xs font-bold font-sans text-white">
                {game.name}
              </div>

              <div className="text-[10px] font-mono text-slate-400 mt-1 line-clamp-2 leading-tight">
                {game.desc}
              </div>

              {isActive && (
                <div className="mt-2.5 pt-1.5 border-t border-current/20 w-full flex items-center justify-between text-[10px] font-mono font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                    PLAYING
                  </span>
                  <span>OLED SYNC</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Controls Hint */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 px-1">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Laptop Hotkey: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold border border-white/10">Spacebar</kbd> or click the action button above to Jump / Shoot!
        </span>
        <span className="text-slate-500 hidden sm:inline">128&times;64 Pixel Native Engine</span>
      </div>
    </div>
  );
}
