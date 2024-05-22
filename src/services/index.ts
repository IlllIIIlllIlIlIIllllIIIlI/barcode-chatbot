import {CardService} from './CardService';
import {LeaderboardService} from './LeaderboardService';

export * from './CardService';
export * from './LeaderboardService';

export const initServices = async () => {
  const cardService = new CardService();
  const leaderboardService = new LeaderboardService();

  cardService.init();
  // await leaderboardService.init();
};
