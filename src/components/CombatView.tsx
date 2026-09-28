import React, { useState } from 'react';
import { PlayerState, CombatState, ShipType } from '../types/game';
import { SHIPS } from '../data/gameData';
import { 
  Skull, 
  Flame, 
  Sword, 
  Wind, 
  ShieldAlert, 
  Crosshair, 
  Coins, 
  Award,
  AlertTriangle
} from 'lucide-react';
import { sound } from '../utils/audio';

interface CombatViewProps {
  player: PlayerState;
  combat: CombatState;
  onPlayerAction: (action: 'fire' | 'board' | 'maneuver' | 'flee') => void;
}

export const CombatView: React.FC<CombatViewProps> = ({
  player,
  combat,
  onPlayerAction
}) => {
  const [animatingAction, setAnimatingAction] = useState<string | null>(null);
  const playerShip: ShipType = SHIPS[player.shipType] || SHIPS.caravel;
  const maxPlayerHp = Math.floor(playerShip.maxHp * (player.shipRefit.hullReinforced ? 1.25 : 1));
  const effectiveCannons = playerShip.cannons + player.shipRefit.cannonRefit;

  const hasVasco = player.hiredOfficers.includes('vasco'); // Gunner +25% hit & +35% crit
  const hasPedro = player.hiredOfficers.includes('pedro'); // First Mate +20% boarding damage

  const handleAction = (action: 'fire' | 'board' | 'maneuver' | 'flee') => {
    if (!combat.playerTurn || animatingAction) return;

    setAnimatingAction(action);
    if (action === 'fire') sound.playCannon();
    else if (action === 'board') sound.playSword();
    else if (action === 'flee') sound.playSail();
    else sound.playBell();

    setTimeout(() => {
      onPlayerAction(action);
      setAnimatingAction(null);
    }, 600);
  };

  const playerHpPercent = Math.max(0, Math.min(100, Math.round((player.shipHp / maxPlayerHp) * 100)));
  const enemyHpPercent = Math.max(0, Math.min(100, Math.round((combat.enemyHp / combat.enemyMaxHp) * 100)));

  return (
    <div className="relative flex flex-col h-full rounded-lg bg-[#0e1620] border-2 border-red-900/60 overflow-hidden shadow-2xl select-none">
      {/* Dramatic Battle Scene Banner */}
      <div className="relative h-32 md:h-44 w-full overflow-hidden border-b-2 border-red-950">
        <img
          src="/src/assets/images/naval_battle_scene_1790570668852.jpg"
          alt="海戰場面"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1620] via-black/40 to-transparent flex items-end p-4">
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="flex items-center gap-2">
                <Skull className="w-5 h-5 text-red-500 animate-pulse" />
                <h2 className="text-xl font-bold font-cinzel text-red-400 drop-shadow">
                  公海接舷砲戰 (Naval Tactical Combat)
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                敵方艦隊封鎖了航道！進入近距離側舷轟擊與跳幫肉搏戰！
              </p>
            </div>
            <div className="text-xs font-mono px-3 py-1 rounded bg-black/70 border border-red-600/50 text-red-300">
              第 {combat.round} 回合交火
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Ship Status Cards */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player Flagship */}
        <div className="p-4 rounded-lg bg-[#142130] border-2 border-cyan-500/50 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-cyan-200 text-sm flex items-center gap-1.5">
              <span>我方旗艦：{playerShip.name}</span>
            </h3>
            <span className="text-xs font-mono text-cyan-300">
              火砲 {effectiveCannons} 門
            </span>
          </div>

          {/* Player HP */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>船身耐久</span>
              <span className="font-bold">{player.shipHp} / {maxPlayerHp}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700 mt-1">
              <div
                className={`h-full transition-all duration-300 ${
                  playerHpPercent < 30 ? 'bg-red-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span>作戰水手：<strong className="text-amber-300">{player.crew} 人</strong></span>
            <span>備用彈藥：<strong className="text-cyan-300">{player.supplies.ammo} 發</strong></span>
          </div>

          {hasVasco && (
            <div className="text-[11px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-600/30">
              砲手瓦斯科就位：火砲傷害 +35%
            </div>
          )}
        </div>

        {/* Enemy Ship */}
        <div className="p-4 rounded-lg bg-[#221518] border-2 border-red-500/50 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-red-300 text-sm flex items-center gap-1.5">
              <Skull className="w-4 h-4 text-red-400" />
              <span>敵方：{combat.enemyName}</span>
            </h3>
            <span className="text-xs font-mono text-red-400">
              裝甲巡防艦 ({combat.enemyCannons} 門砲)
            </span>
          </div>

          {/* Enemy HP */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>敵艦耐久</span>
              <span className="font-bold text-red-400">{combat.enemyHp} / {combat.enemyMaxHp}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700 mt-1">
              <div
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${enemyHpPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span>敵方水手：<strong className="text-red-300">約 {combat.enemyCrew} 人</strong></span>
            <span>危險等級：<strong className="text-red-400">極度危險</strong></span>
          </div>

          <div className="text-[11px] text-red-300/80 bg-red-950/40 px-2 py-0.5 rounded border border-red-600/30 font-mono">
            目標意圖：擊毀我方主桅並奪取全部船艙貨品
          </div>
        </div>
      </div>

      {/* Combat Tactical Actions */}
      <div className="p-4 bg-[#121c27] border-t border-slate-700/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            onClick={() => handleAction('fire')}
            disabled={!combat.playerTurn || animatingAction !== null}
            className="p-3 rounded-lg bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 border border-red-500 text-white font-bold text-xs shadow flex flex-col items-center gap-1 active:translate-y-0.5 cursor-pointer disabled:opacity-40"
          >
            <Flame className="w-5 h-5 text-amber-300" />
            <span>💥 側舷火砲齊射</span>
            <span className="text-[10px] text-amber-200 font-mono">造成大量船體破壞</span>
          </button>

          <button
            onClick={() => handleAction('board')}
            disabled={!combat.playerTurn || animatingAction !== null}
            className="p-3 rounded-lg bg-gradient-to-b from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 border border-amber-500 text-white font-bold text-xs shadow flex flex-col items-center gap-1 active:translate-y-0.5 cursor-pointer disabled:opacity-40"
          >
            <Sword className="w-5 h-5 text-amber-200" />
            <span>⚔️ 白刃接舷戰</span>
            <span className="text-[10px] text-amber-200 font-mono">水手跳幫肉搏殺敵</span>
          </button>

          <button
            onClick={() => handleAction('maneuver')}
            disabled={!combat.playerTurn || animatingAction !== null}
            className="p-3 rounded-lg bg-gradient-to-b from-cyan-800 to-cyan-900 hover:from-cyan-700 hover:to-cyan-800 border border-cyan-500 text-white font-bold text-xs shadow flex flex-col items-center gap-1 active:translate-y-0.5 cursor-pointer disabled:opacity-40"
          >
            <Crosshair className="w-5 h-5 text-cyan-300" />
            <span>🎯 搶風轉向機動</span>
            <span className="text-[10px] text-cyan-200 font-mono">提升下回合爆擊與迴避</span>
          </button>

          <button
            onClick={() => handleAction('flee')}
            disabled={!combat.playerTurn || animatingAction !== null}
            className="p-3 rounded-lg bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-slate-500 text-white font-bold text-xs shadow flex flex-col items-center gap-1 active:translate-y-0.5 cursor-pointer disabled:opacity-40"
          >
            <Wind className="w-5 h-5 text-slate-300" />
            <span>💨 滿帆脫離交戰</span>
            <span className="text-[10px] text-slate-300 font-mono">藉由順風甩開追擊</span>
          </button>
        </div>
      </div>

      {/* Combat Tactical Log */}
      <div className="flex-1 bg-[#090f16] p-3 overflow-y-auto border-t border-slate-800 font-mono text-xs space-y-1.5">
        <div className="text-slate-500 text-[10px] border-b border-slate-800 pb-1">
          【交戰即時速報紀錄】
        </div>
        {combat.logs.map((log, idx) => (
          <div key={idx} className="text-slate-300 leading-relaxed">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
