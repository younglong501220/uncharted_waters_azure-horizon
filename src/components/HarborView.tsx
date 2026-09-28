import React, { useState } from 'react';
import { PlayerState, Port } from '../types/game';
import { PORTS, SHIPS } from '../data/gameData';
import { 
  Anchor, 
  Utensils, 
  Crosshair, 
  TreePine, 
  Navigation, 
  AlertTriangle,
  Compass
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HarborViewProps {
  player: PlayerState;
  onBuySupplies: (rationsDays: number, ammoCount: number, timberCount: number, totalCost: number) => void;
  onSetSail: (destinationPortId: string, totalDays: number) => void;
  onSelectMapDestination: (portId: string) => void;
  selectedDestination: string | null;
}

export const HarborView: React.FC<HarborViewProps> = ({
  player,
  onBuySupplies,
  onSetSail,
  onSelectMapDestination,
  selectedDestination
}) => {
  const currentPort: Port = PORTS[player.currentPort];
  const ship = SHIPS[player.shipType];
  const hasMaria = player.hiredOfficers.includes('maria'); // Maria gives +15% sailing speed

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Harbor Header */}
      <div className="bg-[#182635] p-3.5 rounded-lg border border-[#c5a059]/40 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#243547] border border-[#c5a059]/60 flex items-center justify-center text-[#f4d06f]">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-cinzel text-amber-200">
              {currentPort.name} 碼頭整備與出港 (Harbor & Sail)
            </h2>
            <p className="text-xs text-slate-300">
              檢視遠洋補給物資，選定目的港口海路並安排全船出港啟航。
            </p>
          </div>
        </div>

        {/* Current Supplies Overview */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-2.5 py-1 rounded bg-black/40 border border-slate-700">
            <span className="text-slate-400">淡水糧草: </span>
            <strong className={player.supplies.rations < 10 ? 'text-red-400' : 'text-emerald-300'}>
              {player.supplies.rations} 天
            </strong>
          </div>
          <div className="px-2.5 py-1 rounded bg-black/40 border border-slate-700">
            <span className="text-slate-400">火砲備彈: </span>
            <strong className="text-amber-300">{player.supplies.ammo} 發</strong>
          </div>
          <div className="px-2.5 py-1 rounded bg-black/40 border border-slate-700">
            <span className="text-slate-400">維修木料: </span>
            <strong className="text-cyan-300">{player.supplies.timber} 塊</strong>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Outfitting & Provisions Purchasing */}
        <div className="bg-[#182636] p-4 rounded-lg border border-[#3b4e63] space-y-3">
          <h3 className="font-bold text-amber-100 text-sm flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-400" />
            快速採購出海補給物資 (Provisions)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Rations */}
            <div className="p-3 rounded bg-[#121b27] border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-200">糧食與淡水 (Rations)</span>
                <span className="text-slate-400 font-mono">5 G / 天</span>
              </div>
              <p className="text-[11px] text-slate-400">
                出海航行每日消耗 1 天份。缺糧將引發壞血病與水手死亡。
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    if (player.gold < 50) return;
                    sound.playCoin();
                    onBuySupplies(10, 0, 0, 50);
                  }}
                  disabled={player.gold < 50}
                  className="flex-1 py-1 rounded bg-[#2b3c50] hover:bg-[#384e68] border border-slate-600 text-slate-200 text-xs font-mono disabled:opacity-30 cursor-pointer"
                >
                  +10 天 (50G)
                </button>
                <button
                  onClick={() => {
                    if (player.gold < 150) return;
                    sound.playCoin();
                    onBuySupplies(30, 0, 0, 150);
                  }}
                  disabled={player.gold < 150}
                  className="flex-1 py-1 rounded bg-amber-700 hover:bg-amber-600 border border-amber-500 text-amber-100 text-xs font-mono font-bold disabled:opacity-30 cursor-pointer"
                >
                  +30 天 (150G)
                </button>
              </div>
            </div>

            {/* Ammunition */}
            <div className="p-3 rounded bg-[#121b27] border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-200">鑄鐵砲彈與火藥 (Ammo)</span>
                <span className="text-slate-400 font-mono">10 G / 發</span>
              </div>
              <p className="text-[11px] text-slate-400">
                用於遭遇海盜或敵對艦隊時發動側舷重砲轟擊。
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    if (player.gold < 100) return;
                    sound.playCoin();
                    onBuySupplies(0, 10, 0, 100);
                  }}
                  disabled={player.gold < 100}
                  className="flex-1 py-1 rounded bg-[#2b3c50] hover:bg-[#384e68] border border-slate-600 text-slate-200 text-xs font-mono disabled:opacity-30 cursor-pointer"
                >
                  +10 發 (100G)
                </button>
                <button
                  onClick={() => {
                    if (player.gold < 250) return;
                    sound.playCoin();
                    onBuySupplies(0, 25, 0, 250);
                  }}
                  disabled={player.gold < 250}
                  className="flex-1 py-1 rounded bg-[#2b3c50] hover:bg-[#384e68] border border-slate-600 text-slate-200 text-xs font-mono disabled:opacity-30 cursor-pointer"
                >
                  +25 發 (250G)
                </button>
              </div>
            </div>

            {/* Timber */}
            <div className="p-3 rounded bg-[#121b27] border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-200">備用硬木板 (Timber)</span>
                <span className="text-slate-400 font-mono">30 G / 塊</span>
              </div>
              <p className="text-[11px] text-slate-400">
                海上遭遇暴風雨受損時，木匠可用於緊急修補船殼。
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    if (player.gold < 90) return;
                    sound.playCoin();
                    onBuySupplies(0, 0, 3, 90);
                  }}
                  disabled={player.gold < 90}
                  className="flex-1 py-1 rounded bg-[#2b3c50] hover:bg-[#384e68] border border-slate-600 text-slate-200 text-xs font-mono disabled:opacity-30 cursor-pointer"
                >
                  +3 塊 (90G)
                </button>
                <button
                  onClick={() => {
                    if (player.gold < 240) return;
                    sound.playCoin();
                    onBuySupplies(0, 0, 8, 240);
                  }}
                  disabled={player.gold < 240}
                  className="flex-1 py-1 rounded bg-[#2b3c50] hover:bg-[#384e68] border border-slate-600 text-slate-200 text-xs font-mono disabled:opacity-30 cursor-pointer"
                >
                  +8 塊 (240G)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Destination Port Routes Selection */}
        <div className="bg-[#182636] p-4 rounded-lg border border-[#3b4e63] space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-amber-100 text-sm">選擇航行目的地 (Destinations)</h3>
            </div>
            {hasMaria && (
              <span className="text-xs text-purple-300 font-mono">
                航海士瑪麗亞：全航程提速 15%
              </span>
            )}
          </div>

          <div className="space-y-2">
            {Object.entries(currentPort.distances).map(([targetKey, baseDist]) => {
              const targetPort = PORTS[targetKey];
              if (!targetPort) return null;

              // Calculate adjusted distance with Maria's navigation boost
              let distDays = baseDist;
              if (hasMaria) {
                distDays = Math.max(1, Math.round(baseDist * 0.85));
              }

              const isRiskShortage = player.supplies.rations < distDays;
              const isSelected = selectedDestination === targetKey;

              return (
                <div
                  key={targetKey}
                  onClick={() => onSelectMapDestination(targetKey)}
                  className={`p-3 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#203448] border-cyan-400 shadow-md ring-1 ring-cyan-400/50'
                      : 'bg-[#131d28] border-slate-700/80 hover:bg-[#1a2736]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#1e2d3d] border border-slate-600 flex items-center justify-center font-bold text-amber-300 font-cinzel text-xs">
                      {targetPort.region.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-amber-200 text-sm">{targetPort.name}</h4>
                        <span className="text-xs text-slate-400 font-mono">({targetPort.englishName})</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-slate-300">
                          {targetPort.region}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                        <span>預估航程: <strong className="text-amber-300">{distDays} 天</strong></span>
                        <span>最低淡水要求: {distDays} 天份</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0">
                    {isRiskShortage && (
                      <span className="text-[11px] text-red-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        補給不足
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playSail();
                        onSetSail(targetKey, distDays);
                      }}
                      className="px-4 py-2 rounded bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 border border-cyan-400 text-white font-bold text-xs shadow flex items-center gap-1.5 active:translate-y-0.5 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>啟航揚帆 ({distDays} 天)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
