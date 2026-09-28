import { Port, ShipType, Officer, Quest, Discovery } from '../types/game';

export const PORTS: Record<string, Port> = {
  lisbon: {
    id: 'lisbon',
    name: '里斯本',
    englishName: 'Lisbon',
    nation: 'Portugal',
    region: 'Iberia',
    desc: '葡萄牙王國的繁榮王都，特茹河入海口的大航海探險起點，無數冒險家在此揚帆遠征。',
    xPercent: 18,
    yPercent: 36,
    investment: 0,
    market: [
      { id: 'olive_oil', name: '橄欖油', category: 'food', basePrice: 32, stock: 120, isSpecialty: true },
      { id: 'wine', name: '波特紅酒', category: 'food', basePrice: 48, stock: 100, isSpecialty: true },
      { id: 'musket', name: '火繩槍', category: 'weapon', basePrice: 220, stock: 45, isSpecialty: true },
      { id: 'salt', name: '海鹽', category: 'food', basePrice: 18, stock: 150 },
    ],
    distances: {
      seville: 2,
      london: 5,
      amsterdam: 6,
      genoa: 5,
      alexandria: 7,
      calicut: 15,
      malacca: 22,
      nagasaki: 32
    }
  },
  seville: {
    id: 'seville',
    name: '塞維爾',
    englishName: 'Seville',
    nation: 'Spain',
    region: 'Iberia',
    desc: '西班牙帝國西印度事務局所在地，聚集了新大陸的黃金情報與豪邁的卡斯提爾水手。',
    xPercent: 21,
    yPercent: 40,
    investment: 0,
    market: [
      { id: 'iron_ore', name: '鐵礦石', category: 'metal', basePrice: 42, stock: 110, isSpecialty: true },
      { id: 'sherry', name: '雪莉酒', category: 'food', basePrice: 45, stock: 95 },
      { id: 'armour', name: '鍛鐵胸甲', category: 'weapon', basePrice: 260, stock: 35, isSpecialty: true },
      { id: 'mercury', name: '水銀', category: 'metal', basePrice: 130, stock: 50, unlockInvestment: 3000 }
    ],
    distances: {
      lisbon: 2,
      london: 6,
      amsterdam: 7,
      genoa: 4,
      alexandria: 6,
      calicut: 16,
      malacca: 23,
      nagasaki: 33
    }
  },
  london: {
    id: '倫敦',
    name: '倫敦',
    englishName: 'London',
    nation: 'England',
    region: 'Northern Europe',
    desc: '泰晤士河畔的霧都大港，皇家海軍與商船會所林立，以頂級毛織品與陳年威士忌聞名。',
    xPercent: 22,
    yPercent: 22,
    investment: 0,
    market: [
      { id: 'wool', name: '優質羊毛', category: 'fabric', basePrice: 40, stock: 140, isSpecialty: true },
      { id: 'tin', name: '康沃爾錫礦', category: 'metal', basePrice: 65, stock: 80, isSpecialty: true },
      { id: 'whisky', name: '麥芽威士忌', category: 'food', basePrice: 75, stock: 70, isSpecialty: true },
      { id: 'cannon_iron', name: '鑄鐵巨砲', category: 'weapon', basePrice: 450, stock: 20, unlockInvestment: 5000 }
    ],
    distances: {
      lisbon: 5,
      seville: 6,
      amsterdam: 2,
      genoa: 7,
      alexandria: 9,
      calicut: 18,
      malacca: 25,
      nagasaki: 35
    }
  },
  amsterdam: {
    id: 'amsterdam',
    name: '阿姆斯特丹',
    englishName: 'Amsterdam',
    nation: 'Netherlands',
    region: 'Northern Europe',
    desc: '低地國家的繁榮運河商都，東印度公司的發源地，匯聚全世界精細工藝與金融借貸。',
    xPercent: 25,
    yPercent: 23,
    investment: 0,
    market: [
      { id: 'cheese', name: '高達乳酪', category: 'food', basePrice: 28, stock: 130 },
      { id: 'linen', name: '精細亞麻布', category: 'fabric', basePrice: 55, stock: 90, isSpecialty: true },
      { id: 'glassware', name: '水晶玻璃杯', category: 'luxury', basePrice: 110, stock: 50, isSpecialty: true },
      { id: 'diamond', name: '切割鑽石', category: 'luxury', basePrice: 650, stock: 15, unlockInvestment: 8000 }
    ],
    distances: {
      lisbon: 6,
      seville: 7,
      london: 2,
      genoa: 8,
      alexandria: 10,
      calicut: 19,
      malacca: 26,
      nagasaki: 36
    }
  },
  genoa: {
    id: 'genoa',
    name: '熱那亞',
    englishName: 'Genoa',
    nation: 'Independent',
    region: 'Mediterranean',
    desc: '利古里亞海的明珠，航海家哥倫布的故鄉，富可敵國的商人銀行與地中海白銀航道樞紐。',
    xPercent: 29,
    yPercent: 35,
    investment: 0,
    market: [
      { id: 'silver', name: '精煉白銀', category: 'luxury', basePrice: 180, stock: 65, isSpecialty: true },
      { id: 'velvet', name: '熱那亞天鵝絨', category: 'fabric', basePrice: 140, stock: 75, isSpecialty: true },
      { id: 'coral', name: '地中海紅珊瑚', category: 'luxury', basePrice: 280, stock: 40, isSpecialty: true },
      { id: 'leather', name: '工藝皮革', category: 'fabric', basePrice: 50, stock: 100 }
    ],
    distances: {
      lisbon: 5,
      seville: 4,
      london: 7,
      amsterdam: 8,
      alexandria: 4,
      calicut: 13,
      malacca: 20,
      nagasaki: 30
    }
  },
  alexandria: {
    id: 'alexandria',
    name: '亞歷山大',
    englishName: 'Alexandria',
    nation: 'Ottoman',
    region: 'Mediterranean',
    desc: '古代世界奇蹟聚集的尼羅河門戶，東方陸上絲路與紅海香料的古老交匯點。',
    xPercent: 40,
    yPercent: 43,
    investment: 0,
    market: [
      { id: 'cotton', name: '埃及長絨棉', category: 'fabric', basePrice: 45, stock: 120 },
      { id: 'ivory', name: '精雕象牙', category: 'luxury', basePrice: 320, stock: 35, isSpecialty: true },
      { id: 'incense', name: '乳香脂', category: 'spice', basePrice: 180, stock: 55, isSpecialty: true },
      { id: 'damascus_steel', name: '大馬士革鋼刀', category: 'weapon', basePrice: 420, stock: 25, unlockInvestment: 6000 }
    ],
    distances: {
      lisbon: 7,
      seville: 6,
      london: 9,
      amsterdam: 10,
      genoa: 4,
      calicut: 10,
      malacca: 17,
      nagasaki: 27
    }
  },
  calicut: {
    id: 'calicut',
    name: '卡利卡特',
    englishName: 'Calicut',
    nation: 'Independent',
    region: 'India',
    desc: '印度馬拉巴爾海岸的「香料之都」，達伽馬首航登陸地，黑色黃金（黑胡椒）的源泉。',
    xPercent: 62,
    yPercent: 55,
    investment: 0,
    market: [
      { id: 'pepper', name: '馬拉巴爾黑胡椒', category: 'spice', basePrice: 60, stock: 200, isSpecialty: true },
      { id: 'cardamom', name: '綠豆蔻', category: 'spice', basePrice: 85, stock: 120, isSpecialty: true },
      { id: 'raw_silk', name: '印度生絲', category: 'fabric', basePrice: 150, stock: 80, isSpecialty: true },
      { id: 'ruby', name: '星彩紅寶石', category: 'luxury', basePrice: 580, stock: 20, unlockInvestment: 7500 }
    ],
    distances: {
      lisbon: 15,
      seville: 16,
      london: 18,
      amsterdam: 19,
      genoa: 13,
      alexandria: 10,
      malacca: 8,
      nagasaki: 18
    }
  },
  malacca: {
    id: 'malacca',
    name: '馬六甲',
    englishName: 'Malacca',
    nation: 'Independent',
    region: 'Southeast Asia',
    desc: '扼守東南亞海峽的黃金咽喉，連接印度洋與太平洋的重鎮，傳奇香料群島的集散地。',
    xPercent: 78,
    yPercent: 64,
    investment: 0,
    market: [
      { id: 'nutmeg', name: '班達肉豆蔻', category: 'spice', basePrice: 75, stock: 160, isSpecialty: true },
      { id: 'agarwood', name: '極品沉香木', category: 'luxury', basePrice: 400, stock: 45, isSpecialty: true },
      { id: 'clove', name: '丁香', category: 'spice', basePrice: 90, stock: 130, isSpecialty: true },
      { id: 'birds_nest', name: '金絲燕窩', category: 'food', basePrice: 380, stock: 30, unlockInvestment: 6500 }
    ],
    distances: {
      lisbon: 22,
      seville: 23,
      london: 25,
      amsterdam: 26,
      genoa: 20,
      alexandria: 17,
      calicut: 8,
      nagasaki: 11
    }
  },
  nagasaki: {
    id: 'nagasaki',
    name: '長崎',
    englishName: 'Nagasaki',
    nation: 'Independent',
    region: 'East Asia',
    desc: '遙遠日出之國的開放港灣，南蠻貿易中心，精工蒔繪漆器與大名佩刀的匯聚之地。',
    xPercent: 91,
    yPercent: 45,
    investment: 0,
    market: [
      { id: 'lacquerware', name: '蒔繪漆器', category: 'luxury', basePrice: 240, stock: 55, isSpecialty: true },
      { id: 'katana', name: '備前長船武士刀', category: 'weapon', basePrice: 520, stock: 25, isSpecialty: true },
      { id: 'green_tea', name: '宇治玉露茶', category: 'food', basePrice: 65, stock: 110 },
      { id: 'pure_silver', name: '石見銀山白銀', category: 'luxury', basePrice: 310, stock: 70, unlockInvestment: 8000 }
    ],
    distances: {
      lisbon: 32,
      seville: 33,
      london: 35,
      amsterdam: 36,
      genoa: 30,
      alexandria: 27,
      calicut: 18,
      malacca: 11
    }
  }
};

export const SHIPS: Record<string, ShipType> = {
  caravel: {
    id: 'caravel',
    name: '單桅輕快帆船',
    className: 'Caravel Latina',
    maxHp: 100,
    cargo: 60,
    maxCrew: 22,
    minCrew: 8,
    cannons: 4,
    speed: 7,
    cost: 0,
    desc: '輕巧靈活的三角帆探險船，逆風航行能力出眾，是每位偉大提督最初的啟蒙座駕。'
  },
  carrack: {
    id: 'carrack',
    name: '卡拉克大商船',
    className: 'Naus Carrack',
    maxHp: 240,
    cargo: 160,
    maxCrew: 55,
    minCrew: 20,
    cannons: 12,
    speed: 5.5,
    cost: 8500,
    desc: '高船首樓的大型遠洋商貿船，擁有充裕的載貨空間與堅固的船殼，橫跨印度洋的可靠主力。'
  },
  galleon: {
    id: 'galleon',
    name: '無敵蓋倫帆船',
    className: 'Spanish War Galleon',
    maxHp: 480,
    cargo: 360,
    maxCrew: 130,
    minCrew: 45,
    cannons: 32,
    speed: 6.5,
    cost: 26000,
    desc: '大航海時代的海洋霸王！配備兩層全通甲板與密集側舷加農砲，兼具龐大載貨與毀滅火網。'
  },
  frigate: {
    id: 'frigate',
    name: '皇家快速巡防艦',
    className: 'Royal Frigate',
    maxHp: 380,
    cargo: 220,
    maxCrew: 90,
    minCrew: 30,
    cannons: 26,
    speed: 8.5,
    cost: 21000,
    desc: '追求極致航速與獵殺能力的軍用巡防艦，搶風航向優越，是私掠海盜與護航提督的夢魘。'
  },
  ship_of_the_line: {
    id: 'ship_of_the_line',
    name: '一等戰列旗艦「帝國霸王」',
    className: 'First-Rate Ship of the Line',
    maxHp: 750,
    cargo: 520,
    maxCrew: 220,
    minCrew: 70,
    cannons: 54,
    speed: 6.0,
    cost: 65000,
    desc: '海上移動城堡！三層甲板裝備多達54門重型鑄銅巨砲，齊射之威足以在瞬間撕碎任何敵方艦隊。'
  }
};

export const OFFICERS: Officer[] = [
  {
    id: 'pedro',
    name: '「磐石」佩德羅 (Pedro)',
    role: 'first_mate',
    roleName: '大副 (First Mate)',
    desc: '歷經四十載風浪的葡萄牙老水手，能妥善安撫船員，使船隊士氣始終堅如磐石。',
    salary: 1200,
    bonusDesc: '航海中船員士氣衰退減半，白刃戰攻擊力提升 20%',
    avatarSeed: 'pedro'
  },
  {
    id: 'maria',
    name: '「觀星者」瑪麗亞 (Maria)',
    role: 'navigator',
    roleName: '首席航海士 (Chief Navigator)',
    desc: '熟讀托勒密星圖與洋流經緯的博學學者，能洞悉風向帶領船隊避開險礁。',
    salary: 1600,
    bonusDesc: '全海域航行速度 +15%，暴風雨受創機率降低 40%',
    avatarSeed: 'maria'
  },
  {
    id: 'vasco',
    name: '「獨眼火龍」瓦斯科 (Vasco)',
    role: 'gunner',
    roleName: '首席砲術長 (Master Gunner)',
    desc: '曾在勒班陀海戰立下赫赫戰功的老砲手，精通拋物彈道與火藥配比。',
    salary: 2000,
    bonusDesc: '火砲齊射命中率 +25%，砲彈爆擊傷害 +35%',
    avatarSeed: 'vasco'
  },
  {
    id: 'jacob',
    name: '「金秤」雅各 (Jacob)',
    role: 'purser',
    roleName: '首席會計長 (Chief Purser)',
    desc: '精打細算的威尼斯金融奇才，能精準洞察各地行情價差，善於壓低進貨底價。',
    salary: 1800,
    bonusDesc: '交易所購入商品折價 10%，售出利潤額外增加 8%',
    avatarSeed: 'jacob'
  }
];

export const QUESTS: Quest[] = [
  {
    id: 'spice_fever',
    type: 'trade',
    title: '王室香料採購令',
    desc: '從印度洋 (卡利卡特或馬六甲) 帶回 12 箱【黑胡椒】或【肉豆蔻】至里斯本交差。',
    targetItem: '胡椒/肉豆蔻',
    targetQuantity: 12,
    rewardGold: 6800,
    rewardFame: 600
  },
  {
    id: 'london_luxury',
    type: 'trade',
    title: '倫敦貴族的高級訂單',
    desc: '將 5 箱遠東【蒔繪漆器】或熱那亞【天鵝絨】運抵倫敦公會。',
    targetItem: '蒔繪漆器/天鵝絨',
    targetQuantity: 5,
    rewardGold: 7500,
    rewardFame: 700
  },
  {
    id: 'pirate_hunter',
    type: 'bounty',
    title: '討伐海盜「紅鬍子」分艦隊',
    desc: '地中海或印度洋擊沉 1 艘襲擊商船的兇殘海盜巡防艦。',
    rewardGold: 9000,
    rewardFame: 1000
  },
  {
    id: 'ivory_trade',
    type: 'trade',
    title: '亞歷山大精雕象牙收購',
    desc: '收集 8 箱【精雕象牙】送往塞維爾西印度事務局。',
    targetItem: '精雕象牙',
    targetQuantity: 8,
    rewardGold: 8500,
    rewardFame: 800
  }
];

export const DISCOVERIES: Discovery[] = [
  {
    id: 'rhodes_colossus',
    name: '羅得島太陽神巨像殘垣',
    category: 'historic',
    desc: '古希臘世界七大奇蹟之一，雄踞在愛琴海入口的宏偉銅像青銅巨靴基石。',
    fameValue: 500,
    foundPort: 'alexandria',
    imageIcon: '🏛️'
  },
  {
    id: 'white_elephant',
    name: '神聖印度白象',
    category: 'creature',
    desc: '傳說中只出現在深山密林之中的神聖生靈，被當地君王奉為吉祥與統治的象徵。',
    fameValue: 700,
    foundPort: 'calicut',
    imageIcon: '🐘'
  },
  {
    id: 'borobudur',
    name: '爪哇婆羅浮屠千佛壇',
    category: 'historic',
    desc: '隱匿於熱帶雨林深處的巨大石造佛塔群，梯形平台刻滿精美絕倫的神話浮雕。',
    fameValue: 900,
    foundPort: 'malacca',
    imageIcon: '🕌'
  },
  {
    id: 'mount_fuji',
    name: '扶桑聖岳・富士雪冠',
    category: 'geography',
    desc: '東方極遠處終年積雪的完美對稱火山錐，在晨曦照映下泛出無與倫比的淡金光芒。',
    fameValue: 1200,
    foundPort: 'nagasaki',
    imageIcon: '🗻'
  }
];

export const TAVERN_RUMORS: string[] = [
  '老水手低聲說：「只要能把卡利卡特的黑胡椒運回里斯本，利潤足足高達八倍以上！」',
  '酒保一邊擦拭木杯一邊說道：「熱那亞的白銀若是運往亞歷山大，當地的阿拉伯商人願意出極高金幣收購。」',
  '一名滿臉刺青的水手警告：「好望角與阿拉伯海時有海盜埋伏，出港前務必檢查水手滿額與火砲備彈！」',
  '造船匠興奮地提到：「若對港口投入巨額投資，交易所就會解鎖如石見白銀、大馬士革鋼等稀世特產！」',
  '傳教士合十道：「在遙遠的馬六甲與長崎，只要向公會學者回報地理奇蹟，就能獲得崇高聲望並獲封貴族頭銜！」',
  '一位商人嘆道：「一等戰列旗艦一發全舷齊射，威力足以把十幾條快船轟成木屑，乃海軍上將的無上榮光。」'
];
