import React, { useState } from 'react';
import { Globe, Activity, Check, Copy, Terminal, Shield, RefreshCw, Cpu, Code2 } from 'lucide-react';
import { arcadeSound } from '../../utils/arcadeAudio';

export default function SettingsTab({
  targetIp,
  setTargetIp,
  isSimulation,
  setIsSimulation,
  connectionStatus,
  latency,
  lastPayload,
  onSync,
  onOpenCodeModal,
}) {
  const [tempIp, setTempIp] = useState(targetIp);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleSaveIp = (e) => {
    e.preventDefault();
    let cleaned = tempIp.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    setTargetIp(cleaned);
    arcadeSound.playCoin();
  };

  const handleCopyPayload = () => {
    if (!lastPayload) return;
    navigator.clipboard.writeText(JSON.stringify(lastPayload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-200">
      <div>
        <h2 className="text-sm font-semibold text-zinc-100 font-sans">
          Hardware Configuration & Telemetry
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Configure the local IP network connection to your ESP32 board and inspect live JSON transmissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Node IP & Connection Settings */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                Target Node IP
              </span>
              <span className="text-[11px] font-mono text-zinc-500">PORT 80</span>
            </div>

            <form onSubmit={handleSaveIp} className="flex items-center gap-2">
              <input
                type="text"
                value={tempIp}
                onChange={(e) => setTempIp(e.target.value)}
                placeholder="172.21.169.16"
                className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
              >
                Save
              </button>
            </form>
            <p className="text-[11px] font-mono text-zinc-500 mt-1.5">
              Target: <code className="text-zinc-400">http://{targetIp}/api/oled</code>
            </p>
          </div>

          {/* Simulation Toggle */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-200 font-sans">
                Simulation Standalone Mode
              </span>
              <span className="text-[11px] text-zinc-500 font-sans">
                Test animations without physical hardware
              </span>
            </div>

            <input
              type="checkbox"
              checked={isSimulation}
              onChange={(e) => {
                arcadeSound.playBlip();
                setIsSimulation(e.target.checked);
              }}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Live Network Health Status */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Connection Health
              </span>
              <button
                onClick={() => {
                  arcadeSound.playBlip();
                  onSync();
                }}
                className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-ping</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block">STATUS</span>
                <span className="font-bold text-zinc-200 mt-0.5 block">
                  {isSimulation ? 'SIMULATION' : connectionStatus.toUpperCase()}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block">LATENCY</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">
                  {latency !== null ? `${latency} ms` : '--'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-sans">ESP32 Arduino Sketch:</span>
            <button
              onClick={() => {
                arcadeSound.playCoin();
                onOpenCodeModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Sketch Modal</span>
            </button>
          </div>
        </div>
      </div>

      {/* JSON Payload Inspector */}
      {lastPayload && (
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-1 border-b border-zinc-800">
            <span className="flex items-center gap-1.5 text-zinc-300 font-semibold">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              LAST SENT JSON PAYLOAD (POST /api/oled)
            </span>
            <button
              onClick={handleCopyPayload}
              className="flex items-center gap-1 text-zinc-400 hover:text-amber-300 transition-colors"
            >
              {copiedPayload ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPayload ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-2 bg-black/60 rounded-xl select-all">
            {JSON.stringify(lastPayload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
