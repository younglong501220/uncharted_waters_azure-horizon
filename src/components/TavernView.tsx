import React, { useState } from 'react';
import { PlayerState, Officer } from '../types/game';
import { PORTS, SHIPS, OFFICERS, TAVERN_RUMORS } from '../data/gameData';
import { 
  Beer, 
  Users, 
  UserPlus, 
  Dices, 
  Sparkles, 
  Check, 
  MessageSquare
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TavernViewProps {
  player: PlayerState;
  onTreatDrinks: () => void;
  onRecruitCrew: (count: number) => void;
  onHireOfficer: (officerId: string) => void;
  onDiceGameResult: (wager: number, winAmount: number, isWin: boolean) => void;
}

export const TavernView: React.FC<TavernViewProps> = ({
  player,
  onTreatDrinks,
  onRecruitCrew,
  onHireOfficer,
  onDiceGameResult
}) => {
  const [activeSection, setActiveSection] = useState<'lounge' | 'officers' | 'dice'>('lounge');
  const [currentRumor, setCurrentRumor] = useState<string | null>(null);

  // Dice minigame state
  const [wager, setWager] = useState<number>(50);
  const [prediction, setPrediction] = useState<'small' | 'seven' | 'big'>('big');
  const [diceRolling, setDiceRolling] = useState<boolean>(false);
  const [diceResults, setDiceResults] = useState<[number, number] | null>(null);
  const [gameOutcome, setGameOutcome] = useState<{ msg: string; won: boolean } | null>(null);

  const port = PORTS[player.currentPort];
  const ship = SHIPS[player.shipType];
  const neededCrew = Math.max(0, ship.maxCrew - player.crew);
  const crewCostPerPerson = 25;

  const handleTreat = () => {
    if (player.gold < 60) return;
    sound.playCheers();
    const randomRumor = TAVERN_RUMORS[Math.floor(Math.random() * TAVERN_RUMORS.length)];
    setCurrentRumor(randomRumor);
    onTreatDrinks();
  };

  const handleRecruit = (amount: number) => {
    const toRecruit = Math.min(amount, neededCrew);
    if (toRecruit <= 0) return;
    const cost = toRecruit * crewCostPerPerson;
    if (player.gold < cost) return;
    sound.playBell();
    onRecruitCrew(toRecruit);
  };

  const rollDiceGame = () => {
    if (player.gold < wager || diceRolling) return;
    setDiceRolling(true);
    setGameOutcome(null);
    sound.playSail();

    // Roll animation delay
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      setDiceResults([d1, d2]);

      let isWin = false;
      let payout = 0;

      if (prediction === 'small' && sum >= 2 && sum <= 6) {
        isWin = true;
        payout = wager * 2;
      } else if (prediction === 'big' && sum >= 8 && sum <= 12) {
        isWin = true;
        payout = wager * 2;
      } else if (prediction === 'seven' && sum === 7) {
        isWin = true;
        payout = wager * 5; // 5x payout for lucky 7
      }

      if (isWin) {
        sound.playCoin();
        setGameOutcome({
          msg: `擲出 ${d1} + ${d2} = ${sum} 點！大獲全勝，贏得 ${payout} G！`,
          won: true
        });
      } else {
        sound.playSword();
        setGameOutcome({
          msg: `擲出 ${d1} + ${d2} = ${sum} 點，遺憾未中，輸掉 ${wager} G。`,
          won: false
        });
      }

      onDiceGameResult(wager, payout, isWin);
      setDiceRolling(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Tavern Atmosphere Banner */}
      <div className="relative rounded-lg overflow-hidden border border-[#c5a059]/40 h-28 md:h-36 shadow-lg">
        <img
          src="/src/assets/images/tavern_sailors_1790570680654.jpg"
          alt="水手酒館"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101924] via-[#101924]/60 to-transparent flex flex-col justify-end p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-cinzel text-amber-200 drop-shadow">
                {port.name} 水手酒館 (Tavern)
              </h2>
              <p className="text-xs text-amber-100/90 mt-0.5">
                酒香瀰漫的熱鬧酒館，各國水手在此暢飲、打聽情報與下注博弈。
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-black/60 border border-amber-500/50 text-amber-300 font-mono text-xs">
              <Beer className="w-3.5 h-3.5" />
              <span>船員士氣: {player.crewMorale}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-700/80 pb-1">
        <button
          onClick={() => {
            sound.playSail();
            setActiveSection('lounge');
          }}
          className={`px-3.5 py-1.5 rounded-t text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeSection === 'lounge'
              ? 'bg-[#243547] text-[#f4d06f] border-t-2 border-x-2 border-[#c5a059]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Beer className="w-3.5 h-3.5" />
          <span>暢飲打聽 & 招募水手</span>
        </button>

        <button
          onClick={() => {
            sound.playSail();
            setActiveSection('officers');
          }}
          className={`px-3.5 py-1.5 rounded-t text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeSection === 'officers'
              ? 'bg-[#243547] text-[#f4d06f] border-t-2 border-x-2 border-[#c5a059]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>聘僱大副與航海士</span>
          <span className="text-[10px] bg-amber-950 px-1.5 py-0.2 rounded-full font-mono text-amber-300">
            {player.hiredOfficers.length}/4
          </span>
        </button>

        <button
          onClick={() => {
            sound.playSail();
            setActiveSection('dice');
          }}
          className={`px-3.5 py-1.5 rounded-t text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeSection === 'dice'
              ? 'bg-[#243547] text-[#f4d06f] border-t-2 border-x-2 border-[#c5a059]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dices className="w-3.5 h-3.5" />
          <span>水手擲骰賭盤 (Minigame)</span>
        </button>
      </div>

      {/* Main Section Content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeSection === 'lounge' && (
          <div className="space-y-4">
            {/* Treat Drinks Block */}
            <div className="bg-[#182636] p-4 rounded-lg border border-[#3b4e63] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Beer className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-amber-100 text-sm">請全場喝大麥酒 (Treat Drinks)</h3>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  豪爽請全酒館水手暢飲！能大幅提振全體船員士氣 (+15%)，並從老水手口中獲取航海傳聞與暴利商路。
                </p>
              </div>

              <button
                onClick={handleTreat}
                disabled={player.gold < 60}
                className="px-4 py-2 rounded bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border border-amber-400 text-amber-100 font-bold text-xs shadow disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap active:translate-y-0.5 cursor-pointer"
              >
                請客暢飲 (60 G)
              </button>
            </div>

            {/* Rumor Display */}
            {currentRumor && (
              <div className="bg-amber-950/40 p-3.5 rounded-lg border border-amber-500/40 flex items-start gap-3 animate-fade-in">
                <MessageSquare className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200 leading-relaxed font-sans">
                  <strong className="text-[#f4d06f]">【酒館傳聞】</strong> {currentRumor}
                </div>
              </div>
            )}

            {/* Recruit Crew Block */}
            <div className="bg-[#182636] p-4 rounded-lg border border-[#3b4e63] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-amber-100 text-sm">招募水手 (Recruit Crew)</h3>
                </div>
                <span className="text-xs font-mono text-slate-300">
                  水手編制: <strong className="text-amber-300">{player.crew}</strong> / {ship.maxCrew} 人 (最低操舵需求: {ship.minCrew} 人)
                </span>
              </div>

              <p className="text-xs text-slate-300">
                每位水手安家費為 25 G。充足的水手可確保遠洋航行速度，並在海戰白刃接舷戰中發揮決定性戰力。
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleRecruit(5)}
                  disabled={neededCrew < 1 || player.gold < 25 * 5}
                  className="px-3 py-1.5 rounded bg-[#2b3c50] hover:bg-[#384e68] border border-slate-600 text-slate-200 text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  招募 5 人 (125 G)
                </button>
                <button
                  onClick={() => handleRecruit(15)}
                  disabled={neededCrew < 1 || player.gold < 25 * 15}
                  className="px-3 py-1.5 rounded bg-[#2b3c50] hover:bg-[#384e68] border border-slate-600 text-slate-200 text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  招募 15 人 (375 G)
                </button>
                <button
                  onClick={() => handleRecruit(neededCrew)}
                  disabled={neededCrew < 1 || player.gold < 25 * neededCrew}
                  className="px-4 py-1.5 rounded bg-cyan-700 hover:bg-cyan-600 border border-cyan-400 text-cyan-100 text-xs font-bold font-mono disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  滿額招募 ({neededCrew} 人 / {neededCrew * 25} G)
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'officers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {OFFICERS.map((officer: Officer) => {
              const isHired = player.hiredOfficers.includes(officer.id);

              return (
                <div
                  key={officer.id}
                  className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between ${
                    isHired
                      ? 'bg-[#1b2b3a] border-emerald-500/60 shadow-emerald-950/50'
                      : 'bg-[#182636] border-[#3b4e63] hover:border-slate-500'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-amber-200 text-sm">{officer.name}</h4>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-black/40 border border-slate-700 text-cyan-300 font-mono">
                        {officer.roleName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {officer.desc}
                    </p>

                    <div className="mt-2.5 p-2 rounded bg-black/30 border border-amber-900/40 text-[11px] text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span>{officer.bonusDesc}</span>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                    <span className="font-mono text-xs text-amber-300 font-bold">
                      聘僱金: {officer.salary.toLocaleString()} G
                    </span>

                    {isHired ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono">
                        <Check className="w-4 h-4" /> 已在艦隊服役
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (player.gold < officer.salary) return;
                          sound.playBell();
                          onHireOfficer(officer.id);
                        }}
                        disabled={player.gold < officer.salary}
                        className="px-3 py-1 rounded bg-amber-700 hover:bg-amber-600 border border-amber-500 text-amber-100 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        簽約僱傭
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeSection === 'dice' && (
          <div className="bg-[#182636] p-4 rounded-lg border border-[#3b4e63] space-y-4 max-w-xl mx-auto text-center">
            <div>
              <h3 className="font-bold font-cinzel text-base text-amber-200">
                水手擲骰賭盤 (Sailor's High-Low Dice)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                預測兩顆骰子總點數：小 (2-6 點, 賠率 2倍) · 幸運七 (剛好 7 點, 賠率 5倍) · 大 (8-12 點, 賠率 2倍)
              </p>
            </div>

            {/* Dice Visual Box */}
            <div className="py-6 flex items-center justify-center gap-6">
              <div className={`w-16 h-16 rounded-xl bg-amber-100 border-2 border-amber-400 text-slate-900 font-black text-3xl flex items-center justify-center shadow-lg transition-transform ${diceRolling ? 'animate-spin' : ''}`}>
                {diceResults ? diceResults[0] : '?'}
              </div>
              <span className="text-2xl font-bold text-amber-400">+</span>
              <div className={`w-16 h-16 rounded-xl bg-amber-100 border-2 border-amber-400 text-slate-900 font-black text-3xl flex items-center justify-center shadow-lg transition-transform ${diceRolling ? 'animate-spin' : ''}`}>
                {diceResults ? diceResults[1] : '?'}
              </div>
            </div>

            {/* Outcome message */}
            {gameOutcome && (
              <div className={`p-2.5 rounded text-xs font-bold font-mono ${gameOutcome.won ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300' : 'bg-red-950/80 border border-red-500 text-red-300'}`}>
                {gameOutcome.msg}
              </div>
            )}

            {/* Prediction Choices */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPrediction('small')}
                className={`py-2 px-3 rounded text-xs font-bold border transition-colors cursor-pointer ${
                  prediction === 'small'
                    ? 'bg-amber-500 border-amber-300 text-slate-950'
                    : 'bg-[#243547] border-slate-600 text-slate-200 hover:border-amber-400'
                }`}
              >
                押【小】 (2-6 點 / 2x)
              </button>
              <button
                onClick={() => setPrediction('seven')}
                className={`py-2 px-3 rounded text-xs font-bold border transition-colors cursor-pointer ${
                  prediction === 'seven'
                    ? 'bg-cyan-500 border-cyan-300 text-slate-950'
                    : 'bg-[#243547] border-slate-600 text-cyan-300 hover:border-cyan-400'
                }`}
              >
                押【幸運 7】 (剛好 7 / 5x)
              </button>
              <button
                onClick={() => setPrediction('big')}
                className={`py-2 px-3 rounded text-xs font-bold border transition-colors cursor-pointer ${
                  prediction === 'big'
                    ? 'bg-amber-500 border-amber-300 text-slate-950'
                    : 'bg-[#243547] border-slate-600 text-slate-200 hover:border-amber-400'
                }`}
              >
                押【大】 (8-12 點 / 2x)
              </button>
            </div>

            {/* Wager Selection & Roll Button */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span>下注籌碼:</span>
                {[50, 100, 250].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setWager(amt)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] cursor-pointer ${
                      wager === amt ? 'bg-amber-600 text-white font-bold' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {amt} G
                  </button>
                ))}
              </div>

              <button
                onClick={rollDiceGame}
                disabled={player.gold < wager || diceRolling}
                className="px-6 py-2 rounded bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border border-amber-400 text-amber-100 font-bold text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {diceRolling ? '搖骰中...' : `擲骰下注 (${wager} G)`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
