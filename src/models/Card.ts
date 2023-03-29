declare interface Battlegrounds{
  tier?: number;
  hero: boolean;
  quest: boolean;
  reward: boolean;
  companionId?: number;
  upgradeId?: number;
}

export class Card{
  id?: number;
  slug?: string;
  minionTypeId?: number;
  multiTypeIds?: number[];
  health?: number;
  attack?: number;
  manaCost?: number;
  name?: string;
  text?: string;
  battlegrounds?: Battlegrounds;
}
