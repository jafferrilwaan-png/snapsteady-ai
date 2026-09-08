import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, Server, Settings2, Code, ShieldCheck, Cpu } from 'lucide-react';

export default function HeaderConfig({
  baseUrl,
  setBaseUrl,
  connectionStatus, // 'connected' | 'unreachable' | 'checking'
  latency,
  onManualPing,
  isSimulation,
  setIsSimulation,
  httpMethod,
  setHttpMethod,
  onOpenCodeModal,
}) {
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(baseUrl);
  const [showSettings, setShowSettings] = useState(false);

  const handleSaveUrl = (e) => {
    e.preventDefault();
    let cleaned = tempUrl.trim();
    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      cleaned = 'http://' + cleaned;
    }
    cleaned = cleaned.replace(/\/+$/, ''); // strip trailing slashes
    setBaseUrl(cleaned);
    setIsEditingUrl(false);
  };

  const getStatusDisplay = () => {
    if (isSimulation) {
      return {
        label: 'Simulation Active',
        dot: 'bg-indigo-400 shadow-[0_0_8px_#818cf8]',
        badge: 'bg-indigo-950/60 border-indigo-700/60 text-indigo-300',
        icon: <Cpu className="w-3.5 h-3.5 text-indigo-400" />,
      };
    }
    if (connectionStatus === 'connected') {
      return {
        label: `Connected (${latency ? `${latency}ms` : 'OK'})`,
        dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse',
        badge: 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300',
        icon: <Wifi className="w-3.5 h-3.5 text-emerald-400" />,
      };
    }
    if (connectionStatus === 'checking') {
      return {
        label: 'Pinging...',
        dot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-ping',
        badge: 'bg-amber-950/60 border-amber-700/60 text-amber-300',
        icon: <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />,
      };
    }
    return {
      label: 'Unreachable',
      dot: 'bg-rose-500 shadow-[0_0_8px_#f43f5e]',
      badge: 'bg-rose-950/60 border-rose-700/60 text-rose-300',
      icon: <WifiOff className="w-3.5 h-3.5 text-rose-400" />,
    };
  };

  const status = getStatusDisplay();

  return (
    <header className="border-b border-slate-800/80 pb-4 mb-5">
      {/* Top title & status bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-inner">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-100 tracking-tight flex items-center gap-1.5 font-sans">
              ESP32 LED Controller
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                v2.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">Microcontroller Remote Interface</p>
          </div>
        </div>

        {/* Live Ping Badge & Tools */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition-all ${status.badge}`}
          >
            <span className={`w-2 h-2 rounded-full ${status.dot}`} />
            <span className="hidden sm:inline font-medium">{status.label}</span>
            <span className="sm:hidden font-medium">
              {isSimulation ? 'Sim' : connectionStatus === 'connected' ? 'Online' : 'Offline'}
            </span>
          </div>

          <button
            onClick={onManualPing}
            title="Ping ESP32 now"
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all text-xs active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Connection Settings"
            className={`p-1.5 rounded-lg border text-xs transition-all active:scale-95 ${
              showSettings
                ? 'bg-cyan-950 border-cyan-700 text-cyan-300'
                : 'bg-slate-800/60 hover:bg-slate-700/80 border-slate-700 text-slate-300'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenCodeModal}
            title="View ESP32 C++ Sketch"
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all text-xs active:scale-95"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editable Base URL bar */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
        <div className="flex-1 flex items-center gap-2 bg-slate-950/80 rounded-lg px-3 py-1.5 border border-slate-800 text-slate-300 font-mono">
          <span className="text-slate-500 select-none">Target:</span>
          {isEditingUrl ? (
            <form onSubmit={handleSaveUrl} className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                autoFocus
                placeholder="http://172.21.169.16"
                className="flex-1 bg-transparent text-cyan-300 outline-none font-mono text-xs"
              />
              <button
                type="submit"
                className="px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-[11px]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempUrl(baseUrl);
                  setIsEditingUrl(false);
                }}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px]"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex-1 flex items-center justify-between group">
              <span className="text-cyan-400 select-all font-medium">{baseUrl}</span>
              <button
                onClick={() => {
                  setTempUrl(baseUrl);
                  setIsEditingUrl(true);
                }}
                className="text-[11px] text-slate-400 hover:text-cyan-300 underline underline-offset-2 opacity-80 group-hover:opacity-100 transition-opacity"
              >
                Edit URL
              </button>
            </div>
          )}
        </div>

        {/* Quick Simulation Mode toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label className="flex items-center gap-2 cursor-pointer select-none px-2 py-1 rounded bg-slate-900/60 border border-slate-800/80 text-slate-300 text-xs">
            <input
              type="checkbox"
              checked={isSimulation}
              onChange={(e) => setIsSimulation(e.target.checked)}
              className="accent-indigo-500 rounded cursor-pointer w-3.5 h-3.5"
            />
            <span className={isSimulation ? 'text-indigo-400 font-semibold' : 'text-slate-400'}>
              Simulation Mode
            </span>
          </label>
        </div>
      </div>

      {/* Expandable Advanced Connection Settings Panel */}
      {showSettings && (
        <div className="mt-3 p-3 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-col gap-2.5 text-xs text-slate-300 font-sans animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> HTTP Protocol Configuration
            </span>
            <button
              onClick={() => {
                setBaseUrl('http://172.21.169.16');
                setTempUrl('http://172.21.169.16');
              }}
              className="text-[11px] text-slate-400 hover:text-cyan-400"
            >
              Reset Default URL
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1 font-mono">
                HTTP Request Method:
              </label>
              <div className="flex rounded-md bg-slate-900 p-0.5 border border-slate-800">
                {['GET', 'POST'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setHttpMethod(method)}
                    className={`flex-1 py-1 rounded text-xs font-mono font-medium transition-all ${
                      httpMethod === method
                        ? 'bg-cyan-600 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Endpoints: <code className="text-slate-400">{httpMethod} {baseUrl}/led/on</code>
              </p>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1 font-mono">
                Connection Behavior:
              </label>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Sends lightweight fetch requests with timeout detection and automatic fallback. When using ESP32 AsyncWebServer, ensure CORS headers are enabled if accessing across origins.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
