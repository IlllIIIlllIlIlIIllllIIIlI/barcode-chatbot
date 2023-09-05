import {BaseCommand} from './BaseCommand';
import {Leaderboard} from '../interfaces';
import {say} from '../util';
import {Message} from '../models';
import {readFileSync} from 'fs';
import {join} from 'path';

export class RankCommand extends BaseCommand {
  timeout = 5000;

  private readLeaderboard = () => {
    return JSON.parse(
      readFileSync(join(__dirname, '../data/leaderboard.json'), 'utf-8')
    );
  };

  private getRankByPlayer = (
    message: Message,
    playerName: string,
    region: string | null = null
  ) => {
    const allPlayers: Leaderboard = this.readLeaderboard();
    if (region) {
      const match = allPlayers.entries.find(
        p => p.accountid == playerName && p.region == region
      );
      if (match) {
        say(
          message.channel,
          `${match.accountid} is rank ${match.rank} with ${match.rating} MMR in ${match.region} happ`
        );
      } else {
        say(message.channel, `${playerName} was not found in ${region} sajj`);
      }
    } else {
      const matches = allPlayers.entries.filter(p => p.accountid == playerName);
      if (!matches.length) {
        say(message.channel, `${playerName} was not found in any region sajj`);
      } else {
        const match = matches.find(
          p => p.rank == Math.min(...matches.map(m => m.rank))
        );

        if (match) {
          say(
            message.channel,
            `${match.accountid} is rank ${match.rank} with ${match.rating} MMR in ${match.region} happ`
          );
        }
      }
    }
  };

  private getPlayerByRank = (
    message: Message,
    rank: number,
    region: string
  ) => {
    const allPlayers: Leaderboard = this.readLeaderboard();

    const match = allPlayers.entries.find(
      p => p.rank == rank && p.region == region
    );
    if (match) {
      say(
        message.channel,
        `${match.accountid} is rank ${match.rank} with ${match.rating} MMR in ${match.region} happ`
      );
    }
  };

  get = (message: Message) => {};
}
