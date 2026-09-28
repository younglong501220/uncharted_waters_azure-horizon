import React from 'react';
import { PlayerState, Quest, Discovery } from '../types/game';
import { QUESTS, DISCOVERIES, PORTS } from '../data/gameData';
import { 
  Crown, 
  Scroll, 
  Compass, 
  Coins, 
  CheckCircle2, 
  Award,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/audio';

interface GuildViewProps {
  player: PlayerState;
  onAcceptQuest: (quest: Quest) => void;
  onSubmitQuest: () => void;
  onAppraiseDiscovery: (discovery: Discovery) => void;
}

export const GuildView: React.FC<GuildViewProps> = ({
  player,
  onAcceptQuest,
  onSubmitQuest,
  onAppraiseDiscovery
}) => {
  const currentPort = PORTS[player.currentPort];

  // Calculate Nobility Title
  const getNobilityTitle = (fame: number) => {
    if (fame >= 8000) return { title: '海軍總司令・提督 (Grand Admiral)', perk: '受王室敬仰，全歐洲港口免除關稅' };
    if (fame >= 4500) return { title: '帝國探險伯爵 (Count of Realm)', perk: '公會懸賞任務報酬增加 20%' };
    if (fame >= 2200) return { title: '王室探險男爵 (Baron of Exploration)', perk: '解鎖王室遠洋航路特權' };
    if (fame >= 800) return { title: '宮廷皇家騎士 (Knight)', perk: '酒館招募水手費用折讓 15%' };
    return { title: '初級冒險家 (Novice Explorer)', perk: '累積聲望向總督府晉升頭銜' };
  };

  const nobility = getNobilityTitle(player.fame);

  // Check if current quest criteria are met
  const canCompleteQuest = () => {
    if (!player.acceptedQuest) return false;
    const q = player.acceptedQuest;

    if (q.type === 'trade') {
      if (q.id === 'spice_fever') {
        const count = (player.cargo['馬拉巴爾黑胡椒']?.count || 0) + (player.cargo['班達肉豆蔻']?.count || 0);
        return count >= (q.targetQuantity || 12);
      }
      if (q.id === 'london_luxury') {
        const count = (player.cargo['蒔繪漆器']?.count || 0) + (player.cargo['熱那亞天鵝絨']?.count || 0);
        return count >= (q.targetQuantity || 5);
      }
      if (q.id === 'ivory_trade') {
        const count = player.cargo['精雕象牙']?.count || 0;
        return count >= (q.targetQuantity || 8);
      }
    }
    return false;
  };

  // Discoveries found in current port that haven't been reported
  const localDiscovery = DISCOVERIES.find(
    (d) => d.foundPort === player.currentPort && !player.unlockedDiscoveries.includes(d.id)
  );

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Guild & Palace Header */}
      <div className="bg-[#182635] p-3.5 rounded-lg border border-[#c5a059]/40 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#243547] border border-[#c5a059]/60 flex items-center justify-center text-[#f4d06f]">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-cinzel text-amber-200">
              總督府與冒險者公會 (Palace & Guild)
            </h2>
            <p className="text-xs text-slate-300">
              各國王室特派使者與航海公會駐點，受理海外探險懸賞委託、晉升騎士爵位與奇蹟考證。
            </p>
          </div>
        </div>

        {/* Nobility Box */}
        <div className="px-3.5 py-1.5 rounded bg-black/40 border border-amber-500/50 flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{nobility.title}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
            總聲望: <strong className="text-amber-200">{player.fame.toLocaleString()}</strong> 点
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Local Discovery Opportunity */}
        {localDiscovery && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-[#203448] to-[#172737] border-2 border-cyan-400/80 shadow-cyan-950/40 shadow-lg flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="text-3xl p-2 bg-black/40 rounded-lg border border-cyan-500/60">
                {localDiscovery.imageIcon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-cyan-900 border border-cyan-500 text-cyan-200 font-mono">
                    當地歷史奇蹟勘驗
                  </span>
                  <h4 className="font-bold text-cyan-200 text-sm">{localDiscovery.name}</h4>
                </div>
                <p className="text-xs text-slate-200 mt-1 max-w-xl">
                  {localDiscovery.desc}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playFanfare();
                onAppraiseDiscovery(localDiscovery);
              }}
              className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 border border-cyan-300 text-white font-bold text-xs shadow whitespace-nowrap active:translate-y-0.5 cursor-pointer"
            >
              呈報學者考證 (+{localDiscovery.fameValue} 聲望)
            </button>
          </div>
        )}

        {/* Current Active Quest */}
        <div className="bg-[#182636] p-4 rounded-lg border border-[#3b4e63] space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <div className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-amber-100 text-sm">當前執行中的公會委託</h3>
            </div>
            {player.acceptedQuest && (
              <span className="text-xs text-cyan-300 font-mono">
                已接受委託 (進行中)
              </span>
            )}
          </div>

          {player.acceptedQuest ? (
            <div className="p-3.5 rounded bg-[#121b27] border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amber-200 text-sm">
                  {player.acceptedQuest.title}
                </h4>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-amber-300 flex items-center gap-1 font-bold">
                    <Coins className="w-3.5 h-3.5" /> {player.acceptedQuest.rewardGold.toLocaleString()} G
                  </span>
                  <span className="text-purple-300 flex items-center gap-1 font-bold">
                    <Award className="w-3.5 h-3.5" /> +{player.acceptedQuest.rewardFame} 聲望
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {player.acceptedQuest.desc}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-mono">
                  {canCompleteQuest() ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> 條件達成，可隨時交還委託！
                    </span>
                  ) : (
                    <span className="text-amber-400">
                      待採集足夠貨品或擊沉目標後交付。
                    </span>
                  )}
                </span>

                <button
                  onClick={() => {
                    if (!canCompleteQuest()) return;
                    sound.playFanfare();
                    onSubmitQuest();
                  }}
                  disabled={!canCompleteQuest()}
                  className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 border border-emerald-400 text-emerald-100 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  交付委託領賞
                </button>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-slate-400">
              目前未承接任何委託。請從下方公會佈告欄選擇接受一項任務！
            </div>
          )}
        </div>

        {/* Available Commission Quests */}
        <div className="bg-[#182636] p-4 rounded-lg border border-[#3b4e63] space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-700/60 pb-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-amber-100 text-sm">公會懸賞與採購佈告欄</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {QUESTS.map((quest) => {
              const isCurrent = player.acceptedQuest?.id === quest.id;

              return (
                <div
                  key={quest.id}
                  className="p-3.5 rounded bg-[#131d28] border border-slate-700/80 hover:border-[#c5a059]/60 transition-all flex flex-col justify-between space-y-2"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-amber-100 text-xs">{quest.title}</h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">
                        {quest.type === 'bounty' ? '海盜討伐' : '跨洋採購'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {quest.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-[11px] font-mono text-amber-300">
                      報酬: {quest.rewardGold.toLocaleString()} G / {quest.rewardFame} 聲望
                    </div>

                    {isCurrent ? (
                      <span className="text-xs font-mono text-cyan-300 font-bold">執行中</span>
                    ) : (
                      <button
                        onClick={() => {
                          sound.playBell();
                          onAcceptQuest(quest);
                        }}
                        disabled={!!player.acceptedQuest}
                        className="px-3 py-1 rounded bg-[#2a3c50] hover:bg-[#38516d] border border-slate-600 text-slate-200 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        接受委託
                      </button>
                    )}
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
