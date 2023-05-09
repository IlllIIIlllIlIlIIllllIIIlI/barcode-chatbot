declare interface Battlegrounds {
  tier?: number;
  hero: boolean;
  reward: boolean;
  companionId?: number;
  upgradeId?: number;
}

export interface CardResponse {
  id: number;
  slug: string;
  minionTypeId?: number;
  multiTypeIds?: number[];
  health: number;
  attack?: number;
  name: string;
  text: string;
  armor?: number;
  battlegrounds?: Battlegrounds;
  isGold: boolean;
}
