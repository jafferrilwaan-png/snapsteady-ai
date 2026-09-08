import React, { useState } from 'react';
import { Zap, Radio, AlertOctagon, Sliders, Square, Play, Sparkles } from 'lucide-react';

export default function BlinkPresets({
  activeMode, // 'none' | 'strobe' | 'beacon' | 'sos' | 'custom'
  onStartPreset, // (modeName) => void
  onStopPattern,
  customInterval,
  setCustomInterval,
  sosStepIndex, // 0..8 or -1
}) {
  const [sliderVal, setSliderVal] = useState(customInterval || 500);

  const presets = [
    {
      id: 'strobe',
      name: 'Quick Pulse',
      subtitle: '200ms Strobe',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      tag: '200ms',
      color: 'hover:border-amber-500/50 hover:bg-amber-950/20',
      activeClass: 'border-amber-500/80 bg-amber-950/40 text-amber-300 ring-1 ring-amber-500/50',
    },
    {
      id: 'beacon',
      name: 'Slow Beacon',
      subtitle: '1000ms Interval',
      icon: <Radio className="w-4 h-4 text-cyan-400" />,
      tag: '1000ms',
      color: 'hover:border-cyan-500/50 hover:bg-cyan-950/20',
      activeClass: 'border-cyan-500/80 bg-cyan-950/40 text-cyan-300 ring-1 ring-cyan-500/50',
    },
    {
      id: 'sos',
      name: 'SOS Pattern',
      subtitle: 'Morse: · · · — — — · · ·',
      icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
      tag: 'Morse',
      color: 'hover:border-rose-500/50 hover:bg-rose-950/20',
      activeClass: 'border-rose-500/80 bg-rose-950/40 text-rose-300 ring-1 ring-rose-500/50',
    },
  ];

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setSliderVal(val);
    setCustomInterval(val);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Blink Modes & Presets
        </h2>

        {activeMode !== 'none' && (
          <button
            onClick={onStopPattern}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 text-xs font-mono font-medium transition-all active:scale-95 shadow-sm"
          >
            <Square className="w-3 h-3 fill-current text-rose-400" />
            Stop Pattern
          </button>
        )}
      </div>

      {/* 3 Preset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {presets.map((p) => {
          const isActive = activeMode === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                if (isActive) {
                  onStopPattern();
                } else {
                  onStartPreset(p.id);
                }
              }}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all relative overflow-hidden group active:scale-98 ${
                isActive
                  ? p.activeClass
                  : `bg-slate-900/60 border-slate-800 text-slate-300 ${p.color}`
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  {p.icon}
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-400 border border-slate-800">
                  {p.tag}
                </span>
              </div>

              <div className="font-semibold text-sm text-slate-100 group-hover:text-white">
                {p.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono truncate w-full">
                {p.subtitle}
              </div>

              {/* Active Pulsing Indicator */}
              {isActive && (
                <div className="mt-2 w-full flex items-center justify-between pt-1.5 border-t border-slate-700/40 text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Running
                  </span>
                  <span className="text-slate-400">Click to stop</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Morse SOS Sequence Visualizer when SOS is active */}
      {activeMode === 'sos' && (
        <div className="p-3 rounded-lg bg-slate-950/90 border border-rose-900/40 flex flex-col items-center gap-2 animate-in fade-in">
          <div className="text-[11px] font-mono text-rose-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Morse SOS Sequence (S: · · · &nbsp; O: — — — &nbsp; S: · · ·)
          </div>
          <div className="flex items-center gap-1.5 text-base font-mono">
            {['·', '·', '·', '—', '—', '—', '·', '·', '·'].map((char, i) => (
              <span
                key={i}
                className={`w-6 h-6 rounded flex items-center justify-center font-bold transition-all ${
                  sosStepIndex === i
                    ? 'bg-rose-500 text-slate-950 shadow-[0_0_10px_#f43f5e] scale-110'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Interval Slider Card */}
      <div
        className={`p-3.5 rounded-xl border transition-all ${
          activeMode === 'custom'
            ? 'border-indigo-500/80 bg-indigo-950/30 ring-1 ring-indigo-500/40'
            : 'bg-slate-900/50 border-slate-800/80'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-slate-950 border border-slate-800 text-indigo-400">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Custom Blink Interval</span>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-300 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
            {sliderVal} ms
          </span>
        </div>

        {/* Range Slider */}
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[10px] font-mono text-slate-500">100ms</span>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={sliderVal}
            onChange={handleSliderChange}
            className="flex-1 accent-indigo-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer border border-slate-800"
          />
          <span className="text-[10px] font-mono text-slate-500">2000ms</span>
        </div>

        {/* Start / Stop Custom Blink Button */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/50">
          <div className="text-[11px] text-slate-400 font-mono">
            {activeMode === 'custom' ? (
              <span className="text-indigo-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                Custom interval running ({sliderVal}ms)
              </span>
            ) : (
              <span>Fine-tune toggle speed</span>
            )}
          </div>

          <button
            onClick={() => {
              if (activeMode === 'custom') {
                onStopPattern();
              } else {
                onStartPreset('custom');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all active:scale-95 ${
              activeMode === 'custom'
                ? 'bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950'
            }`}
          >
            {activeMode === 'custom' ? (
              <>
                <Square className="w-3 h-3 fill-current text-rose-300" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                Start Custom Blink
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
