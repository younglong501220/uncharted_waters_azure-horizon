import React from 'react';
import { PORTS } from '../data/gameData';
import { Compass, Navigation } from 'lucide-react';

interface NauticalWorldMapProps {
  currentPortId: string;
  isSailing: boolean;
  sailingInfo?: {
    origin: string;
    destination: string;
    totalDays: number;
    currentDay: number;
  } | null;
  onSelectPort?: (portId: string) => void;
  selectedDestination?: string | null;
}

export const NauticalWorldMap: React.FC<NauticalWorldMapProps> = ({
  currentPortId,
  isSailing,
  sailingInfo,
  onSelectPort,
  selectedDestination
}) => {
  const currentPort = PORTS[currentPortId];
  const originPort = sailingInfo ? PORTS[sailingInfo.origin] : null;
  const destPort = sailingInfo ? PORTS[sailingInfo.destination] : null;

  // Calculate ship position on route when sailing
  let shipX = currentPort?.xPercent ?? 20;
  let shipY = currentPort?.yPercent ?? 36;
  let shipAngle = 0;

  if (isSailing && originPort && destPort && sailingInfo) {
    const progress = Math.min(1, Math.max(0, sailingInfo.currentDay / sailingInfo.totalDays));
    shipX = originPort.xPercent + (destPort.xPercent - originPort.xPercent) * progress;
    shipY = originPort.yPercent + (destPort.yPercent - originPort.yPercent) * progress;

    const dx = destPort.xPercent - originPort.xPercent;
    const dy = destPort.yPercent - originPort.yPercent;
    shipAngle = Math.atan2(dy, dx) * (180 / Math.PI);
  }

  // Define iconic sea routes
  const seaRoutes = [
    { from: 'lisbon', to: 'seville' },
    { from: 'lisbon', to: 'london' },
    { from: 'london', to: 'amsterdam' },
    { from: 'seville', to: 'genoa' },
    { from: 'genoa', to: 'alexandria' },
    { from: 'alexandria', to: 'calicut' },
    { from: 'lisbon', to: 'calicut' },
    { from: 'calicut', to: 'malacca' },
    { from: 'malacca', to: 'nagasaki' },
  ];

  return (
    <div className="relative w-full h-[320px] md:h-[360px] rounded-lg border-2 border-[#c5a059]/50 overflow-hidden bg-[#0d1e2e] shadow-2xl select-none">
      {/* Antique Nautical Grid & Rhumb Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f4d06f" strokeWidth="0.5" strokeDasharray="2,4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* Navigation Rhumb Ray Lines */}
        <line x1="20%" y1="36%" x2="90%" y2="80%" stroke="#c5a059" strokeWidth="1" strokeDasharray="4,6" />
        <line x1="20%" y1="36%" x2="80%" y2="10%" stroke="#c5a059" strokeWidth="1" strokeDasharray="4,6" />
        <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#c5a059" strokeWidth="0.5" />
        <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#c5a059" strokeWidth="0.5" />
      </svg>

      {/* Stylized Continents Outlines */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        {/* Europe & Med */}
        <div className="absolute left-[15%] top-[15%] w-[25%] h-[35%] rounded-3xl bg-[#1b3a32] blur-xl" />
        {/* Africa & Middle East */}
        <div className="absolute left-[20%] top-[45%] w-[28%] h-[40%] rounded-full bg-[#243328] blur-xl" />
        {/* India */}
        <div className="absolute left-[56%] top-[45%] w-[15%] h-[25%] rounded-full bg-[#1b3a32] blur-xl" />
        {/* Southeast Asia */}
        <div className="absolute left-[72%] top-[55%] w-[16%] h-[25%] rounded-full bg-[#1b3a32] blur-xl" />
        {/* East Asia */}
        <div className="absolute left-[84%] top-[35%] w-[12%] h-[25%] rounded-full bg-[#1b3a32] blur-xl" />
      </div>

      {/* Decorative Compass Rose */}
      <div className="absolute top-3 right-3 text-[#c5a059]/40 flex flex-col items-center pointer-events-none">
        <Compass className="w-12 h-12 stroke-[1.2]" />
        <span className="font-cinzel text-[10px] tracking-widest text-[#c5a059]/60 font-bold -mt-1">
          OCEANUS
        </span>
      </div>

      {/* Sea Route Arcs */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {seaRoutes.map((route, idx) => {
          const p1 = PORTS[route.from];
          const p2 = PORTS[route.to];
          if (!p1 || !p2) return null;

          const isCurrentActive =
            sailingInfo &&
            ((sailingInfo.origin === route.from && sailingInfo.destination === route.to) ||
             (sailingInfo.origin === route.to && sailingInfo.destination === route.from));

          return (
            <line
              key={idx}
              x1={`${p1.xPercent}%`}
              y1={`${p1.yPercent}%`}
              x2={`${p2.xPercent}%`}
              y2={`${p2.yPercent}%`}
              stroke={isCurrentActive ? '#00f0ff' : '#c5a059'}
              strokeWidth={isCurrentActive ? '2.5' : '1'}
              strokeDasharray={isCurrentActive ? '4,4' : '2,3'}
              strokeOpacity={isCurrentActive ? '0.9' : '0.4'}
              className={isCurrentActive ? 'animate-pulse' : ''}
            />
          );
        })}
      </svg>

      {/* Port Nodes */}
      {Object.values(PORTS).map((port) => {
        const isCurrent = currentPortId === port.id && !isSailing;
        const isSelected = selectedDestination === port.id;
        const isOrigin = isSailing && sailingInfo?.origin === port.id;
        const isDestination = isSailing && sailingInfo?.destination === port.id;

        return (
          <div
            key={port.id}
            onClick={() => onSelectPort && onSelectPort(port.id)}
            style={{ left: `${port.xPercent}%`, top: `${port.yPercent}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group ${onSelectPort ? 'cursor-pointer' : ''}`}
          >
            {/* Marker Dot */}
            <div
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                isCurrent
                  ? 'bg-amber-400 border-white ring-4 ring-amber-400/40 scale-125'
                  : isSelected || isDestination
                  ? 'bg-cyan-400 border-white ring-4 ring-cyan-400/40 scale-125 animate-bounce'
                  : isOrigin
                  ? 'bg-slate-400 border-slate-600'
                  : 'bg-[#182a3a] border-[#c5a059] group-hover:scale-125 group-hover:bg-[#c5a059]'
              }`}
            >
              <div className="w-1 h-1 rounded-full bg-slate-900" />
            </div>

            {/* Port Label */}
            <div
              className={`mt-1 px-1.5 py-0.5 rounded text-[11px] whitespace-nowrap font-medium transition-all shadow-md ${
                isCurrent
                  ? 'bg-amber-950/90 border border-amber-400/70 text-amber-200 font-bold'
                  : isSelected || isDestination
                  ? 'bg-cyan-950/90 border border-cyan-400/70 text-cyan-200 font-bold'
                  : 'bg-black/60 border border-slate-700/60 text-slate-300 group-hover:text-amber-200'
              }`}
            >
              {port.name}
            </div>
          </div>
        );
      })}

      {/* Animated Sailing Ship Icon */}
      <div
        style={{
          left: `${shipX}%`,
          top: `${shipY}%`,
          transform: `translate(-50%, -50%) rotate(${shipAngle}deg)`
        }}
        className={`absolute z-20 pointer-events-none transition-all duration-500 flex items-center justify-center ${
          isSailing ? 'scale-110 drop-shadow-[0_0_8px_rgba(244,208,111,0.8)]' : ''
        }`}
      >
        <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/80 flex items-center justify-center text-amber-300">
          <Navigation className="w-4 h-4 fill-amber-300" />
        </div>
      </div>

      {/* Map Legend & Region Labels */}
      <div className="absolute bottom-2 left-3 text-[10px] text-slate-400/80 pointer-events-none flex items-center gap-3 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 所在母港
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> 目標港口
        </span>
        <span className="hidden sm:inline">大航海時代・蔚藍海圖 (Anno Domini 1522)</span>
      </div>
    </div>
  );
};
