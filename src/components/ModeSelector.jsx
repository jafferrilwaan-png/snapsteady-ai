import React from 'react';
import { LayoutGrid, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

export default function ModeSelector({ currentScreen, onSelectScreen, isTransmitting }) {
  const modes = [
    {
      id: 0,
      label: 'HUD OVERVIEW',
      code: 'SCREEN // 00',
      description: 'Tactical Reticle & Depth Grid',
      icon: <LayoutGrid className="w-4 h-4" />,
      themeColor: 'cyan',
      activeStyles:
        'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50',
      badgeClass: 'bg-cyan-900/60 text-cyan-300 border-cyan-700',
    },
    {
      id: 1,
      label: 'BIO-WAVEFORM',
      code: 'SCREEN // 01',
      description: 'ECG Bio-Rhythm & Respiration',
      icon: <Activity className="w-4 h-4" />,
      themeColor: 'emerald',
      activeStyles:
        'border-emerald-400 bg-emerald-950/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50',
      badgeClass: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
    },
    {
      id: 2,
      label: 'LOCKDOWN ALERT',
      code: 'SCREEN // 02',
      description: 'High-Contrast Combat Breach',
      icon: <AlertTriangle className="w-4 h-4" />,
      themeColor: 'rose',
      activeStyles:
        'border-rose-500 bg-rose-950/40 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/50 animate-pulse',
      badgeClass: 'bg-rose-900/60 text-rose-300 border-rose-700',
    },
  ];

  const handleSelect = (id) => {
    if (id === 2) {
      sound.playAlarm();
    } else {
      sound.playModeSwitch();
    }
    onSelectScreen(id);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-sm bg-cyan-400" />
          Tactical Screen Selector
        </label>
        <span className="text-[10px] font-mono text-slate-500 uppercase">
          POST /api/oled &#8250; "screen": {currentScreen}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {modes.map((m) => {
          const isActive = currentScreen === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSelect(m.id)}
              disabled={isTransmitting && isActive}
              className={`relative p-3.5 rounded-xl border text-left transition-all duration-200 group active:scale-98 overflow-hidden ${
                isActive
                  ? m.activeStyles
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Corner Sci-Fi Decal */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 pointer-events-none" />

              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isActive
                      ? m.badgeClass
                      : 'bg-slate-900/80 border-white/5 text-slate-400 group-hover:text-white'
                  }`}
                >
                  {m.icon}
                </div>
                <span className="text-[10px] font-mono tracking-wider font-semibold opacity-80">
                  {m.code}
                </span>
              </div>

              <div className="text-sm font-bold tracking-wide font-sans text-slate-100 group-hover:text-white">
                {m.label}
              </div>

              <div className="text-[11px] font-mono text-slate-400 mt-0.5 line-clamp-1">
                {m.description}
              </div>

              {/* Active Indicator Strip */}
              {isActive && (
                <div className="mt-2.5 pt-1.5 border-t border-current/20 flex items-center justify-between text-[10px] font-mono">
                  <span className="flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                    TRANSMITTED ACTIVE
                  </span>
                  <span>SYS_OK</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
