import React from 'react';
import { Power, Activity } from 'lucide-react';

const LED_THEMES = {
  cyan: {
    name: 'Electric Cyan',
    activeGlow: 'shadow-[0_0_50px_15px_rgba(6,182,212,0.6),inset_0_0_20px_rgba(255,255,255,0.8)]',
    outerRing: 'border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.3)]',
    bgOn: 'bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-600',
    dotGlow: 'bg-cyan-400 shadow-[0_0_12px_#22d3ee]',
    ambientRays: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
    textColor: 'text-cyan-400',
  },
  blue: {
    name: 'ESP32 Blue (GPIO2)',
    activeGlow: 'shadow-[0_0_50px_15px_rgba(59,130,246,0.65),inset_0_0_20px_rgba(255,255,255,0.8)]',
    outerRing: 'border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.35)]',
    bgOn: 'bg-gradient-to-br from-blue-300 via-blue-500 to-indigo-600',
    dotGlow: 'bg-blue-400 shadow-[0_0_12px_#60a5fa]',
    ambientRays: 'from-blue-500/20 via-blue-500/5 to-transparent',
    textColor: 'text-blue-400',
  },
  emerald: {
    name: 'Emerald Green',
    activeGlow: 'shadow-[0_0_50px_15px_rgba(16,185,129,0.6),inset_0_0_20px_rgba(255,255,255,0.8)]',
    outerRing: 'border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.3)]',
    bgOn: 'bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-600',
    dotGlow: 'bg-emerald-400 shadow-[0_0_12px_#34d399]',
    ambientRays: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    textColor: 'text-emerald-400',
  },
  amber: {
    name: 'Amber Gold',
    activeGlow: 'shadow-[0_0_50px_15px_rgba(245,158,11,0.6),inset_0_0_20px_rgba(255,255,255,0.8)]',
    outerRing: 'border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.3)]',
    bgOn: 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600',
    dotGlow: 'bg-amber-400 shadow-[0_0_12px_#fbbf24]',
    ambientRays: 'from-amber-500/20 via-amber-500/5 to-transparent',
    textColor: 'text-amber-400',
  },
  ruby: {
    name: 'Cyber Ruby',
    activeGlow: 'shadow-[0_0_50px_15px_rgba(244,63,94,0.65),inset_0_0_20px_rgba(255,255,255,0.8)]',
    outerRing: 'border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.3)]',
    bgOn: 'bg-gradient-to-br from-rose-300 via-rose-500 to-rose-700',
    dotGlow: 'bg-rose-400 shadow-[0_0_12px_#fb7185]',
    ambientRays: 'from-rose-500/20 via-rose-500/5 to-transparent',
    textColor: 'text-rose-400',
  },
};

export default function VirtualLed({ isOn, activeMode, activeTheme = 'blue', onThemeChange }) {
  const theme = LED_THEMES[activeTheme] || LED_THEMES.blue;

  return (
    <div className="relative flex flex-col items-center justify-center py-6 select-none">
      {/* Ambient background glow when ON */}
      <div
        className={`absolute w-72 h-72 rounded-full bg-radial transition-all duration-300 pointer-events-none ${
          isOn
            ? `bg-gradient-to-r ${theme.ambientRays} opacity-100 scale-110 blur-2xl`
            : 'opacity-0 scale-90 blur-xl'
        }`}
      />

      {/* Outer Housing Ring */}
      <div className="relative flex items-center justify-center">
        {/* Animated pulse ring if in a blink pattern and ON */}
        {isOn && activeMode !== 'none' && (
          <div
            className={`absolute -inset-4 rounded-full border-2 border-dashed ${theme.outerRing} animate-spin`}
            style={{ animationDuration: '6s' }}
          />
        )}

        {/* Bezel Ring */}
        <div
          className={`w-40 h-40 md:w-44 md:h-44 rounded-full p-[6px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-2xl transition-all duration-300 flex items-center justify-center ${
            isOn ? theme.outerRing : 'border border-slate-800/80 shadow-black/80'
          }`}
        >
          {/* Inner metallic bezel */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-slate-950 to-black p-3.5 flex items-center justify-center relative overflow-hidden border border-slate-800/40">
            {/* LED Glass Refraction Highlight */}
            <div className="absolute top-2 left-3 w-10 h-5 bg-white/10 rounded-full blur-[1px] rotate-[-30deg] pointer-events-none" />

            {/* Virtual LED Core Diode */}
            <div
              className={`w-24 h-24 md:w-28 md:h-28 rounded-full transition-all duration-150 relative flex items-center justify-center ${
                isOn
                  ? `${theme.bgOn} ${theme.activeGlow} scale-100`
                  : 'bg-slate-900/90 shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] border border-slate-800/60 scale-95'
              }`}
            >
              {/* Internal micro-chip diode lines */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 ${
                  isOn ? 'bg-white/40 shadow-[0_0_15px_#ffffff]' : 'bg-slate-800/60 opacity-40'
                }`}
              >
                <Power
                  className={`w-6 h-6 transition-all duration-200 ${
                    isOn ? 'text-slate-950 scale-110 drop-shadow' : 'text-slate-600 scale-95'
                  }`}
                  strokeWidth={2.5}
                />
              </div>

              {/* Specular highlight */}
              <div
                className={`absolute top-2 right-4 w-4 h-2.5 rounded-full rotate-45 pointer-events-none transition-opacity duration-200 ${
                  isOn ? 'bg-white/70 blur-[0.5px]' : 'bg-white/10'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* State Badge & Mode info */}
      <div className="mt-4 flex flex-col items-center gap-1.5 z-10">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              isOn ? theme.dotGlow : 'bg-slate-700'
            }`}
          />
          <span className="text-sm font-semibold tracking-wider uppercase text-slate-300 font-mono">
            {isOn ? 'STATE: HIGH (ON)' : 'STATE: LOW (OFF)'}
          </span>
        </div>

        {activeMode !== 'none' && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-cyan-300">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>Active: {activeMode.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Subtle LED Theme Switcher */}
      <div className="mt-3 flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-full border border-slate-800/80">
        {Object.entries(LED_THEMES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => onThemeChange(key)}
            title={t.name}
            className={`w-4 h-4 rounded-full transition-all ${
              activeTheme === key
                ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                : 'opacity-50 hover:opacity-100'
            } ${
              key === 'blue'
                ? 'bg-blue-500'
                : key === 'cyan'
                ? 'bg-cyan-400'
                : key === 'emerald'
                ? 'bg-emerald-400'
                : key === 'amber'
                ? 'bg-amber-400'
                : 'bg-rose-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
export { LED_THEMES };
