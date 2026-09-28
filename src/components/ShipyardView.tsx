import React, { useState } from 'react';
import { PlayerState, ShipType } from '../types/game';
import { SHIPS } from '../data/gameData';
import { 
  Wrench, 
  ShieldAlert, 
  Hammer, 
  ShieldCheck, 
  Layers, 
  Check, 
  Zap
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ShipyardViewProps {
  player: PlayerState;
  onRepair: (cost: number, useTimber: boolean) => void;
  onBuyShip: (shipId: string, cost: number) => void;
  onUpgradeRefit: (type: 'hull' | 'cannon' | 'hold', cost: number) => void;
}

export const ShipyardView: React.FC<ShipyardViewProps> = ({
  player,
  onRepair,
  onBuyShip,
  onUpgradeRefit
}) => {
  const [activeTab, setActiveTab] = useState<'maintenance' | 'catalog' | 'refit'>('maintenance');

  const currentShip: ShipType = SHIPS[player.shipType] || SHIPS.caravel;
  const maxHp = Math.floor(currentShip.maxHp * (player.shipRefit.hullReinforced ? 1.25 : 1));
  const missingHp = Math.max(0, maxHp - player.shipHp);
  const repairCostGold = missingHp * 6;
  const timberNeeded = Math.ceil(missingHp / 15);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Shipyard Header */}
      <div className="bg-[#182635] p-3.5 rounded-lg border border-[#c5a059]/40 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#243547] border border-[#c5a059]/60 flex items-center justify-center text-[#f4d06f]">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-cinzel text-amber-200">
              造船廠 (Royal Shipyard)
            </h2>
            <p className="text-xs text-slate-300">
              木屑香氣撲鼻的乾塢碼頭，由資深造船匠人為艦隊提供船體修理、火砲換裝與重艦購入。
            </p>
          </div>
        </div>

        {/* Current Flagship Tag */}
        <div className="px-3 py-1.5 rounded bg-black/40 border border-slate-700 text-xs font-mono">
          <span className="text-slate-400">現役旗艦: </span>
          <strong className="text-amber-300">{currentShip.name}</strong>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-700/80 pb-1">
        <button
          onClick={() => {
            sound.playSail();
            setActiveTab('maintenance');
          }}
          className={`px-3.5 py-1.5 rounded-t text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === 'maintenance'
              ? 'bg-[#243547] text-[#f4d06f] border-t-2 border-x-2 border-[#c5a059]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>船身保養檢修</span>
        </button>

        <button
          onClick={() => {
            sound.playSail();
            setActiveTab('refit');
          }}
          className={`px-3.5 py-1.5 rounded-t text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === 'refit'
              ? 'bg-[#243547] text-[#f4d06f] border-t-2 border-x-2 border-[#c5a059]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>艦體專業改裝 (Refit)</span>
        </button>

        <button
          onClick={() => {
            sound.playSail();
            setActiveTab('catalog');
          }}
          className={`px-3.5 py-1.5 rounded-t text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === 'catalog'
              ? 'bg-[#243547] text-[#f4d06f] border-t-2 border-x-2 border-[#c5a059]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>旗艦購買目錄 (Buy Ships)</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeTab === 'maintenance' && (
          <div className="bg-[#182636] p-4 rounded-lg border border-[#3b4e63] space-y-4">
            <h3 className="font-bold text-amber-100 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              旗艦損傷評估與乾塢檢修
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded bg-[#121b27] border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">目前船體耐久度:</span>
                  <span className="font-mono font-bold text-amber-300">{player.shipHp} / {maxHp}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className={`h-full transition-all duration-300 ${
                      player.shipHp / maxHp < 0.3 ? 'bg-red-500' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${(player.shipHp / maxHp) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                  <span>待修損害: {missingHp} 點</span>
                  <span>船艙木材儲備: {player.supplies.timber} 單位</span>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-2">
                <button
                  onClick={() => {
                    if (missingHp <= 0 || player.gold < repairCostGold) return;
                    sound.playSword();
                    onRepair(repairCostGold, false);
                  }}
                  disabled={missingHp <= 0 || player.gold < repairCostGold}
                  className="px-4 py-2.5 rounded bg-amber-700 hover:bg-amber-600 border border-amber-500 text-amber-100 font-bold text-xs shadow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between cursor-pointer"
                >
                  <span>使用金幣完全整修</span>
                  <span className="font-mono">{repairCostGold.toLocaleString()} G</span>
                </button>

                <button
                  onClick={() => {
                    if (missingHp <= 0 || player.supplies.timber < timberNeeded) return;
                    sound.playSword();
                    onRepair(0, true);
                  }}
                  disabled={missingHp <= 0 || player.supplies.timber < timberNeeded}
                  className="px-4 py-2 rounded bg-[#2b3c50] hover:bg-[#384e68] border border-slate-600 text-slate-200 text-xs font-mono disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between cursor-pointer"
                >
                  <span>使用備用木料修理</span>
                  <span>消耗 {timberNeeded} 木料</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'refit' && (
          <div className="space-y-3">
            {/* Hull Reinforcement */}
            <div className="p-3.5 rounded-lg bg-[#182636] border border-[#3b4e63] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-amber-100 text-sm">堅固橡木雙層外板改裝</h4>
                  {player.shipRefit.hullReinforced && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-mono">
                      已完成改裝
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  在水線下加固葡萄牙老橡木，使船體最高耐久度永久提升 25%。
                </p>
              </div>
              <div>
                {player.shipRefit.hullReinforced ? (
                  <Check className="w-6 h-6 text-emerald-400" />
                ) : (
                  <button
                    onClick={() => {
                      if (player.gold < 3500) return;
                      sound.playSword();
                      onUpgradeRefit('hull', 3500);
                    }}
                    disabled={player.gold < 3500}
                    className="px-3.5 py-1.5 rounded bg-amber-700 hover:bg-amber-600 border border-amber-500 text-amber-100 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    改裝 (3,500 G)
                  </button>
                )}
              </div>
            </div>

            {/* Cannons Refit */}
            <div className="p-3.5 rounded-lg bg-[#182636] border border-[#3b4e63] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-amber-100 text-sm">加裝青銅長管砲塔</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-slate-700 text-amber-300 font-mono">
                    已改裝 +{player.shipRefit.cannonRefit} 門
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  改造甲板砲窗增設 4 門重型青銅長砲，大幅強化海戰全舷齊射火力。
                </p>
              </div>
              <div>
                <button
                  onClick={() => {
                    if (player.gold < 2800) return;
                    sound.playCannon();
                    onUpgradeRefit('cannon', 2800);
                  }}
                  disabled={player.gold < 2800}
                  className="px-3.5 py-1.5 rounded bg-amber-700 hover:bg-amber-600 border border-amber-500 text-amber-100 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  加裝 4 門砲 (2,800 G)
                </button>
              </div>
            </div>

            {/* Cargo Hold Expansion */}
            <div className="p-3.5 rounded-lg bg-[#182636] border border-[#3b4e63] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-amber-100 text-sm">深底複式大貨艙擴充</h4>
                  {player.shipRefit.expandedHold && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-mono">
                      已完成改裝
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  重整下層甲板佈局，將全船載貨空間永久擴大 35%，貿易首選。
                </p>
              </div>
              <div>
                {player.shipRefit.expandedHold ? (
                  <Check className="w-6 h-6 text-emerald-400" />
                ) : (
                  <button
                    onClick={() => {
                      if (player.gold < 4200) return;
                      sound.playBell();
                      onUpgradeRefit('hold', 4200);
                    }}
                    disabled={player.gold < 4200}
                    className="px-3.5 py-1.5 rounded bg-amber-700 hover:bg-amber-600 border border-amber-500 text-amber-100 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    擴建貨艙 (4,200 G)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-3">
            {Object.values(SHIPS).map((ship: ShipType) => {
              const isCurrent = player.shipType === ship.id;

              return (
                <div
                  key={ship.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isCurrent
                      ? 'bg-[#1b2c3d] border-amber-500 shadow-md'
                      : 'bg-[#182636] border-[#3b4e63] hover:border-slate-500'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-amber-200 text-base">{ship.name}</h4>
                        <span className="text-xs text-slate-400 font-mono">[{ship.className}]</span>
                        {isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-400 text-amber-200 font-mono font-bold">
                            現役旗艦
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                        {ship.desc}
                      </p>

                      {/* Ship Specs */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2.5 text-[11px] font-mono">
                        <div className="p-1.5 rounded bg-black/30 border border-slate-700/60">
                          <span className="text-slate-400 block text-[10px]">船體耐久</span>
                          <strong className="text-emerald-400">{ship.maxHp}</strong>
                        </div>
                        <div className="p-1.5 rounded bg-black/30 border border-slate-700/60">
                          <span className="text-slate-400 block text-[10px]">載貨容積</span>
                          <strong className="text-cyan-300">{ship.cargo} 艙</strong>
                        </div>
                        <div className="p-1.5 rounded bg-black/30 border border-slate-700/60">
                          <span className="text-slate-400 block text-[10px]">水手上限</span>
                          <strong className="text-slate-200">{ship.maxCrew} 人</strong>
                        </div>
                        <div className="p-1.5 rounded bg-black/30 border border-slate-700/60">
                          <span className="text-slate-400 block text-[10px]">火砲門數</span>
                          <strong className="text-amber-400">{ship.cannons} 門</strong>
                        </div>
                        <div className="p-1.5 rounded bg-black/30 border border-slate-700/60">
                          <span className="text-slate-400 block text-[10px]">基礎節速</span>
                          <strong className="text-purple-300">{ship.speed} 節</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 pt-2 md:pt-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">新艦售價</span>
                        <span className="font-mono font-bold text-sm text-amber-300">
                          {ship.cost === 0 ? '初始贈予' : `${ship.cost.toLocaleString()} G`}
                        </span>
                      </div>

                      {isCurrent ? (
                        <div className="px-3 py-1.5 rounded bg-slate-800 text-slate-400 text-xs font-mono">
                          服役中
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (player.gold < ship.cost) return;
                            sound.playBell();
                            onBuyShip(ship.id, ship.cost);
                          }}
                          disabled={player.gold < ship.cost}
                          className="px-4 py-1.5 rounded bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border border-amber-400 text-amber-100 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>訂造購買</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
