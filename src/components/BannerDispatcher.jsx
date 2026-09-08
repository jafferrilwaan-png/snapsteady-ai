import React, { useState } from 'react';
import { Send, MessageSquareCode, Check, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

const PRESET_BANNERS = [
  'STANDBY',
  'TARGET LOCKED',
  'VITALS ACTIVE',
  'SYS OVERRIDE',
  'EXTRACT READY',
  'THREAT HIGH',
  'ALL CLEAR',
];

export default function BannerDispatcher({ currentMessage, onPushMessage, isTransmitting }) {
  const [inputText, setInputText] = useState(currentMessage);
  const maxLen = 20;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputText.trim().slice(0, maxLen);
    sound.playTransmit();
    onPushMessage(trimmed || 'STANDBY');
  };

  const handleSelectPreset = (preset) => {
    setInputText(preset);
    sound.playClick();
    onPushMessage(preset);
  };

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
          <MessageSquareCode className="w-3.5 h-3.5 text-cyan-400" />
          Tactical Banner Dispatcher
        </label>
        <span
          className={`text-[11px] font-mono ${
            inputText.length >= maxLen ? 'text-rose-400 font-bold' : 'text-slate-500'
          }`}
        >
          {inputText.length} / {maxLen} CHARS
        </span>
      </div>

      {/* Input + Push Button */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            maxLength={maxLen}
            onChange={(e) => setInputText(e.target.value.toUpperCase())}
            placeholder="CUSTOM ALERT (MAX 20 CHARS)..."
            className="w-full bg-black/60 border border-white/10 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-300 placeholder:text-slate-600 outline-none uppercase tracking-wider transition-colors shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={isTransmitting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-lg shadow-cyan-950/50 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Push</span>
        </button>
      </form>

      {/* Quick Mission Preset Badges */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Presets:
        </span>
        {PRESET_BANNERS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all active:scale-95 border ${
              currentMessage === preset
                ? 'bg-cyan-950 border-cyan-700 text-cyan-300 font-semibold'
                : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
