export interface LeaderboardEntry {
  rank: number;
  accountid: string;
  rating: number;
  region: string;
}

export class Leaderboard {
  entries: LeaderboardEntry[] = [];
}
