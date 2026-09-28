import React, { useState } from 'react';
import { PlayerState, Port, MarketItem } from '../types/game';
import { PORTS, SHIPS } from '../data/gameData';
import { 
  Building2, 
  TrendingUp, 
  ArrowDownRight, 
  Coins, 
  Sparkles,
  Info,
  Package
} from 'lucide-react';
import { sound } from '../utils/audio';

interface MarketViewProps {
  player: PlayerState;
  onBuy: (itemId: string, itemName: string, unitPrice: number, count: number) => void;
  onSell: (itemName: string, unitPrice: number, count: number) => void;
  onInvest: (amount: number) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  player,
  onBuy,
  onSell,
  onInvest
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const port: Port = PORTS[player.currentPort];
  const ship = SHIPS[player.shipType];
  const maxCargo = Math.floor(ship.cargo * (player.shipRefit.expandedHold ? 1.35 : 1));
  const currentCargoCount = Object.values(player.cargo).reduce((acc, c) => acc + c.count, 0);
  const remainingCargoSpace = Math.max(0, maxCargo - currentCargoCount);

  // Check if Chief Purser Jacob is hired (-10% buy cost, +8% sell price)
  const hasJacob = player.hiredOfficers.includes('jacob');

  // Calculate local purchase price with Purser discount
  const getBuyPrice = (item: MarketItem) => {
    let price = item.basePrice;
    if (hasJacob) {
      price = Math.max(1, Math.floor(price * 0.9));
    }
    return price;
  };

  // Calculate local selling price for any cargo item
  const getSellPrice = (itemName: string) => {
    // If local market sells it, price is slightly discounted from buy price
    const localMatch = port.market.find(m => m.name === itemName);
    if (localMatch) {
      let p = Math.floor(localMatch.basePrice * 0.85);
      if (hasJacob) p = Math.floor(p * 1.08);
      return Math.max(5, p);
    }

    // Foreign goods trade value based on rarity & distance
    let base = 90;
    if (['馬拉巴爾黑胡椒', '班達肉豆蔻', '丁香', '乳香脂', '綠豆蔻'].includes(itemName)) {
      // High profit in Europe/Mediterranean
      base = ['lisbon', 'seville', 'london', 'amsterdam', 'genoa'].includes(port.id) ? 380 : 120;
    } else if (['極品沉香木', '精雕象牙', '石見銀山白銀', '星彩紅寶石', '切割鑽石'].includes(itemName)) {
      base = ['lisbon', 'seville', 'london', 'amsterdam', 'genoa'].includes(port.id) ? 680 : 250;
    } else if (['蒔繪漆器', '備前長船武士刀', '印度生絲'].includes(itemName)) {
      base = ['lisbon', 'seville', 'london', 'amsterdam', 'genoa'].includes(port.id) ? 550 : 200;
    } else if (['火繩槍', '鍛鐵胸甲', '大馬士革鋼刀', '鑄鐵巨砲'].includes(itemName)) {
      base = ['calicut', 'malacca', 'nagasaki'].includes(port.id) ? 460 : 180;
    } else if (['波特紅酒', '雪莉酒', '麥芽威士忌'].includes(itemName)) {
      base = ['calicut', 'malacca', 'nagasaki', 'alexandria'].includes(port.id) ? 220 : 60;
    } else {
      base = 110;
    }

    if (hasJacob) {
      base = Math.floor(base * 1.08);
    }
    return base;
  };

  const investmentLevel = player.portInvestments[port.id] || 0;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Port Market Header */}
      <div className="bg-[#182635] p-3.5 rounded-lg border border-[#c5a059]/40 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#f4d06f]" />
            <h2 className="text-lg font-bold font-cinzel text-amber-200">
              {port.name} 交易所 (Market)
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              商業投資額: {investmentLevel.toLocaleString()} G
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {port.desc}
          </p>
        </div>

        {/* Investment Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (player.gold < 1000) return;
              sound.playCoin();
              onInvest(1000);
            }}
            disabled={player.gold < 1000}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-900/60 hover:bg-amber-800/80 border border-amber-500/50 text-amber-200 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>商港投資 (+1,000 G)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playSail();
              setActiveTab('buy');
            }}
            className={`px-4 py-1.5 rounded-t font-semibold text-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'buy'
                ? 'bg-[#243547] text-[#f4d06f] border-t-2 border-x-2 border-[#c5a059]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>購入特產 (Buy Goods)</span>
          </button>
          <button
            onClick={() => {
              sound.playCoin();
              setActiveTab('sell');
            }}
            className={`px-4 py-1.5 rounded-t font-semibold text-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'sell'
                ? 'bg-[#243547] text-[#f4d06f] border-t-2 border-x-2 border-[#c5a059]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>拋售貨物 (Sell Cargo)</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full font-mono text-cyan-300">
              {currentCargoCount} 艙
            </span>
          </button>
        </div>

        {hasJacob && (
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>會計長雅各：買價 -10% / 賣價 +8%</span>
          </div>
        )}
      </div>

      {/* Active Tab Content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeTab === 'buy' ? (
          <div className="space-y-2">
            <div className="grid grid-cols-12 text-[11px] font-semibold text-slate-400 px-3 py-1.5 bg-[#141e2a] rounded border border-slate-700">
              <div className="col-span-4">商品名目</div>
              <div className="col-span-2 text-right">進貨單價</div>
              <div className="col-span-2 text-right">商港庫存</div>
              <div className="col-span-4 text-center">購入指令</div>
            </div>

            {port.market.map((item) => {
              const isLocked = item.unlockInvestment && investmentLevel < item.unlockInvestment;
              const unitPrice = getBuyPrice(item);
              const maxCanBuyByGold = Math.floor(player.gold / unitPrice);
              const maxCanBuy = Math.min(item.stock, remainingCargoSpace, maxCanBuyByGold);

              if (isLocked) {
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 items-center px-3 py-2 bg-[#121922]/60 rounded border border-dashed border-slate-700 text-slate-500 text-xs"
                  >
                    <div className="col-span-4 flex items-center gap-2">
                      <span>🔒 {item.name} (隱藏特產)</span>
                    </div>
                    <div className="col-span-8 text-right text-[11px] text-amber-500/80">
                      需累計港口投資達 {item.unlockInvestment?.toLocaleString()} G 解鎖特產供貨
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center px-3 py-2 bg-[#1a2636] hover:bg-[#203044] rounded border border-[#3b4e63] transition-colors text-xs"
                >
                  <div className="col-span-4 flex items-center gap-2">
                    <div>
                      <span className="font-bold text-amber-100">{item.name}</span>
                      {item.isSpecialty && (
                        <span className="ml-1.5 text-[10px] text-amber-300 font-mono">
                          [名產]
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 text-right font-mono font-bold text-amber-300">
                    {unitPrice} G
                  </div>

                  <div className="col-span-2 text-right font-mono text-slate-300">
                    {item.stock} 箱
                  </div>

                  <div className="col-span-4 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onBuy(item.id, item.name, unitPrice, 1)}
                      disabled={maxCanBuy < 1}
                      className="px-2 py-1 rounded bg-[#2b3c50] hover:bg-[#39506c] border border-slate-600 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-mono text-[11px]"
                    >
                      買 1
                    </button>
                    <button
                      onClick={() => onBuy(item.id, item.name, unitPrice, 5)}
                      disabled={maxCanBuy < 5}
                      className="px-2 py-1 rounded bg-[#2b3c50] hover:bg-[#39506c] border border-slate-600 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed font-mono text-[11px]"
                    >
                      買 5
                    </button>
                    <button
                      onClick={() => onBuy(item.id, item.name, unitPrice, maxCanBuy)}
                      disabled={maxCanBuy < 1}
                      className="px-2.5 py-1 rounded bg-amber-700 hover:bg-amber-600 border border-amber-500 text-amber-100 font-bold disabled:opacity-30 disabled:cursor-not-allowed font-mono text-[11px]"
                    >
                      全掃 ({maxCanBuy})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(player.cargo).length === 0 ? (
              <div className="text-center py-12 text-slate-400 bg-[#141e2a] rounded border border-slate-700/80">
                <Package className="w-10 h-10 mx-auto text-slate-500 mb-2" />
                <p className="text-sm font-semibold">目前船艙空空如也，沒有裝載任何貨物。</p>
                <p className="text-xs text-slate-500 mt-1">
                  切換至「購入特產」或前往其他港口採購香料與奢侈品！
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 text-[11px] font-semibold text-slate-400 px-3 py-1.5 bg-[#141e2a] rounded border border-slate-700">
                  <div className="col-span-3">船艙貨品</div>
                  <div className="col-span-2 text-right">進貨均價</div>
                  <div className="col-span-2 text-right">本地收購價</div>
                  <div className="col-span-2 text-right">預估利潤率</div>
                  <div className="col-span-3 text-center">出售指令</div>
                </div>

                {Object.entries(player.cargo).map(([itemName, cargo]) => {
                  if (cargo.count <= 0) return null;
                  const sellPrice = getSellPrice(itemName);
                  const profitPerUnit = sellPrice - cargo.buyPrice;
                  const profitMargin = Math.round((profitPerUnit / Math.max(1, cargo.buyPrice)) * 100);

                  return (
                    <div
                      key={itemName}
                      className="grid grid-cols-12 items-center px-3 py-2 bg-[#1a2636] hover:bg-[#203044] rounded border border-[#3b4e63] transition-colors text-xs"
                    >
                      <div className="col-span-3">
                        <span className="font-bold text-amber-100">{itemName}</span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {cargo.count} 箱 · 產自 {cargo.buyPort}
                        </div>
                      </div>

                      <div className="col-span-2 text-right font-mono text-slate-400">
                        {cargo.buyPrice} G
                      </div>

                      <div className="col-span-2 text-right font-mono font-bold text-amber-300">
                        {sellPrice} G
                      </div>

                      <div className="col-span-2 text-right font-mono font-bold">
                        <span className={profitMargin >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                          {profitMargin >= 0 ? `+${profitMargin}%` : `${profitMargin}%`}
                        </span>
                      </div>

                      <div className="col-span-3 flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSell(itemName, sellPrice, 1)}
                          className="px-2 py-1 rounded bg-[#2b3c50] hover:bg-[#39506c] border border-slate-600 text-slate-200 font-mono text-[11px]"
                        >
                          賣 1
                        </button>
                        <button
                          onClick={() => onSell(itemName, sellPrice, cargo.count)}
                          className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 border border-emerald-500 text-emerald-100 font-bold font-mono text-[11px]"
                        >
                          全拋 ({cargo.count})
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-[#121b27] px-3 py-2 rounded border border-slate-700 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>剩餘貨艙容積: <strong className="text-cyan-300">{remainingCargoSpace}</strong> / {maxCargo} 箱</span>
        </div>
        <div className="flex items-center gap-1 text-amber-300 font-bold">
          <Coins className="w-3.5 h-3.5" />
          <span>可用資金: {player.gold.toLocaleString()} G</span>
        </div>
      </div>
    </div>
  );
};
