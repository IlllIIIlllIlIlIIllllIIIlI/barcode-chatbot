import {Logger} from '../infra';
import {BaseService} from './BaseService';
import {Leaderboard} from '../interfaces';
import fetch from 'node-fetch';
import {writeFileSync} from 'fs';
import {join} from 'path';

export class LeaderboardService extends BaseService {
  init = async () => {
    await this.updateLeaderboards();

    setInterval(() => {
      this.updateLeaderboards();
      Logger.Info('Updated leaderboards');
    }, 120000);
  };

  updateLeaderboards = async (regions: string[] = ['NA', 'EU', 'AP']) => {
    try {
      let leaderboard = new Leaderboard();
      for (const region of regions) {
        let promises = [];
        for (let i = 1; i < 41; i++) {
          promises.push(
            fetch(
              `https://hearthstone.blizzard.com/en-us/api/community/leaderboardsData
              ?region=${region}
              &leaderboardId=battlegrounds
              &page=${i}`.replace(/\s/g, '')
            )
              .then(response => {
                return response.json();
              })
              .then(resp => {
                return resp.leaderboard.rows;
              })
              .catch(Logger.Error)
          );
        }

        const entries = (await Promise.all(promises)).flatMap(p => p);
        entries.forEach(e => (e.region = region));

        leaderboard.entries = leaderboard.entries.concat(entries);
      }
      writeFileSync(
        join(this._path, `leaderboard.json`),
        JSON.stringify(leaderboard, null, 4),
        {
          flag: 'w+',
        }
      );
    } catch (e) {
      Logger.Error(e);
    }
  };
}
