import React, { useRef, useEffect } from 'react';
import { LogMessage } from '../types/game';
import { Scroll, Terminal } from 'lucide-react';

interface LogPanelProps {
  logs: LogMessage[];
  onClearLogs?: () => void;
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="h-32 md:h-36 bg-[#0a121b] border-t-2 border-[#c5a059]/40 flex flex-col overflow-hidden select-none">
      {/* Header */}
      <div className="px-3 py-1 bg-[#101924] border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Scroll className="w-3.5 h-3.5 text-[#f4d06f]" />
          <span className="font-cinzel text-amber-200/80 font-bold uppercase tracking-wider">
            航海日誌 (Ship's Chronicle)
          </span>
        </div>
        <span className="text-[10px] text-slate-500">歷史紀錄：{logs.length} 則</span>
      </div>

      {/* Log Entries Container */}
      <div
        ref={scrollRef}
        className="flex-1 p-2.5 overflow-y-auto space-y-1 font-mono text-xs leading-relaxed"
      >
        {logs.map((log) => {
          let colorClass = 'text-slate-300';
          if (log.type === 'gold') colorClass = 'text-[#f4d06f] font-semibold';
          else if (log.type === 'success') colorClass = 'text-emerald-400 font-semibold';
          else if (log.type === 'danger') colorClass = 'text-red-400 font-semibold';
          else if (log.type === 'combat') colorClass = 'text-rose-400';
          else if (log.type === 'rumor') colorClass = 'text-cyan-300';

          return (
            <div key={log.id} className="flex items-start gap-2">
              <span className="text-slate-500 text-[10px] shrink-0 mt-0.5">[{log.time}]</span>
              <span className={colorClass}>{log.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
