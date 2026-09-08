import React, { useState } from 'react';
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { arcadeSound } from '../../utils/arcadeAudio';

const PRESETS = [
  { emoji: '🥽', text: 'IN VR: DO NOT DISTURB' },
  { emoji: '🍕', text: 'AFK: SNACK RUN' },
  { emoji: '👾', text: 'BOSS FIGHT IN PROGRESS' },
  { emoji: '🎧', text: 'CANNOT HEAR YOU' },
  { emoji: '🚀', text: 'WARP SPEED ENGAGED' },
  { emoji: '🏆', text: 'NEW HIGH SCORE!' },
  { emoji: '💤', text: 'CHARGING / ASLEEP' },
  { emoji: '🔥', text: 'CURRENT MOOD: ON FIRE' },
];

export default function MarqueeTab({ currentText, onPushText }) {
  const [inputText, setInputText] = useState(currentText || 'IN VR - DO NOT TOUCH');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    arcadeSound.playLaser();
    onPushText(inputText.trim().toUpperCase());
  };

  const handleSelectPreset = (txt) => {
    setInputText(txt);
    arcadeSound.playCoin();
    onPushText(txt);
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      <div>
        <h2 className="text-sm font-semibold text-zinc-100 font-sans">
          Live OLED Status Marquee
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Stream custom real-time status banners across your OLED display while gaming or in VR.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            maxLength={32}
            onChange={(e) => setInputText(e.target.value.toUpperCase())}
            placeholder="TYPE STATUS BANNER FOR VR..."
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 outline-none uppercase tracking-wider transition-colors shadow-inner"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Stream</span>
        </button>
      </form>

      {/* Preset Badges Grid */}
      <div className="flex flex-col gap-2 pt-2">
        <span className="text-[11px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          One-Click VR Player Presets:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p.text)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 text-left transition-all active:scale-95 group"
            >
              <span className="text-base group-hover:scale-110 transition-transform">{p.emoji}</span>
              <span className="text-xs font-mono text-zinc-300 group-hover:text-amber-300 truncate">
                {p.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
