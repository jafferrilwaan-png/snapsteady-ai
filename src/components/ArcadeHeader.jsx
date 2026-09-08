import React, { useState } from 'react';
import { Gamepad2, Volume2, VolumeX, RefreshCw, Cpu, Globe, Check, Edit3, Sparkles } from 'lucide-react';
import { arcadeSound } from '../utils/arcadeAudio';

export default function ArcadeHeader({
  targetIp,
  setTargetIp,
  connectionStatus,
  isSimulation,
  setIsSimulation,
  audioEnabled,
  setAudioEnabled,
  onSync,
  onOpenCodeModal,
}) {
  const [isEditingIp, setIsEditingIp] = useState(false);
  const [tempIp, setTempIp] = useState(targetIp);

  const handleSaveIp = (e) => {
    e.preventDefault();
    let cleaned = tempIp.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    setTargetIp(cleaned);
    setIsEditingIp(false);
    arcadeSound.playCoin();
  };

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    arcadeSound.enabled = next;
    if (next) arcadeSound.playCoin();
  };

  return (
    <header className="flex flex-col gap-3 pb-4 border-b border-white/10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Playful Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-[2px] shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-300">
              <Gamepad2 className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-wider uppercase font-sans text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-300">
                VR COMPANION OLED DECK
              </h1>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-700">
                🎮 PLAY
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Interactive Hardware OLED Display Station for Laptop & VR
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-2">
          {/* Sound FX Toggle */}
          <button
            onClick={toggleAudio}
            title={audioEnabled ? 'Mute 8-bit Audio' : 'Enable 8-bit Audio'}
            className={`p-2 rounded-xl border text-xs transition-all active:scale-95 ${
              audioEnabled
                ? 'bg-purple-950/80 border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-white/5 border-white/10 text-slate-500'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Sync Button */}
          <button
            onClick={() => {
              arcadeSound.playLaser();
              onSync();
            }}
            title="Sync Display"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">SYNC</span>
          </button>

          {/* Firmware Sketch Button */}
          <button
            onClick={() => {
              arcadeSound.playCoin();
              onOpenCodeModal();
            }}
            title="View ESP32 OLED Arduino Code"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs transition-all active:scale-95"
          >
            <Cpu className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>

      {/* Secondary Bar: IP Address & Simulation Toggle */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-white/5 text-xs font-mono">
        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
          <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-slate-500">ESP32 IP:</span>
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
                className="p-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950"
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
                title="Edit IP"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Simulation Standalone Mode */}
        <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono">
          <input
            type="checkbox"
            checked={isSimulation}
            onChange={(e) => {
              arcadeSound.playBlip();
              setIsSimulation(e.target.checked);
            }}
            className="accent-purple-500 rounded cursor-pointer w-3.5 h-3.5"
          />
          <span className={isSimulation ? 'text-purple-400 font-semibold' : 'text-slate-400'}>
            Simulation Standalone Mode
          </span>
        </label>
      </div>
    </header>
  );
}
