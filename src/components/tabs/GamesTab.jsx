import React from 'react';
import { Play, Flame, Trophy, Gauge, Sparkles } from 'lucide-react';
import { arcadeSound } from '../../utils/arcadeAudio';

const GAMES = [
  {
    id: 'dino',
    name: 'Pixel Dino Runner',
    badge: 'T-Rex Jump',
    actionText: 'Jump (Space)',
    desc: 'Run through the desert, jump over cacti obstacles, and chase the high score.',
  },
  {
    id: 'invaders',
    name: 'Space Invaders',
    badge: 'Galaga Arcade',
    actionText: 'Fire Lasers (Space)',
    desc: 'Alien armada descending from deep space. Fire laser cannons to defend Earth.',
  },
  {
    id: 'pong',
    name: 'Retro Pong',
    badge: '1972 Classic',
    actionText: 'Serve Ball',
    desc: 'Bouncing square ball with dual AI paddles and scoreboard.',
  },
  {
    id: 'snake',
    name: 'Classic Snake',
    badge: 'Retro 8-Bit',
    actionText: 'Feed Snake',
    desc: 'Slither through the grid eating glowing pixel food pellets to grow.',
  },
  {
    id: 'flappy',
    name: 'Flappy Pixel Bird',
    badge: 'Endless Flight',
    actionText: 'Flap Wings (Space)',
    desc: 'Navigate vertical pipes with gravity and precise flap timing.',
  },
];

export default function GamesTab({
  currentGame,
  onSelectGame,
  onGameAction,
  speed,
  setSpeed,
}) {
  const activeGame = GAMES.find((g) => g.id === currentGame) || GAMES[0];

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-200">
      {/* Top Action Deck */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-lg">
            🎮
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-100 font-sans">
                {activeGame.name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                {activeGame.badge}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700 text-[11px] font-mono">Spacebar</kbd> or click the action button to play!
            </p>
          </div>
        </div>

        {/* Big Action Button */}
        <button
          onClick={() => {
            if (activeGame.id === 'invaders') arcadeSound.playLaser();
            else if (activeGame.id === 'dino' || activeGame.id === 'flappy') arcadeSound.playJump();
            else arcadeSound.playCoin();
            onGameAction(activeGame.id);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-lg shadow-amber-500/20"
        >
          <Flame className="w-4 h-4 fill-current" />
          <span>{activeGame.actionText}</span>
        </button>
      </div>

      {/* 5 Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {GAMES.map((game) => {
          const isActive = currentGame === game.id;
          return (
            <button
              key={game.id}
              onClick={() => {
                arcadeSound.playCoin();
                onSelectGame(game.id);
              }}
              className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 active:scale-98 relative ${
                isActive
                  ? 'bg-zinc-900 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/50'
                  : 'bg-zinc-900/40 hover:bg-zinc-900/80 border-zinc-800/80 text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xs font-semibold text-zinc-100 font-sans">
                  {game.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-950/80 text-zinc-400 border border-zinc-800">
                  {game.badge}
                </span>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-2">
                {game.desc}
              </p>

              {isActive && (
                <div className="mt-3 pt-2 w-full border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-amber-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    RUNNING ON OLED
                  </span>
                  <span>30 FPS</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Speed & Difficulty Slider */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-medium">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span>GAME SPEED / DIFFICULTY</span>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-amber-300 border border-zinc-700">
            {speed}x
          </span>
        </div>

        <input
          type="range"
          min="8"
          max="30"
          step="1"
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
          className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer border border-zinc-700"
        />

        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
          <span>Casual Flow</span>
          <span>Standard</span>
          <span>Turbo Speed 🔥</span>
        </div>
      </div>
    </div>
  );
}
