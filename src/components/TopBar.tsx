import React from 'react';
import { PlayerState, ShipType } from '../types/game';
import { PORTS, SHIPS } from '../data/gameData';
import { 
  Anchor, 
  Coins, 
  Shield, 
  Users, 
  Package, 
  Utensils, 
  Volume2, 
  VolumeX, 
  Waves,
  UserCheck,
  Compass
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TopBarProps {
  player: PlayerState;
  onOpenCaptain: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  ambientWaves: boolean;
  onToggleAmbient: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  player,
  onOpenCaptain,
  isMuted,
  onToggleMute,
  ambientWaves,
  onToggleAmbient
}) => {
  const currentPortData = PORTS[player.currentPort];
  const ship: ShipType = SHIPS[player.shipType] || SHIPS.caravel;

  const maxCargo = Math.floor(ship.cargo * (player.shipRefit.expandedHold ? 1.35 : 1));
  const maxHp = Math.floor(ship.maxHp * (player.shipRefit.hullReinforced ? 1.25 : 1));
  const currentCargoCount = Object.values(player.cargo).reduce((acc, c) => acc + c.count, 0);

  const hpPercent = Math.max(0, Math.min(100, Math.round((player.shipHp / maxHp) * 100)));
  const cargoPercent = Math.max(0, Math.min(100, Math.round((currentCargoCount / maxCargo) * 100)));

  return (
    <header className="bg-[#121b28] border-b-2 border-[#c5a059]/40 text-[#e0e6ed] px-3 md:px-5 py-2.5 shadow-lg select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Zone 1: Location & Date */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#1e2c3e] border border-[#c5a059]/60 flex items-center justify-center text-[#f4d06f] shadow-inner">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs text-[#c5a059] tracking-wider uppercase">
                {player.isSailing ? 'High Seas' : 'Current Harbor'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {player.date.year}年 {player.date.month}月 {player.date.day}日
              </span>
            </div>
            <div className="font-bold text-base text-amber-100 flex items-center gap-1.5">
              {player.isSailing ? (
                <span className="text-cyan-300 animate-pulse flex items-center gap-1">
                  <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                  {player.sailingInfo ? `公海往 ${PORTS[player.sailingInfo.destination]?.name || '未知港口'}` : '遠洋航行中...'}
                </span>
              ) : (
                <span>{currentPortData ? `${currentPortData.name} (${currentPortData.englishName})` : '未知港灣'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Zone 2: Core Meters */}
        <div className="flex items-center flex-wrap gap-4 md:gap-6 text-xs">
          {/* Gold */}
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded bg-amber-950/60 border border-amber-600/40 text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-amber-300/70 uppercase">金幣 (Ducats)</div>
              <div className="font-bold text-amber-300 font-mono tabular-nums text-sm">
                {player.gold.toLocaleString()} <span className="text-[11px]">G</span>
              </div>
            </div>
          </div>

          {/* Durability */}
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded border ${hpPercent < 30 ? 'bg-red-950/70 border-red-500/60 text-red-400 animate-pulse' : 'bg-slate-800/80 border-slate-600/50 text-slate-300'}`}>
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>耐久度</span>
                <span className="font-mono tabular-nums">{player.shipHp}/{maxHp}</span>
              </div>
              <div className="w-20 md:w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mt-0.5">
                <div 
                  className={`h-full transition-all duration-300 ${hpPercent < 30 ? 'bg-red-500' : hpPercent < 60 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Crew & Morale */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-slate-800/80 border border-slate-600/50 text-slate-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>水手 / 士氣</span>
                <span className="font-mono tabular-nums">{player.crew}/{ship.maxCrew}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[11px] font-semibold ${player.crewMorale > 70 ? 'text-emerald-400' : player.crewMorale > 40 ? 'text-amber-300' : 'text-red-400 animate-pulse'}`}>
                  士氣 {player.crewMorale}%
                </span>
              </div>
            </div>
          </div>

          {/* Cargo */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-slate-800/80 border border-slate-600/50 text-slate-300">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>貨艙容量</span>
                <span className="font-mono tabular-nums">{currentCargoCount}/{maxCargo}</span>
              </div>
              <div className="w-16 md:w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mt-0.5">
                <div 
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${cargoPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Supplies */}
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded border ${player.supplies.rations < 5 ? 'bg-red-950/70 border-red-500/60 text-red-400 animate-pulse' : 'bg-slate-800/80 border-slate-600/50 text-slate-300'}`}>
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">航海補給</div>
              <div className="font-bold text-slate-200 font-mono tabular-nums">
                <span className={player.supplies.rations < 5 ? 'text-red-400 font-bold' : 'text-emerald-300'}>
                  {player.supplies.rations} 天份
                </span>
                <span className="text-slate-500 text-[10px] ml-1">
                  · 彈藥 {player.supplies.ammo}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Zone 3: Controls & Dossier */}
        <div className="flex items-center gap-2">
          {/* Sound Controls */}
          <button
            onClick={onToggleAmbient}
            title={ambientWaves ? "關閉海浪環境音" : "開啟海浪環境音"}
            className={`p-1.5 rounded border text-xs transition-colors ${ambientWaves ? 'bg-cyan-950 border-cyan-500/60 text-cyan-300' : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'}`}
          >
            <Waves className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onToggleMute();
              sound.playCoin();
            }}
            title={isMuted ? "解開靜音" : "靜音"}
            className={`p-1.5 rounded border text-xs transition-colors ${isMuted ? 'bg-red-950/60 border-red-700 text-red-400' : 'bg-slate-800/80 border-slate-700 text-[#f4d06f] hover:border-[#c5a059]'}`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Captain Dossier Button */}
          <button
            onClick={() => {
              sound.playBell();
              onOpenCaptain();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-[#2a3c50] to-[#1c2937] hover:from-[#354c66] hover:to-[#243547] border border-[#c5a059]/60 text-[#f4d06f] font-semibold text-xs transition-all shadow-sm active:translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>提督航海誌</span>
          </button>
        </div>
      </div>
    </header>
  );
};
