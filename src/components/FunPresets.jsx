import React from 'react';
import { Sparkles, Headphones, Gamepad2, Volume2, Smile, Eye, Heart, Moon, Flame } from 'lucide-react';
import { arcadeSound } from '../utils/arcadeAudio';

const VR_STATUS_PRESETS = [
  { emoji: '🥽', label: 'IN VR: DO NOT DISTURB', mode: 'marquee' },
  { emoji: '🍕', label: 'AFK: SNACK RUN', mode: 'marquee' },
  { emoji: '👾', label: 'BOSS FIGHT IN PROGRESS', mode: 'marquee' },
  { emoji: '🎧', label: 'CANNOT HEAR YOU', mode: 'marquee' },
  { emoji: '🚀', label: 'WARP SPEED ENGAGED', mode: 'warp' },
  { emoji: '💤', label: 'SLEEP MODE / AFK', mode: 'pet', expression: 'sleepy' },
  { emoji: '🏆', label: 'NEW HIGH SCORE!', mode: 'pong' },
  { emoji: '🔥', label: 'CURRENT MOOD: ON FIRE', mode: 'marquee' },
];

const PET_EXPRESSIONS = [
  { id: 'happy', label: 'Happy ^_^', icon: <Smile className="w-3.5 h-3.5" /> },
  { id: 'goggles', label: 'VR Visor [==]', icon: <Eye className="w-3.5 h-3.5" /> },
  { id: 'hearts', label: 'Hearts ♥_♥', icon: <Heart className="w-3.5 h-3.5" /> },
  { id: 'hypno', label: 'Hypno @_@', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'sleepy', label: 'Sleepy -_-', icon: <Moon className="w-3.5 h-3.5" /> },
  { id: 'boss', label: 'Boss Mode >_<', icon: <Flame className="w-3.5 h-3.5" /> },
];

export default function FunPresets({
  currentExpression,
  onSelectExpression,
  onTriggerPreset,
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. VR Gamer Status Presets */}
      <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
              VR Gamer Status Presets
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">1-CLICK OLED DISPATCH</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {VR_STATUS_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                arcadeSound.playCoin();
                onTriggerPreset(p);
              }}
              className="flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-cyan-950/40 border border-white/5 hover:border-cyan-500/40 text-left transition-all active:scale-95 group"
            >
              <span className="text-base group-hover:scale-125 transition-transform">
                {p.emoji}
              </span>
              <span className="text-[11px] font-mono font-medium text-slate-300 group-hover:text-cyan-300 truncate">
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Cyber-Pet Mood Switcher */}
      <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
              Companion Face Expressions
            </span>
          </div>
          <span className="text-[10px] font-mono text-purple-400 font-semibold uppercase">
            ACTIVE: {currentExpression}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {PET_EXPRESSIONS.map((exp) => {
            const isActive = currentExpression === exp.id;
            return (
              <button
                key={exp.id}
                onClick={() => {
                  arcadeSound.playJump();
                  onSelectExpression(exp.id);
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all active:scale-95 gap-1 ${
                  isActive
                    ? 'bg-purple-950/60 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={isActive ? 'text-purple-300' : 'text-slate-400'}>
                  {exp.icon}
                </div>
                <span className="text-[10px] font-mono font-bold whitespace-nowrap">
                  {exp.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Retro 8-Bit Arcade Soundboard */}
      <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
              8-Bit Arcade Soundboard
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">PLAYFUL AUDIO FX</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={() => arcadeSound.playCoin()}
            className="px-3 py-2 rounded-xl bg-amber-950/30 hover:bg-amber-900/50 border border-amber-600/40 text-amber-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            🪙 Coin Ding
          </button>
          <button
            onClick={() => arcadeSound.playLaser()}
            className="px-3 py-2 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-600/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            ⚡ Laser Zap
          </button>
          <button
            onClick={() => arcadeSound.playJump()}
            className="px-3 py-2 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-600/40 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            🦘 Jump Boing
          </button>
          <button
            onClick={() => arcadeSound.playPowerUp()}
            className="px-3 py-2 rounded-xl bg-purple-950/30 hover:bg-purple-900/50 border border-purple-600/40 text-purple-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            🍄 Power-Up
          </button>
          <button
            onClick={() => arcadeSound.playVictory()}
            className="px-3 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 border border-rose-600/40 text-rose-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm col-span-2 sm:col-span-1"
          >
            🎺 Victory!
          </button>
        </div>
      </div>
    </div>
  );
}
