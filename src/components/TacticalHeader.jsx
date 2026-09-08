import React, { useState } from 'react';
import { Shield, Volume2, VolumeX, RefreshCw, Cpu, Wifi, WifiOff, Globe, Edit3, Check } from 'lucide-react';
import { sound } from '../utils/audio';

export default function TacticalHeader({
  targetIp,
  setTargetIp,
  connectionStatus, // 'connected' | 'unreachable' | 'transmitting'
  isSimulation,
  setIsSimulation,
  audioEnabled,
  setAudioEnabled,
  onSyncNode,
  onOpenCodeModal,
}) {
  const [isEditingIp, setIsEditingIp] = useState(false);
  const [tempIp, setTempIp] = useState(targetIp);

  const handleSaveIp = (e) => {
    e.preventDefault();
    let cleaned = tempIp.trim();
    // remove http:// or trailing slashes if entered
    cleaned = cleaned.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    setTargetIp(cleaned);
    setIsEditingIp(false);
    sound.playClick();
  };

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  };

  return (
    <header className="flex flex-col gap-3 pb-4 border-b border-white/10">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Node Identification */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-widest uppercase font-sans text-white">
                A.U.R.A. TACTICAL NODE-01
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                MK-IV
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 tracking-wider">
              TACTICAL OLED REST HUD COMMAND MATRIX
            </p>
          </div>
        </div>

        {/* Global Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Audio Feedback Toggle */}
          <button
            onClick={toggleAudio}
            title={audioEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
            className={`p-2 rounded-xl border text-xs transition-all active:scale-95 ${
              audioEnabled
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-500'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Sync Node Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onSyncNode();
            }}
            title="Sync Node & Re-ping"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">SYNC NODE</span>
          </button>

          {/* Firmware Code Modal */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCodeModal();
            }}
            title="View ESP32 Firmware Sketch"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs transition-all active:scale-95"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Sub Bar: Editable Target Node IP & Simulation Switch */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-white/5 text-xs font-mono">
        {/* Editable IP Bar */}
        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
          <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-slate-500 uppercase tracking-tight">TARGET NODE:</span>
          {isEditingIp ? (
            <form onSubmit={handleSaveIp} className="flex items-center gap-1.5">
              <input
                type="text"
                value={tempIp}
                onChange={(e) => setTempIp(e.target.value)}
                autoFocus
                placeholder="172.21.169.16"
                className="bg-transparent text-cyan-300 outline-none font-mono text-xs w-36"
              />
              <button
                type="submit"
                className="p-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950"
              >
                <Check className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-cyan-300 font-bold select-all">{targetIp}</span>
              <button
                onClick={() => {
                  setTempIp(targetIp);
                  setIsEditingIp(true);
                }}
                className="text-slate-500 hover:text-cyan-300 transition-colors"
                title="Edit Target IP"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Simulation Mode Switch */}
        <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono">
          <input
            type="checkbox"
            checked={isSimulation}
            onChange={(e) => {
              sound.playClick();
              setIsSimulation(e.target.checked);
            }}
            className="accent-indigo-500 rounded cursor-pointer w-3.5 h-3.5"
          />
          <span className={isSimulation ? 'text-indigo-400 font-semibold' : 'text-slate-400'}>
            Simulation Standalone Mode
          </span>
        </label>
      </div>
    </header>
  );
}
