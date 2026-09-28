import React, { useEffect, useState, useRef } from 'react';
import { PlayerState } from '../types/game';
import { PORTS, SHIPS } from '../data/gameData';
import { 
  Compass, 
  Wind, 
  CloudRain, 
  Sun, 
  Ship, 
  AlertOctagon, 
  Volume2, 
  Play, 
  FastForward,
  Skull
} from 'lucide-react';
import { sound } from '../utils/audio';

interface SailingViewProps {
  player: PlayerState;
  onAdvanceDay: () => void;
  onTriggerCombat: () => void;
  onTriggerEvent: (event: 'storm' | 'dolphins' | 'flotsam') => void;
  onArrivePort: () => void;
}

export const SailingView: React.FC<SailingViewProps> = ({
  player,
  onAdvanceDay,
  onTriggerCombat,
  onTriggerEvent,
  onArrivePort
}) => {
  const [sailingSpeed, setSailingSpeed] = useState<1 | 2 | 3>(1);
  const [activeEventMessage, setActiveEventMessage] = useState<string | null>(null);
  const info = player.sailingInfo;

  const destPort = info ? PORTS[info.destination] : null;
  const currentDay = info?.currentDay ?? 0;
  const totalDays = info?.totalDays ?? 1;
  const progressPercent = Math.min(100, Math.round((currentDay / totalDays) * 100));

  // Auto-advance sailing timer
  useEffect(() => {
    if (!player.isSailing || !info) return;

    const intervalMs = sailingSpeed === 1 ? 1200 : sailingSpeed === 2 ? 600 : 300;
    const timer = setInterval(() => {
      // Check arrival
      if (currentDay >= totalDays) {
        sound.playBell();
        onArrivePort();
        return;
      }

      // Roll for random sea events (25% chance per day)
      const roll = Math.random();
      if (roll < 0.08 && currentDay > 1 && currentDay < totalDays) {
        // Pirate attack!
        sound.playCannon();
        setActiveEventMessage('⚔️ 警報！海平線上出現揮舞骷髏旗的兇殘海盜戰艦！');
        clearInterval(timer);
        setTimeout(() => {
          onTriggerCombat();
        }, 1200);
        return;
      } else if (roll < 0.14) {
        // Storm
        sound.playSail();
        setActiveEventMessage('⛈️ 遭遇海上暴風巨浪！水手們緊急收帆應變！');
        onTriggerEvent('storm');
      } else if (roll < 0.20) {
        // Dolphins
        sound.playSail();
        setActiveEventMessage('🐬 躍出水面的成群海豚引導航向，全船士氣大振！');
        onTriggerEvent('dolphins');
      } else if (roll < 0.25) {
        // Flotsam
        sound.playCoin();
        setActiveEventMessage('📦 搜獲漂流遺落的遠洋木箱，補充了貴重金幣物資！');
        onTriggerEvent('flotsam');
      } else {
        setActiveEventMessage(null);
      }

      onAdvanceDay();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [player.isSailing, info, currentDay, totalDays, sailingSpeed]);

  return (
    <div className="relative flex flex-col items-center justify-between h-full p-4 md:p-6 rounded-lg bg-gradient-to-b from-[#0e1d2c] via-[#12263a] to-[#0a1520] border-2 border-[#c5a059]/60 overflow-hidden shadow-2xl select-none">
      {/* Dynamic Water & Cloud Background Canvas Effects */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Top Sailing Status Header */}
      <div className="w-full flex items-center justify-between z-10 bg-[#162332]/80 backdrop-blur px-4 py-2.5 rounded-lg border border-[#3f566e]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <div className="text-[11px] text-cyan-400 font-cinzel font-bold tracking-wider">
              VOYAGE IN PROGRESS
            </div>
            <div className="text-sm font-bold text-amber-100">
              航向：{destPort ? `${destPort.name} (${destPort.englishName})` : '未知海域'}
            </div>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 bg-[#0e1722] p-1 rounded-md border border-slate-700">
          <span className="text-[10px] text-slate-400 px-1 font-mono">航行倍速:</span>
          {[1, 2, 3].map((sp) => (
            <button
              key={sp}
              onClick={() => setSailingSpeed(sp as 1 | 2 | 3)}
              className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                sailingSpeed === sp
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sp}x
            </button>
          ))}
        </div>
      </div>

      {/* Center Cinematic Sailing Vessel Animation */}
      <div className="relative my-auto flex flex-col items-center justify-center z-10 w-full max-w-lg">
        {/* Sky Ambient / Sun or Moon */}
        <div className="flex items-center gap-2 mb-3 text-xs font-mono text-amber-200/80 bg-black/30 px-3 py-1 rounded-full border border-slate-700">
          <Wind className="w-4 h-4 text-cyan-400" />
          <span>信風：東南風 6級 · 海況良好</span>
        </div>

        {/* Vessel Ship Animation */}
        <div className="relative flex flex-col items-center">
          <div className="text-6xl md:text-7xl animate-bounce filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]" style={{ animationDuration: '2.5s' }}>
            ⛵
          </div>
          {/* Waves foam */}
          <div className="flex items-center gap-1 -mt-2 text-cyan-300/60 font-mono text-sm tracking-widest animate-pulse">
            ~~~~ 🌊 ~~~~ 🌊 ~~~~
          </div>
        </div>

        {/* Active Sea Event Alert Banner */}
        {activeEventMessage && (
          <div className="mt-5 px-4 py-2 rounded-lg bg-amber-950/80 border-2 border-amber-500/80 text-amber-200 text-xs font-bold shadow-lg animate-fade-in text-center max-w-md">
            {activeEventMessage}
          </div>
        )}

        {/* Rations Warning */}
        {player.supplies.rations <= 0 && (
          <div className="mt-3 px-3 py-1.5 rounded bg-red-950/90 border border-red-500 text-red-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>船上淡水糧草耗盡！壞血病肆虐中，水手面臨生命危險！</span>
          </div>
        )}
      </div>

      {/* Bottom Progress Bar & Days Meter */}
      <div className="w-full max-w-2xl bg-[#14202e]/90 p-4 rounded-lg border border-[#3e5369] z-10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300">
            航程進度：第 <strong className="text-amber-300">{currentDay}</strong> 天 / 共 {totalDays} 天
          </span>
          <span className="text-cyan-300 font-bold">{progressPercent}%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-3 bg-[#0d1620] rounded-full overflow-hidden border border-slate-700 shadow-inner p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 via-blue-500 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
          <span>船隊糧水餘量：{player.supplies.rations} 天份</span>
          <span>船員：{player.crew} 人 (士氣 {player.crewMorale}%)</span>
        </div>
      </div>
    </div>
  );
};
