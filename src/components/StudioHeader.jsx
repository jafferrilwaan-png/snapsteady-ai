import React, { useState } from 'react';
import { Cpu, Volume2, VolumeX, RefreshCw, Globe, Check, Edit3, Code2, Wifi, WifiOff } from 'lucide-react';
import { arcadeSound } from '../utils/arcadeAudio';

export default function StudioHeader({
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
    <header className="flex items-center justify-between gap-4 py-3.5 px-6 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md rounded-2xl">
      {/* Device Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shadow-sm">
          <Cpu className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-zinc-100 font-sans">
              OLED Studio Control
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              ESP32 &bull; SSD1306
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : connectionStatus === 'transmitting'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-rose-500'
              }`}
            />
            <span>
              {isSimulation
                ? 'Simulation Mode'
                : connectionStatus === 'connected'
                ? 'Node Online'
                : 'Offline / Standalone'}
            </span>
          </div>
        </div>
      </div>

      {/* Target IP Pill & Quick Actions */}
      <div className="flex items-center gap-2.5">
        {/* IP Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-zinc-900/90 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs font-mono">
          <Globe className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="text-zinc-500">IP:</span>
          {isEditingIp ? (
            <form onSubmit={handleSaveIp} className="flex items-center gap-1">
              <input
                type="text"
                value={tempIp}
                onChange={(e) => setTempIp(e.target.value)}
                autoFocus
                placeholder="172.21.169.16"
                className="bg-transparent text-amber-300 outline-none font-mono text-xs w-32"
              />
              <button
                type="submit"
                className="p-0.5 rounded hover:bg-zinc-800 text-emerald-400"
              >
                <Check className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-200 font-medium select-all">{targetIp}</span>
              <button
                onClick={() => {
                  setTempIp(targetIp);
                  setIsEditingIp(true);
                }}
                className="text-zinc-500 hover:text-zinc-200 transition-colors"
                title="Edit IP"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Sync Button */}
        <button
          onClick={() => {
            arcadeSound.playBlip();
            onSync();
          }}
          title="Sync Device State"
          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          title={audioEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
          className={`p-2 rounded-xl border text-xs transition-all active:scale-95 ${
            audioEnabled
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm'
              : 'bg-zinc-900 border-zinc-800 text-zinc-500'
          }`}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Firmware Sketch Button */}
        <button
          onClick={() => {
            arcadeSound.playCoin();
            onOpenCodeModal();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-medium transition-all active:scale-95"
        >
          <Code2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Firmware</span>
        </button>
      </div>
    </header>
  );
}
