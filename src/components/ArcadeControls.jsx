import React from 'react';
import { Gamepad, Music, Rocket, MessageSquare, Paintbrush, Gauge, Send, Sparkles } from 'lucide-react';
import { arcadeSound } from '../utils/arcadeAudio';

const PLAY_MODES = [
  { id: 'pet', label: 'Cyber-Pet', icon: <Gamepad className="w-4 h-4" />, color: 'from-purple-500 to-indigo-500' },
  { id: 'viz', label: 'Audio Viz', icon: <Music className="w-4 h-4" />, color: 'from-cyan-500 to-blue-500' },
  { id: 'warp', label: '3D Warp', icon: <Rocket className="w-4 h-4" />, color: 'from-amber-500 to-rose-500' },
  { id: 'pong', label: 'Retro Pong', icon: <Sparkles className="w-4 h-4" />, color: 'from-emerald-500 to-teal-500' },
  { id: 'marquee', label: 'VR Streamer', icon: <MessageSquare className="w-4 h-4" />, color: 'from-pink-500 to-purple-500' },
  { id: 'doodle', label: 'Pixel Pad', icon: <Paintbrush className="w-4 h-4" />, color: 'from-violet-500 to-fuchsia-500' },
];

export default function ArcadeControls({
  currentMode,
  onSelectMode,
  speed,
  setSpeed,
  customText,
  setCustomText,
  onPushText,
  isTransmitting,
}) {
  const handleModeChange = (id) => {
    arcadeSound.playCoin();
    onSelectMode(id);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    arcadeSound.playLaser();
    onPushText(customText);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Mode Selector Pills */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300 flex items-center gap-1.5">
          <Gamepad className="w-3.5 h-3.5 text-purple-400" />
          Choose Display Experience
        </label>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PLAY_MODES.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleModeChange(m.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all active:scale-95 gap-1.5 ${
                  isActive
                    ? `bg-gradient-to-b ${m.color} text-slate-950 font-bold border-white/40 shadow-lg shadow-purple-950/40 ring-2 ring-white/50`
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <div className={isActive ? 'text-slate-950' : 'text-slate-400'}>
                  {m.icon}
                </div>
                <span className="text-[11px] font-mono whitespace-nowrap">
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Speed Slider & Quick Text Dispatcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Speed / Beat Tempo Slider */}
        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-purple-300">
              <Gauge className="w-4 h-4 text-purple-400" />
              <span className="font-bold tracking-wider">ANIMATION / WARP SPEED</span>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-700">
              {speed}x
            </span>
          </div>

          <div className="py-2">
            <input
              type="range"
              min="4"
              max="30"
              step="1"
              value={speed}
              onChange={(e) => {
                setSpeed(parseInt(e.target.value, 10));
              }}
              className="w-full accent-purple-500 bg-slate-900 h-2 rounded-lg appearance-none cursor-pointer border border-white/10"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
              <span>Chill Pulse</span>
              <span>Smooth Flow</span>
              <span>Ludicrous Speed 🚀</span>
            </div>
          </div>
        </div>

        {/* Custom Text Streamer Input */}
        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span className="font-bold tracking-wider">CUSTOM OLED STREAMER</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {customText.length} CHARS
            </span>
          </div>

          <form onSubmit={handleTextSubmit} className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value.toUpperCase())}
              placeholder="TYPE A FUN BANNER FOR VR..."
              className="flex-1 bg-black/60 border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 placeholder:text-slate-600 outline-none uppercase tracking-wider transition-colors shadow-inner"
            />
            <button
              type="submit"
              disabled={isTransmitting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-md shadow-cyan-950 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
