import React, { useState, useEffect } from 'react';
import { 
  PlayerState, 
  CombatState, 
  LogMessage, 
  Quest, 
  Discovery, 
  Port 
} from './types/game';
import { PORTS, SHIPS, OFFICERS } from './data/gameData';
import { sound } from './utils/audio';

// Components
import { TopBar } from './components/TopBar';
import { NauticalWorldMap } from './components/NauticalWorldMap';
import { MarketView } from './components/MarketView';
import { TavernView } from './components/TavernView';
import { ShipyardView } from './components/ShipyardView';
import { GuildView } from './components/GuildView';
import { HarborView } from './components/HarborView';
import { SailingView } from './components/SailingView';
import { CombatView } from './components/CombatView';
import { LogPanel } from './components/LogPanel';
import { CaptainModal } from './components/CaptainModal';

import { 
  Building2, 
  Beer, 
  Hammer, 
  Crown, 
  Anchor, 
  Map, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

const SAVE_KEY = 'uncharted_waters_azure_horizon_save';

const INITIAL_PLAYER_STATE: PlayerState = {
  name: '阿爾貝托・卡斯提爾 (Alberto)',
  title: '初級冒險家',
  gold: 2800,
  fame: 180,
  date: { year: 1522, month: 5, day: 20 },
  currentPort: 'lisbon',
  isSailing: false,
  sailingInfo: null,
  shipType: 'caravel',
  shipHp: 100,
  shipRefit: { cannonRefit: 0, hullReinforced: false, expandedHold: false },
  crew: 20,
  crewMorale: 85,
  supplies: { rations: 35, ammo: 25, timber: 5 },
  cargo: {},
  hiredOfficers: [],
  acceptedQuest: null,
  completedQuestsCount: 0,
  unlockedDiscoveries: [],
  portInvestments: {}
};

export default function App() {
  const [player, setPlayer] = useState<PlayerState>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return INITIAL_PLAYER_STATE;
  });

  const [currentView, setCurrentView] = useState<'market' | 'tavern' | 'shipyard' | 'guild' | 'harbor' | 'map'>('market');
  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [isCaptainModalOpen, setIsCaptainModalOpen] = useState(false);
  const [selectedMapDestination, setSelectedMapDestination] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [ambientWaves, setAmbientWaves] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);

  const [logs, setLogs] = useState<LogMessage[]>([
    {
      id: 'init-1',
      time: '1522-05-20 08:00',
      text: '⚓ 歡迎來到《大航海時代：蔚藍航路》！你身處葡萄牙里斯本港，揚帆啟航探索未知海域吧！',
      type: 'gold'
    }
  ]);

  // Helper to append log entry
  const addLog = (text: string, type: 'normal' | 'gold' | 'danger' | 'success' | 'combat' | 'rumor' = 'normal') => {
    const timeStr = `${player.date.year}-${String(player.date.month).padStart(2, '0')}-${String(player.date.day).padStart(2, '0')}`;
    const newEntry: LogMessage = {
      id: `${Date.now()}-${Math.random()}`,
      time: timeStr,
      text,
      type
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
  };

  // Sound and ambient controls
  const handleToggleMute = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
  };

  const handleToggleAmbient = () => {
    const nextState = !ambientWaves;
    setAmbientWaves(nextState);
    sound.toggleAmbient(nextState);
  };

  // Auto-save progress
  const saveGame = () => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(player));
      addLog('💾 航海進度已妥善存檔至本地紀錄中。', 'success');
    } catch {
      addLog('⚠️ 存檔失敗，請確認瀏覽器儲存空間。', 'danger');
    }
  };

  const resetGame = () => {
    localStorage.removeItem(SAVE_KEY);
    setPlayer(INITIAL_PLAYER_STATE);
    setCombatState(null);
    setIsCaptainModalOpen(false);
    setCurrentView('market');
    addLog('🔄 重新開啟了一段嶄新的航海傳奇生涯！', 'gold');
  };

  // 1. Market handlers
  const handleBuyGoods = (itemId: string, itemName: string, unitPrice: number, count: number) => {
    const totalCost = unitPrice * count;
    if (player.gold < totalCost) return;

    sound.playCoin();
    setPlayer((prev) => {
      const port = PORTS[prev.currentPort];
      const existing = prev.cargo[itemName] || { count: 0, buyPrice: unitPrice, buyPort: port.name };
      const newTotalCount = existing.count + count;
      const weightedPrice = Math.round((existing.buyPrice * existing.count + unitPrice * count) / newTotalCount);

      return {
        ...prev,
        gold: prev.gold - totalCost,
        cargo: {
          ...prev.cargo,
          [itemName]: {
            count: newTotalCount,
            buyPrice: weightedPrice,
            buyPort: port.name
          }
        }
      };
    });

    addLog(`在交易所購入了 ${count} 箱【${itemName}】，總計花費 ${totalCost.toLocaleString()} G。`, 'gold');
  };

  const handleSellGoods = (itemName: string, unitPrice: number, count: number) => {
    const cargo = player.cargo[itemName];
    if (!cargo || cargo.count < count) return;

    const totalIncome = unitPrice * count;
    sound.playCoin();

    setPlayer((prev) => {
      const nextCargo = { ...prev.cargo };
      const current = nextCargo[itemName];
      if (current.count <= count) {
        delete nextCargo[itemName];
      } else {
        nextCargo[itemName] = { ...current, count: current.count - count };
      }

      return {
        ...prev,
        gold: prev.gold + totalIncome,
        cargo: nextCargo
      };
    });

    const profitUnit = unitPrice - cargo.buyPrice;
    const profitText = profitUnit >= 0 ? `每箱淨賺 +${profitUnit} G` : `折價虧損 ${profitUnit} G`;
    addLog(`成功售出 ${count} 箱【${itemName}】，收得金幣 ${totalIncome.toLocaleString()} G (${profitText})！`, 'success');
  };

  const handleInvestPort = (amount: number) => {
    if (player.gold < amount) return;
    setPlayer((prev) => {
      const currentInv = prev.portInvestments[prev.currentPort] || 0;
      return {
        ...prev,
        gold: prev.gold - amount,
        fame: prev.fame + 50,
        portInvestments: {
          ...prev.portInvestments,
          [prev.currentPort]: currentInv + amount
        }
      };
    });
    addLog(`對【${PORTS[player.currentPort].name}】投資了 ${amount.toLocaleString()} G，商港發展繁榮度提升！聲望 +50。`, 'gold');
  };

  // 2. Tavern handlers
  const handleTreatDrinks = () => {
    setPlayer((prev) => ({
      ...prev,
      gold: Math.max(0, prev.gold - 60),
      crewMorale: Math.min(100, prev.crewMorale + 15)
    }));
    addLog('請全酒館好漢豪飲大麥酒！船員們放聲歌唱，全船士氣大幅提升至 ' + Math.min(100, player.crewMorale + 15) + '%！', 'gold');
  };

  const handleRecruitCrew = (count: number) => {
    const cost = count * 25;
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      crew: prev.crew + count
    }));
    addLog(`在酒館成功招募了 ${count} 名身強體壯的水手入伍服役！`, 'normal');
  };

  const handleHireOfficer = (officerId: string) => {
    const officer = OFFICERS.find((o) => o.id === officerId);
    if (!officer || player.gold < officer.salary) return;

    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold - officer.salary,
      fame: prev.fame + 80,
      hiredOfficers: [...prev.hiredOfficers, officerId]
    }));
    addLog(`🎉 成功禮聘【${officer.name}】加入船隊擔任 ${officer.roleName}！`, 'success');
  };

  const handleDiceGameResult = (wager: number, winAmount: number, isWin: boolean) => {
    setPlayer((prev) => ({
      ...prev,
      gold: isWin ? prev.gold + (winAmount - wager) : prev.gold - wager,
      crewMorale: isWin ? Math.min(100, prev.crewMorale + 5) : Math.max(10, prev.crewMorale - 2)
    }));
    if (isWin) {
      addLog(`在酒館骰子賭局中大顯身手，贏得了 ${winAmount} G！`, 'gold');
    }
  };

  // 3. Shipyard handlers
  const handleRepairShip = (cost: number, useTimber: boolean) => {
    const ship = SHIPS[player.shipType];
    const maxHp = Math.floor(ship.maxHp * (player.shipRefit.hullReinforced ? 1.25 : 1));

    if (useTimber) {
      const timberNeeded = Math.ceil((maxHp - player.shipHp) / 15);
      setPlayer((prev) => ({
        ...prev,
        shipHp: maxHp,
        supplies: {
          ...prev.supplies,
          timber: Math.max(0, prev.supplies.timber - timberNeeded)
        }
      }));
      addLog(`使用 ${timberNeeded} 塊備用硬木板修整完畢，旗艦船體耐久完全恢復！`, 'success');
    } else {
      setPlayer((prev) => ({
        ...prev,
        gold: prev.gold - cost,
        shipHp: maxHp
      }));
      addLog(`造船廠師傅精心檢修完畢，船身耐久度恢復至 ${maxHp} 點！`, 'success');
    }
  };

  const handleBuyShip = (shipId: string, cost: number) => {
    const newShip = SHIPS[shipId];
    if (!newShip || player.gold < cost) return;

    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      fame: prev.fame + 200,
      shipType: shipId,
      shipHp: newShip.maxHp,
      crew: Math.min(prev.crew, newShip.maxCrew),
      shipRefit: { cannonRefit: 0, hullReinforced: false, expandedHold: false }
    }));
    addLog(`🎉 恭喜！你購入了全新的雄偉旗艦【${newShip.name}】！揚帆馳騁七海！`, 'gold');
  };

  const handleUpgradeRefit = (type: 'hull' | 'cannon' | 'hold', cost: number) => {
    if (player.gold < cost) return;
    setPlayer((prev) => {
      const refit = { ...prev.shipRefit };
      if (type === 'hull') refit.hullReinforced = true;
      else if (type === 'cannon') refit.cannonRefit += 4;
      else if (type === 'hold') refit.expandedHold = true;

      return {
        ...prev,
        gold: prev.gold - cost,
        shipRefit: refit
      };
    });
    addLog(`造船廠順利完成了艦體專業改裝項目！`, 'success');
  };

  // 4. Guild handlers
  const handleAcceptQuest = (quest: Quest) => {
    setPlayer((prev) => ({
      ...prev,
      acceptedQuest: quest
    }));
    addLog(`接取了總督府懸賞公會委託：【${quest.title}】！`, 'gold');
  };

  const handleSubmitQuest = () => {
    if (!player.acceptedQuest) return;
    const q = player.acceptedQuest;

    setPlayer((prev) => {
      const nextCargo = { ...prev.cargo };
      // Deduct target items if trade quest
      if (q.id === 'spice_fever') {
        let need = 12;
        if ((nextCargo['馬拉巴爾黑胡椒']?.count || 0) >= need) {
          nextCargo['馬拉巴爾黑胡椒'].count -= need;
        } else {
          const avail = nextCargo['馬拉巴爾黑胡椒']?.count || 0;
          if (nextCargo['馬拉巴爾黑胡椒']) delete nextCargo['馬拉巴爾黑胡椒'];
          need -= avail;
          if (nextCargo['班達肉豆蔻']) nextCargo['班達肉豆蔻'].count -= need;
        }
      } else if (q.id === 'london_luxury') {
        let need = 5;
        if ((nextCargo['蒔繪漆器']?.count || 0) >= need) {
          nextCargo['蒔繪漆器'].count -= need;
        } else {
          const avail = nextCargo['蒔繪漆器']?.count || 0;
          if (nextCargo['蒔繪漆器']) delete nextCargo['蒔繪漆器'];
          need -= avail;
          if (nextCargo['熱那亞天鵝絨']) nextCargo['熱那亞天鵝絨'].count -= need;
        }
      } else if (q.id === 'ivory_trade') {
        if (nextCargo['精雕象牙']) nextCargo['精雕象牙'].count -= 8;
      }

      return {
        ...prev,
        gold: prev.gold + q.rewardGold,
        fame: prev.fame + q.rewardFame,
        acceptedQuest: null,
        completedQuestsCount: prev.completedQuestsCount + 1,
        cargo: nextCargo
      };
    });

    addLog(`🎉 圓滿達成公會委託！領取王室懸賞賞金 ${q.rewardGold.toLocaleString()} G，聲望上升 ${q.rewardFame} 點！`, 'success');
  };

  const handleAppraiseDiscovery = (discovery: Discovery) => {
    setPlayer((prev) => ({
      ...prev,
      fame: prev.fame + discovery.fameValue,
      gold: prev.gold + discovery.fameValue * 4,
      unlockedDiscoveries: [...prev.unlockedDiscoveries, discovery.id]
    }));
    addLog(`🏛️ 向各國皇家學者呈報了古代奇蹟【${discovery.name}】！獲得王室獎賞 ${discovery.fameValue * 4} G 及 ${discovery.fameValue} 點聲望！`, 'gold');
  };

  // 5. Harbor & Sailing handlers
  const handleBuySupplies = (rationsDays: number, ammoCount: number, timberCount: number, totalCost: number) => {
    if (player.gold < totalCost) return;
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold - totalCost,
      supplies: {
        rations: prev.supplies.rations + rationsDays,
        ammo: prev.supplies.ammo + ammoCount,
        timber: prev.supplies.timber + timberCount
      }
    }));
    addLog(`採購了遠洋補給物資 (淡水糧草 +${rationsDays} 天, 砲彈 +${ammoCount}, 木材 +${timberCount})。`, 'normal');
  };

  const handleSetSail = (destinationPortId: string, totalDays: number) => {
    setPlayer((prev) => ({
      ...prev,
      isSailing: true,
      sailingInfo: {
        origin: prev.currentPort,
        destination: destinationPortId,
        totalDays,
        currentDay: 0,
        weather: 'favorable_wind',
        windDir: 'SE'
      }
    }));
    addLog(`⛵ 旗艦拔錨啟航！全艦向目標港口【${PORTS[destinationPortId].name}】全速航行！預計航程 ${totalDays} 天。`, 'gold');
  };

  // Sailing day advancement
  const handleAdvanceSailingDay = () => {
    setPlayer((prev) => {
      if (!prev.sailingInfo) return prev;
      const nextDay = prev.sailingInfo.currentDay + 1;
      const nextRations = Math.max(0, prev.supplies.rations - 1);

      // Starvation damage if supplies dry up
      let lostCrew = 0;
      let nextCrew = prev.crew;
      let nextMorale = Math.max(10, prev.crewMorale - 2);

      if (nextRations <= 0) {
        lostCrew = Math.min(nextCrew, 2);
        nextCrew -= lostCrew;
        nextMorale = Math.max(5, nextMorale - 10);
      }

      // Calendar day advancement
      let d = prev.date.day + 1;
      let m = prev.date.month;
      let y = prev.date.year;
      if (d > 30) {
        d = 1;
        m += 1;
        if (m > 12) {
          m = 1;
          y += 1;
        }
      }

      if (nextCrew <= 0) {
        setGameOverReason('船上淡水糧草耗盡引發全艦壞血病，無人操舵，旗艦失事沉沒於茫茫大海...');
      }

      return {
        ...prev,
        date: { year: y, month: m, day: d },
        crew: nextCrew,
        crewMorale: nextMorale,
        supplies: {
          ...prev.supplies,
          rations: nextRations
        },
        sailingInfo: {
          ...prev.sailingInfo,
          currentDay: nextDay
        }
      };
    });
  };

  // Random Sea Events
  const handleTriggerSeaEvent = (event: 'storm' | 'dolphins' | 'flotsam') => {
    setPlayer((prev) => {
      if (event === 'storm') {
        const hasMaria = prev.hiredOfficers.includes('maria');
        const dmg = hasMaria ? 12 : Math.floor(Math.random() * 20) + 15;
        const remainingHp = Math.max(1, prev.shipHp - dmg);
        addLog(`⛈️ 巨浪猛烈拍擊船身！旗艦受到 ${dmg} 點風浪損害！`, 'danger');
        return { ...prev, shipHp: remainingHp };
      } else if (event === 'dolphins') {
        addLog('🐬 蔚藍海豚伴隨船首跳躍，水手群情振奮！士氣 +10%！', 'success');
        return { ...prev, crewMorale: Math.min(100, prev.crewMorale + 10) };
      } else if (event === 'flotsam') {
        const foundGold = 350 + Math.floor(Math.random() * 450);
        addLog(`📦 撈起遠洋沈船漂流箱！拾獲貴重金幣 ${foundGold} G！`, 'gold');
        return { ...prev, gold: prev.gold + foundGold };
      }
      return prev;
    });
  };

  // Trigger Pirate Combat
  const handleTriggerCombat = () => {
    const enemyTypes = [
      { name: '巴巴里海盜巡防艦', cannons: 14, maxHp: 160, crew: 45 },
      { name: '西印度掠奪者艦隊', cannons: 20, maxHp: 240, crew: 75 },
      { name: '黑旗私掠船「復仇號」', cannons: 18, maxHp: 210, crew: 60 }
    ];
    const picked = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

    setCombatState({
      targetKey: player.sailingInfo?.destination || 'lisbon',
      totalDays: player.sailingInfo?.totalDays || 5,
      currentDay: player.sailingInfo?.currentDay || 1,
      enemyName: picked.name,
      enemyShipType: 'Corsair Frigate',
      enemyHp: picked.maxHp,
      enemyMaxHp: picked.maxHp,
      enemyCrew: picked.crew,
      enemyCannons: picked.cannons,
      enemyType: 'pirate',
      playerTurn: true,
      round: 1,
      logs: ['⚔️ 海盜戰艦封鎖了迎風航道，兩艦距離 200 碼，戰鬥開始！']
    });

    addLog(`⚔️ 警報！遭遇【${picked.name}】攔截突襲！進入海上砲戰！`, 'combat');
  };

  // Combat Turn Resolution
  const handlePlayerCombatAction = (action: 'fire' | 'board' | 'maneuver' | 'flee') => {
    if (!combatState) return;

    const ship = SHIPS[player.shipType];
    const cannons = ship.cannons + player.shipRefit.cannonRefit;
    const hasVasco = player.hiredOfficers.includes('vasco');
    const hasPedro = player.hiredOfficers.includes('pedro');

    let currentEnemyHp = combatState.enemyHp;
    let currentEnemyCrew = combatState.enemyCrew;
    let nextPlayerHp = player.shipHp;
    let nextPlayerCrew = player.crew;
    let combatEnded = false;
    let victory = false;

    const newLogs = [...combatState.logs];

    if (action === 'fire') {
      const baseDmg = cannons * (Math.floor(Math.random() * 8) + 6);
      const dmg = hasVasco ? Math.floor(baseDmg * 1.35) : baseDmg;
      currentEnemyHp = Math.max(0, currentEnemyHp - dmg);
      newLogs.unshift(`💥 我方側舷火砲齊射！砲彈呼嘯命中敵艦，造成 ${dmg} 點致命破壞！`);
    } else if (action === 'board') {
      const crewLost = Math.floor(Math.random() * 3) + 1;
      const enemyLostBase = Math.floor(player.crew * 0.7) + 6;
      const enemyLost = hasPedro ? Math.floor(enemyLostBase * 1.25) : enemyLostBase;

      nextPlayerCrew = Math.max(1, nextPlayerCrew - crewLost);
      currentEnemyCrew = Math.max(0, currentEnemyCrew - enemyLost);
      currentEnemyHp = Math.max(0, currentEnemyHp - (enemyLost * 2));
      newLogs.unshift(`⚔️ 水手們擲出飛鉤接舷跳幫肉搏！斬殺敵水手 ${enemyLost} 人，我方損失 ${crewLost} 人。`);
    } else if (action === 'maneuver') {
      newLogs.unshift(`🎯 搶佔上風處航線，主帆微調迎風轉向，下一輪轟擊爆擊率上升！`);
    } else if (action === 'flee') {
      if (Math.random() < 0.65) {
        newLogs.unshift(`💨 升起滿帆藉由側順風成功甩開海盜船追擊！脫離交戰！`);
        sound.playSail();
        setCombatState(null);
        addLog('成功藉助順風甩開了海盜船的追擊，繼續航行！', 'success');
        return;
      } else {
        newLogs.unshift(`💨 敵艦轉向攔截，脫離失敗！被敵艦咬住航向！`);
      }
    }

    // Check enemy sunk
    if (currentEnemyHp <= 0 || currentEnemyCrew <= 0) {
      sound.playFanfare();
      const lootGold = 1200 + Math.floor(Math.random() * 1800);
      const lootFame = 180;
      setPlayer((prev) => ({
        ...prev,
        gold: prev.gold + lootGold,
        fame: prev.fame + lootFame,
        crew: nextPlayerCrew,
        supplies: {
          ...prev.supplies,
          ammo: prev.supplies.ammo + 10
        }
      }));
      addLog(`🎉 大捷！敵艦【${combatState.enemyName}】被擊沉入海！搜括戰利品獲得 ${lootGold.toLocaleString()} G 及 ${lootFame} 聲望！`, 'success');
      setCombatState(null);
      return;
    }

    // Enemy Retaliation Attack
    const enemyDmg = Math.floor(Math.random() * 20) + 10;
    nextPlayerHp = Math.max(0, nextPlayerHp - enemyDmg);
    newLogs.unshift(`💥 敵艦側舷火網還擊！我方旗艦受到 ${enemyDmg} 點船身損害！`);

    if (nextPlayerHp <= 0) {
      setGameOverReason('旗艦在激烈的海戰砲火中主桅折斷被擊沉，你的航海傳奇在此落幕...');
      setCombatState(null);
      return;
    }

    // Update state for next round
    setPlayer((prev) => ({
      ...prev,
      shipHp: nextPlayerHp,
      crew: nextPlayerCrew
    }));

    setCombatState({
      ...combatState,
      enemyHp: currentEnemyHp,
      enemyCrew: currentEnemyCrew,
      round: combatState.round + 1,
      logs: newLogs
    });
  };

  // Arrive at destination port
  const handleArrivePort = () => {
    if (!player.sailingInfo) return;
    const destId = player.sailingInfo.destination;
    const destPort = PORTS[destId];

    setPlayer((prev) => ({
      ...prev,
      isSailing: false,
      currentPort: destId,
      sailingInfo: null
    }));

    setCurrentView('market');
    addLog(`⛵ 船隊順利靠岸！抵達傳奇港灣【${destPort.name}】！入港整休！`, 'success');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0c141e] text-[#e0e6ed] select-none font-sans">
      {/* Top Status Bar */}
      <TopBar
        player={player}
        onOpenCaptain={() => setIsCaptainModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        ambientWaves={ambientWaves}
        onToggleAmbient={handleToggleAmbient}
      />

      {/* Main Game Container */}
      <main className="flex-1 flex overflow-hidden p-2 md:p-3 gap-2 md:gap-3">
        {/* Left Nautical Facility Navigation Panel */}
        <aside className="w-44 md:w-56 flex flex-col gap-2 shrink-0 select-none">
          <div className="bg-[#121c27] p-2 rounded-lg border border-[#c5a059]/40 flex flex-col gap-1.5 shadow-lg">
            <div className="text-[10px] font-cinzel font-bold text-[#c5a059] tracking-wider px-2 py-0.5">
              PORT FACILITIES
            </div>

            <button
              onClick={() => {
                sound.playSail();
                setCurrentView('market');
              }}
              disabled={player.isSailing || !!combatState}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-xs transition-all text-left cursor-pointer ${
                currentView === 'market' && !player.isSailing && !combatState
                  ? 'bg-[#c5a059] text-slate-950 font-bold shadow-md'
                  : 'text-[#f4d06f] hover:bg-[#1f2d3d] disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>交易所 (Market)</span>
            </button>

            <button
              onClick={() => {
                sound.playSail();
                setCurrentView('tavern');
              }}
              disabled={player.isSailing || !!combatState}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-xs transition-all text-left cursor-pointer ${
                currentView === 'tavern' && !player.isSailing && !combatState
                  ? 'bg-[#c5a059] text-slate-950 font-bold shadow-md'
                  : 'text-[#f4d06f] hover:bg-[#1f2d3d] disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Beer className="w-4 h-4 shrink-0" />
              <span>水手酒館 (Tavern)</span>
            </button>

            <button
              onClick={() => {
                sound.playSail();
                setCurrentView('shipyard');
              }}
              disabled={player.isSailing || !!combatState}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-xs transition-all text-left cursor-pointer ${
                currentView === 'shipyard' && !player.isSailing && !combatState
                  ? 'bg-[#c5a059] text-slate-950 font-bold shadow-md'
                  : 'text-[#f4d06f] hover:bg-[#1f2d3d] disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Hammer className="w-4 h-4 shrink-0" />
              <span>造船廠 (Shipyard)</span>
            </button>

            <button
              onClick={() => {
                sound.playSail();
                setCurrentView('guild');
              }}
              disabled={player.isSailing || !!combatState}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-xs transition-all text-left cursor-pointer ${
                currentView === 'guild' && !player.isSailing && !combatState
                  ? 'bg-[#c5a059] text-slate-950 font-bold shadow-md'
                  : 'text-[#f4d06f] hover:bg-[#1f2d3d] disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Crown className="w-4 h-4 shrink-0" />
              <span>總督府/公會 (Guild)</span>
            </button>

            <button
              onClick={() => {
                sound.playSail();
                setCurrentView('harbor');
              }}
              disabled={player.isSailing || !!combatState}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-xs transition-all text-left cursor-pointer ${
                currentView === 'harbor' && !player.isSailing && !combatState
                  ? 'bg-[#c5a059] text-slate-950 font-bold shadow-md'
                  : 'text-[#f4d06f] hover:bg-[#1f2d3d] disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Anchor className="w-4 h-4 shrink-0" />
              <span>碼頭出港 (Sail)</span>
            </button>

            <button
              onClick={() => {
                sound.playSail();
                setCurrentView('map');
              }}
              disabled={!!combatState}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-xs transition-all text-left cursor-pointer ${
                currentView === 'map' && !combatState
                  ? 'bg-[#c5a059] text-slate-950 font-bold shadow-md'
                  : 'text-[#f4d06f] hover:bg-[#1f2d3d] disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Map className="w-4 h-4 shrink-0" />
              <span>世界海圖 (Chart)</span>
            </button>
          </div>

          {/* Quick World Map Mini-View in Port */}
          <div className="flex-1 rounded-lg border border-[#c5a059]/30 overflow-hidden hidden md:block">
            <NauticalWorldMap
              currentPortId={player.currentPort}
              isSailing={player.isSailing}
              sailingInfo={player.sailingInfo}
              selectedDestination={selectedMapDestination}
            />
          </div>
        </aside>

        {/* Center / Right Content Panel */}
        <section className="flex-1 flex flex-col min-w-0 bg-[#121c27] rounded-lg border-2 border-[#c5a059]/40 overflow-hidden shadow-2xl p-3 md:p-4">
          {/* If Combat active */}
          {combatState ? (
            <CombatView
              player={player}
              combat={combatState}
              onPlayerAction={handlePlayerCombatAction}
            />
          ) : player.isSailing ? (
            <SailingView
              player={player}
              onAdvanceDay={handleAdvanceSailingDay}
              onTriggerCombat={handleTriggerCombat}
              onTriggerEvent={handleTriggerSeaEvent}
              onArrivePort={handleArrivePort}
            />
          ) : (
            <>
              {currentView === 'market' && (
                <MarketView
                  player={player}
                  onBuy={handleBuyGoods}
                  onSell={handleSellGoods}
                  onInvest={handleInvestPort}
                />
              )}

              {currentView === 'tavern' && (
                <TavernView
                  player={player}
                  onTreatDrinks={handleTreatDrinks}
                  onRecruitCrew={handleRecruitCrew}
                  onHireOfficer={handleHireOfficer}
                  onDiceGameResult={handleDiceGameResult}
                />
              )}

              {currentView === 'shipyard' && (
                <ShipyardView
                  player={player}
                  onRepair={handleRepairShip}
                  onBuyShip={handleBuyShip}
                  onUpgradeRefit={handleUpgradeRefit}
                />
              )}

              {currentView === 'guild' && (
                <GuildView
                  player={player}
                  onAcceptQuest={handleAcceptQuest}
                  onSubmitQuest={handleSubmitQuest}
                  onAppraiseDiscovery={handleAppraiseDiscovery}
                />
              )}

              {currentView === 'harbor' && (
                <HarborView
                  player={player}
                  onBuySupplies={handleBuySupplies}
                  onSetSail={handleSetSail}
                  onSelectMapDestination={(portId) => setSelectedMapDestination(portId)}
                  selectedDestination={selectedMapDestination}
                />
              )}

              {currentView === 'map' && (
                <div className="flex flex-col h-full space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold font-cinzel text-amber-200 text-sm">
                      大航海時代・十六世紀全球航路全圖 (World Chart)
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      點選各港口可於右側檢視各商港特產與里程
                    </span>
                  </div>
                  <div className="flex-1 w-full rounded-lg overflow-hidden border border-[#c5a059]/40">
                    <NauticalWorldMap
                      currentPortId={player.currentPort}
                      isSailing={player.isSailing}
                      sailingInfo={player.sailingInfo}
                      onSelectPort={(portId) => setSelectedMapDestination(portId)}
                      selectedDestination={selectedMapDestination}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Bottom Historical Logbook */}
      <footer className="shrink-0">
        <LogPanel logs={logs} />
      </footer>

      {/* Captain Dossier Modal */}
      {isCaptainModalOpen && (
        <CaptainModal
          player={player}
          onClose={() => setIsCaptainModalOpen(false)}
          onSaveGame={saveGame}
          onResetGame={resetGame}
        />
      )}

      {/* Game Over Modal */}
      {gameOverReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none">
          <div className="max-w-md w-full p-6 rounded-xl bg-[#1a0f12] border-2 border-red-600 text-center space-y-4 shadow-2xl">
            <h2 className="text-2xl font-bold font-cinzel text-red-500">
              GAME OVER
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {gameOverReason}
            </p>
            <button
              onClick={() => {
                setGameOverReason(null);
                resetGame();
              }}
              className="px-6 py-2.5 rounded bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              重新開啟新的航海生涯
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
