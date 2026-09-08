import React from 'react';
import { Crosshair, HeartPulse, Gauge, ShieldAlert, Zap, RefreshCw } from 'lucide-react';
import { sound } from '../utils/audio';

export default function TacticalControls({
  depth,
  setDepth,
  bpm,
  setBpm,
  confidence,
  setConfidence,
  onTriggerLockdown,
  onTriggerBioScan,
  onResetNominal,
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* 3 Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. Target Depth Slider */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <Crosshair className="w-3.5 h-3.5" />
              <span className="font-semibold tracking-wider">TARGET DEPTH</span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300">
              {depth.toFixed(1)} m
            </span>
          </div>

          <div className="py-2">
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.1"
              value={depth}
              onChange={(e) => {
                sound.playClick();
                setDepth(parseFloat(e.target.value));
              }}
              className="w-full accent-cyan-400 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer border border-white/10"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0.5m</span>
              <span>Sub-Surface Range</span>
              <span>8.0m</span>
            </div>
          </div>
        </div>

        {/* 2. Bio-Pulse Respiration Slider */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <HeartPulse className="w-3.5 h-3.5" />
              <span className="font-semibold tracking-wider">BIO-RESPIRATION</span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300">
              {bpm} BPM
            </span>
          </div>

          <div className="py-2">
            <input
              type="range"
              min="8"
              max="32"
              step="1"
              value={bpm}
              onChange={(e) => {
                sound.playClick();
                setBpm(parseInt(e.target.value, 10));
              }}
              className="w-full accent-emerald-400 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer border border-white/10"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>8 BPM</span>
              <span>Vitals Frequency</span>
              <span>32 BPM</span>
            </div>
          </div>
        </div>

        {/* 3. Target Confidence Matrix Slider */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
              <Gauge className="w-3.5 h-3.5" />
              <span className="font-semibold tracking-wider">CONFIDENCE MATRIX</span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700/60 text-amber-300">
              {confidence}%
            </span>
          </div>

          <div className="py-2">
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={confidence}
              onChange={(e) => {
                sound.playClick();
                setConfidence(parseInt(e.target.value, 10));
              }}
              className="w-full accent-amber-400 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer border border-white/10"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>10% Low</span>
              <span>Target Probability</span>
              <span>100% Lock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Mission Action Triggers */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Quick Mission Action Triggers
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Trigger 1: Lockdown */}
          <button
            onClick={() => {
              sound.playAlarm();
              onTriggerLockdown();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-900/60 to-red-950/80 hover:from-rose-800/80 hover:to-red-900/90 border border-rose-600/60 hover:border-rose-500 text-rose-200 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-97 shadow-lg shadow-rose-950/40"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Trigger Lockdown</span>
          </button>

          {/* Trigger 2: Bio Scan */}
          <button
            onClick={() => {
              sound.playModeSwitch();
              onTriggerBioScan();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-teal-950/80 hover:from-emerald-900/80 hover:to-teal-900/90 border border-emerald-600/60 hover:border-emerald-500 text-emerald-200 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-97 shadow-lg shadow-emerald-950/40"
          >
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <span>Bio-Pulse Scan</span>
          </button>

          {/* Trigger 3: Reset Nominal */}
          <button
            onClick={() => {
              sound.playClick();
              onResetNominal();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-mono font-semibold text-xs uppercase tracking-wider transition-all duration-150 active:scale-97"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Nominal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
