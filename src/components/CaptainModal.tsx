import React from 'react';
import { PlayerState, ShipType } from '../types/game';
import { SHIPS, OFFICERS, DISCOVERIES } from '../data/gameData';
import { 
  X, 
  User, 
  Award, 
  Coins, 
  Ship, 
  Save, 
  Download, 
  RotateCcw, 
  Sparkles,
  Compass
} from 'lucide-react';
import { sound } from '../utils/audio';

interface CaptainModalProps {
  player: PlayerState;
  onClose: () => void;
  onSaveGame: () => void;
  onResetGame: () => void;
}

export const CaptainModal: React.FC<CaptainModalProps> = ({
  player,
  onClose,
  onSaveGame,
  onResetGame
}) => {
  const currentShip: ShipType = SHIPS[player.shipType] || SHIPS.caravel;
  const hiredOfficersList = OFFICERS.filter((o) => player.hiredOfficers.includes(o.id));
  const unlockedDiscoveriesList = DISCOVERIES.filter((d) => player.unlockedDiscoveries.includes(d.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm select-none animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#121c27] border-2 border-[#c5a059] rounded-xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#182535] border-b border-[#c5a059]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold font-cinzel text-amber-200">
              提督艦隊航海誌 (Captain's Dossier)
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playSail();
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Captain & Status Card */}
          <div className="p-4 rounded-lg bg-[#182637] border border-[#3b4e63] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 border-2 border-amber-200 flex items-center justify-center text-slate-900 font-bold text-2xl shadow-md">
                ⚓
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-amber-100">{player.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-black/40 border border-amber-500/50 text-amber-300 font-mono">
                    {player.title}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  母港國籍：葡萄牙 (Kingdom of Portugal) · 出海歷程：{player.date.year} 年
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">總資產金幣</span>
                <strong className="text-amber-300 text-sm">{player.gold.toLocaleString()} G</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">航海總聲望</span>
                <strong className="text-purple-300 text-sm">{player.fame.toLocaleString()} 点</strong>
              </div>
            </div>
          </div>

          {/* Current Flagship Info */}
          <div className="p-4 rounded-lg bg-[#182637] border border-[#3b4e63] space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-amber-200 text-sm flex items-center gap-1.5">
                <Ship className="w-4 h-4 text-cyan-400" />
                <span>現役旗艦：{currentShip.name} ({currentShip.className})</span>
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
              <div className="p-2 rounded bg-black/30 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">耐久值</span>
                <strong className="text-emerald-400">{player.shipHp} / {currentShip.maxHp}</strong>
              </div>
              <div className="p-2 rounded bg-black/30 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">載貨量</span>
                <strong className="text-cyan-300">{currentShip.cargo} 艙</strong>
              </div>
              <div className="p-2 rounded bg-black/30 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">火砲威力</span>
                <strong className="text-amber-400">{currentShip.cannons} 門</strong>
              </div>
              <div className="p-2 rounded bg-black/30 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">水手人數</span>
                <strong className="text-slate-200">{player.crew} 人</strong>
              </div>
            </div>
          </div>

          {/* Hired Officers */}
          <div className="space-y-2">
            <h4 className="font-bold text-amber-200 text-sm flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-400" />
              <span>服役夥伴航海士 ({hiredOfficersList.length}/4)</span>
            </h4>

            {hiredOfficersList.length === 0 ? (
              <p className="text-xs text-slate-400 p-3 bg-black/20 rounded border border-dashed border-slate-700">
                尚未招募夥伴。請至各港口酒館尋覓老練的大副、觀星航海士與砲術長！
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {hiredOfficersList.map((off) => (
                  <div key={off.id} className="p-2.5 rounded bg-black/30 border border-slate-700 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-amber-100">{off.name}</strong>
                      <span className="text-[10px] text-cyan-300 font-mono">{off.roleName}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">{off.bonusDesc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unlocked Discoveries */}
          <div className="space-y-2">
            <h4 className="font-bold text-amber-200 text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" />
              <span>已解鎖地理奇蹟與文明寶藏 ({unlockedDiscoveriesList.length})</span>
            </h4>

            {unlockedDiscoveriesList.length === 0 ? (
              <p className="text-xs text-slate-400 p-3 bg-black/20 rounded border border-dashed border-slate-700">
                尚未勘驗出世界奇蹟。在亞歷山大、卡利卡特、馬六甲與長崎公會打聽考證！
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {unlockedDiscoveriesList.map((disc) => (
                  <div key={disc.id} className="p-2.5 rounded bg-cyan-950/30 border border-cyan-500/40 flex items-center gap-3">
                    <span className="text-2xl">{disc.imageIcon}</span>
                    <div>
                      <strong className="text-cyan-200 text-xs">{disc.name}</strong>
                      <p className="text-[11px] text-slate-300">{disc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions (Save / Reset) */}
        <div className="px-5 py-3.5 bg-[#182535] border-t border-[#c5a059]/40 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('確定要重新開始新的航海生涯嗎？當前進度將會重置！')) {
                onResetGame();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-300 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置新遊戲</span>
          </button>

          <button
            onClick={() => {
              sound.playCoin();
              onSaveGame();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border border-amber-400 text-amber-100 font-bold text-xs shadow active:translate-y-0.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>存檔進度 (Save Game)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
