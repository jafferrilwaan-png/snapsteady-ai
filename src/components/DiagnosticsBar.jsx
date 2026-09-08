import React, { useState } from 'react';
import { Terminal, Activity, ChevronUp, ChevronDown, Check, Copy, Trash2, Globe, Radio } from 'lucide-react';

export default function DiagnosticsBar({
  targetUrl,
  status, // 'connected' | 'unreachable' | 'transmitting'
  latency,
  lastPayload,
  logs = [],
  onClearLogs,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[${l.time}] ${l.endpoint} -> ${l.status} (${l.latency}ms)`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    if (status === 'transmitting') {
      return {
        text: 'TRANSMITTING',
        dot: 'bg-amber-400 animate-ping',
        classes: 'bg-amber-950/60 border-amber-800 text-amber-300',
      };
    }
    if (status === 'connected') {
      return {
        text: 'ONLINE',
        dot: 'bg-emerald-400',
        classes: 'bg-emerald-950/60 border-emerald-800 text-emerald-300',
      };
    }
    return {
      text: 'OFFLINE / STANDALONE',
      dot: 'bg-rose-500',
      classes: 'bg-rose-950/60 border-rose-800 text-rose-300',
    };
  };

  const badge = getStatusBadge();

  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-white/10 font-mono text-xs">
      {/* Primary Bar Strip */}
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/60 border border-white/10 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${badge.classes}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            <span>{badge.text}</span>
          </div>

          {/* Active Target Endpoint */}
          <div className="flex items-center gap-1.5 text-slate-400 truncate">
            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-500">ENDPOINT:</span>
            <span className="text-cyan-300 font-semibold truncate select-all">{targetUrl}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Latency */}
          {latency !== null && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>{latency}ms</span>
            </div>
          )}

          {/* Quick Payload Inspector Button */}
          <button
            onClick={() => setShowPayloadModal(!showPayloadModal)}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] transition-colors"
          >
            {showPayloadModal ? 'Hide JSON' : 'View Payload'}
          </button>

          {/* Toggle Log History */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] transition-colors"
          >
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>Log ({logs.length})</span>
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* JSON Payload Inspector Drawer */}
      {showPayloadModal && lastPayload && (
        <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 font-mono text-[11px] text-cyan-300 animate-in fade-in">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-cyan-900/40 text-slate-400 text-[10px]">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">
              LAST SENT PAYLOAD (JSON)
            </span>
            <span>POST /api/oled</span>
          </div>
          <pre className="overflow-x-auto text-emerald-400 select-all">
            {JSON.stringify(lastPayload, null, 2)}
          </pre>
        </div>
      )}

      {/* Telemetry History Drawer */}
      {isExpanded && (
        <div className="p-3 rounded-xl bg-slate-950 border border-white/10 flex flex-col gap-2 animate-in fade-in">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-slate-400 text-[11px]">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-cyan-400" /> TRANSMISSION DISPATCH LOG
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLogs}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 text-[10px]"
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
                No transmission events recorded
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between gap-2 py-0.5 px-1.5 rounded hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-500 text-[10px]">{log.time}</span>
                    <span className="text-cyan-400 font-bold">POST</span>
                    <span className="text-slate-300 truncate">{log.endpoint}</span>
                    <span className="text-slate-500 text-[10px]">
                      [scr:{log.payload?.screen} dep:{log.payload?.depth}m]
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-1 rounded text-[10px] font-bold ${
                        log.ok
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="text-slate-500 text-[10px] w-8 text-right">{log.latency}ms</span>
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
