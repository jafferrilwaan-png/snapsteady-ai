import React, { useState } from 'react';
import { Terminal, Activity, ChevronUp, ChevronDown, Check, Copy, Trash2, Globe, Radio } from 'lucide-react';

export default function ArcadeDiagnostics({
  targetUrl,
  status,
  latency,
  lastPayload,
  logs = [],
  onClearLogs,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[${l.time}] ${l.status} (${l.latency}ms) -> ${JSON.stringify(l.payload || {})}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-white/10 font-mono text-xs">
      {/* Primary Bar */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-black/60 border border-white/10 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-[11px] font-bold">
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'transmitting'
                  ? 'bg-amber-400 animate-ping'
                  : status === 'connected'
                  ? 'bg-emerald-400'
                  : 'bg-rose-500'
              }`}
            />
            <span>
              {status === 'transmitting'
                ? 'BEAMING...'
                : status === 'connected'
                ? 'OLED READY'
                : 'STANDALONE / SIM'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 truncate">
            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-cyan-300 font-semibold truncate select-all">{targetUrl}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {latency !== null && (
            <div className="flex items-center gap-1 text-[11px] text-slate-300 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>{latency}ms</span>
            </div>
          )}

          <button
            onClick={() => setShowJson(!showJson)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] transition-colors"
          >
            {showJson ? 'Hide JSON' : 'Inspect JSON'}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] transition-colors"
          >
            <Terminal className="w-3 h-3 text-purple-400" />
            <span>Events ({logs.length})</span>
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* JSON Payload Viewer */}
      {showJson && lastPayload && (
        <div className="p-3.5 rounded-2xl bg-slate-950/95 border border-purple-500/30 text-[11px] text-purple-300 animate-in fade-in">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-purple-900/40 text-slate-400 text-[10px]">
            <span className="text-purple-400 font-bold uppercase tracking-wider">
              LAST SENT TO OLED
            </span>
            <span>POST /api/oled</span>
          </div>
          <pre className="overflow-x-auto text-emerald-400 select-all font-mono">
            {JSON.stringify(lastPayload, null, 2)}
          </pre>
        </div>
      )}

      {/* History Log */}
      {isExpanded && (
        <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 flex flex-col gap-2 animate-in fade-in">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-slate-400 text-[11px]">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-purple-400" /> TRANSMISSION LOG
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLogs}
                className="flex items-center gap-1 text-slate-400 hover:text-purple-300 text-[10px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={onClearLogs}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-400 text-[10px]"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="max-h-36 overflow-y-auto flex flex-col gap-1 pr-1 text-[11px]">
            {logs.length === 0 ? (
              <div className="text-slate-600 text-center py-2 italic">
                Ready for interaction! Click a mode or sound above.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between gap-2 py-0.5 px-2 rounded hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-500 text-[10px]">{log.time}</span>
                    <span className="text-purple-400 font-bold">{log.mode}</span>
                    <span className="text-slate-300 truncate">"{log.text}"</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        log.ok
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="text-slate-500 text-[10px]">{log.latency}ms</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
