export interface CardResponse {
  dbfId: number;
  health: number;
  attack?: number;
  name: string;
  text?: string;
  armor?: number;
  type: string;
  races?: string[];
  techLevel?: number;
  cost?: number;
  spellSchool?: string;

  battlegroundsBuddyDbfId?: number;
  battlegroundsHero?: boolean;
  isBattlegroundsBuddy?: boolean;
  heroPowerDbfId?: number;
  battlegroundsPremiumDbfId?: number;
  battlegroundsNormalDbfId?: number;
}
