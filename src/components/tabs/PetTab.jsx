import React from 'react';
import { Smile, Eye, Heart, Sparkles, Moon, Flame } from 'lucide-react';
import { arcadeSound } from '../../utils/arcadeAudio';

const MOODS = [
  { id: 'happy', label: 'Happy Friend', sub: 'Smiling ^_^ with blinking anime eyes', icon: <Smile className="w-5 h-5 text-amber-400" /> },
  { id: 'goggles', label: 'VR Cyber Visor', sub: 'Scanning matrix visor [ = = ]', icon: <Eye className="w-5 h-5 text-cyan-400" /> },
  { id: 'hearts', label: 'Heart Eyes', sub: 'Loving companion ♥_♥', icon: <Heart className="w-5 h-5 text-rose-400" /> },
  { id: 'hypno', label: 'Hypno Spirals', sub: 'Rotating spiral trance eyes @_@', icon: <Sparkles className="w-5 h-5 text-purple-400" /> },
  { id: 'sleepy', label: 'Sleepy / AFK', sub: 'Zzz dreaming (-_-)zzZ', icon: <Moon className="w-5 h-5 text-indigo-400" /> },
  { id: 'boss', label: 'Boss Mode', sub: 'Combat enraged horns >_<', icon: <Flame className="w-5 h-5 text-red-400" /> },
];

export default function PetTab({ currentExpression, onSelectExpression }) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      <div>
        <h2 className="text-sm font-semibold text-zinc-100 font-sans">
          Cyber-Pet Companion Visor
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Select an expressive pixel robot face to display on your physical OLED screen.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MOODS.map((m) => {
          const isActive = currentExpression === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                arcadeSound.playJump();
                onSelectExpression(m.id);
              }}
              className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all duration-200 active:scale-98 ${
                isActive
                  ? 'bg-zinc-900 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/50'
                  : 'bg-zinc-900/40 hover:bg-zinc-900/80 border-zinc-800/80 text-zinc-300'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
                {m.icon}
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-100 font-sans">
                  {m.label}
                </div>
                <div className="text-[11px] text-zinc-400 font-sans mt-0.5 leading-relaxed">
                  {m.sub}
                </div>
                {isActive && (
                  <div className="mt-2 text-[10px] font-mono text-amber-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    EXPRESSION BROADCASTING
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
