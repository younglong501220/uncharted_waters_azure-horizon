export type Nation = 'Portugal' | 'Spain' | 'England' | 'Netherlands' | 'Ottoman' | 'Independent';

export interface MarketItem {
  id: string;
  name: string;
  category: 'food' | 'luxury' | 'metal' | 'fabric' | 'weapon' | 'spice';
  basePrice: number;
  stock: number;
  isSpecialty?: boolean;
  unlockInvestment?: number; // Requires port investment to unlock
}

export interface Port {
  id: string;
  name: string;
  englishName: string;
  nation: Nation;
  region: 'Iberia' | 'Northern Europe' | 'Mediterranean' | 'India' | 'Southeast Asia' | 'East Asia';
  desc: string;
  xPercent: number; // 0 - 100 for world map
  yPercent: number; // 0 - 100 for world map
  market: MarketItem[];
  distances: Record<string, number>; // distance in sailing days to other ports
  investment: number;
}

export interface ShipRefit {
  cannonRefit: number; // additional cannons installed
  hullReinforced: boolean; // +25% max HP
  expandedHold: boolean; // +30% cargo
}

export interface ShipType {
  id: string;
  name: string;
  className: string;
  maxHp: number;
  cargo: number;
  maxCrew: number;
  minCrew: number;
  cannons: number;
  speed: number; // knots rating 1-10
  cost: number;
  desc: string;
}

export interface CargoItem {
  count: number;
  buyPrice: number;
  buyPort: string;
}

export interface Officer {
  id: string;
  name: string;
  role: 'first_mate' | 'navigator' | 'gunner' | 'purser';
  roleName: string;
  desc: string;
  salary: number; // hiring cost
  bonusDesc: string;
  avatarSeed: string;
}

export interface Quest {
  id: string;
  type: 'trade' | 'bounty' | 'discovery';
  title: string;
  desc: string;
  targetPort?: string;
  targetItem?: string;
  targetQuantity?: number;
  targetEnemy?: string;
  rewardGold: number;
  rewardFame: number;
  isCompleted?: boolean;
}

export interface Discovery {
  id: string;
  name: string;
  category: 'historic' | 'geography' | 'creature';
  desc: string;
  fameValue: number;
  foundPort: string;
  imageIcon: string;
}

export interface CombatState {
  targetKey: string;
  totalDays: number;
  currentDay: number;
  enemyName: string;
  enemyShipType: string;
  enemyHp: number;
  enemyMaxHp: number;
  enemyCrew: number;
  enemyCannons: number;
  enemyType: 'pirate' | 'corsair' | 'bounty_target' | 'ghost_ship';
  playerTurn: boolean;
  round: number;
  logs: string[];
}

export interface Supplies {
  rations: number; // Days of food & water (consumed 1 per day)
  ammo: number;    // Cannon rounds
  timber: number;  // Repair materials
}

export interface PlayerState {
  name: string;
  title: string;
  gold: number;
  fame: number;
  date: {
    year: number;
    month: number;
    day: number;
  };
  currentPort: string;
  isSailing: boolean;
  sailingInfo: {
    origin: string;
    destination: string;
    totalDays: number;
    currentDay: number;
    weather: 'calm' | 'favorable_wind' | 'headwind' | 'fog' | 'storm';
    windDir: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  } | null;
  shipType: string;
  shipHp: number;
  shipRefit: ShipRefit;
  crew: number;
  crewMorale: number; // 0 to 100
  supplies: Supplies;
  cargo: Record<string, CargoItem>;
  hiredOfficers: string[]; // officer IDs
  acceptedQuest: Quest | null;
  completedQuestsCount: number;
  unlockedDiscoveries: string[];
  portInvestments: Record<string, number>;
}

export interface LogMessage {
  id: string;
  time: string;
  text: string;
  type: 'normal' | 'gold' | 'danger' | 'success' | 'combat' | 'rumor';
}
