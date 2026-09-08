import React, { useState } from 'react';
import { Terminal, CheckCircle2, AlertTriangle, ChevronUp, ChevronDown, Trash2, Copy, Check } from 'lucide-react';

export default function RequestToast({ logs = [], lastLog = null, onClearLogs }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[${l.time}] ${l.method} ${l.url} -> ${l.status} (${l.latency}ms) ${l.msg || ''}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-5 border-t border-slate-800/80 pt-3">
      {/* Active Single-Line Toast / Status Strip */}
      <div className="flex items-center justify-between gap-2 p-2 px-3 rounded-lg bg-slate-950/90 border border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          {lastLog ? (
            lastLog.ok ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )
          ) : (
            <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          )}

          <div className="truncate text-slate-300">
            {lastLog ? (
              <span>
                <span className="text-cyan-400 font-semibold">{lastLog.method}</span>{' '}
                <span className="text-slate-300">{lastLog.endpoint}</span>{' '}
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] ${
                    lastLog.ok ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                  }`}
                >
                  [{lastLog.status}]
                </span>{' '}
                <span className="text-slate-500 text-[11px]">{lastLog.latency}ms</span>
              </span>
            ) : (
              <span className="text-slate-500">Ready for commands. Idle.</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] border border-slate-800 transition-colors"
          >
            <span>Log ({logs.length})</span>
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expandable Terminal Log History */}
      {isExpanded && (
        <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] flex flex-col gap-1.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-slate-400 text-[10px]">
            <span className="flex items-center gap-1 font-semibold uppercase text-slate-300">
              <Terminal className="w-3 h-3 text-cyan-400" /> HTTP Request Telemetry
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLogs}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
                title="Copy all logs"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={onClearLogs}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
                title="Clear logs"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="max-h-36 overflow-y-auto flex flex-col gap-1 pr-1">
            {logs.length === 0 ? (
              <div className="text-slate-600 text-center py-2 italic text-[11px]">
                No request history yet
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between gap-2 py-0.5 px-1.5 rounded hover:bg-slate-900/80 transition-colors text-[11px]"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-slate-500 text-[10px] shrink-0">{log.time}</span>
                    <span className="text-cyan-400 font-semibold shrink-0">{log.method}</span>
                    <span className="text-slate-300 truncate">{log.endpoint}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`px-1 rounded text-[10px] font-bold ${
                        log.ok
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                          : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="text-slate-500 text-[10px] w-10 text-right">{log.latency}ms</span>
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
