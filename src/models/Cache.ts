import {DailyChatter, Logger, Message} from '.';
import {PrismaClient} from '@prisma/client';

export class Cache {
  lastMessages: Message[];
  chatters: DailyChatter[] = [];
  lastChatter: DailyChatter | undefined = undefined;
  db: PrismaClient;
  isPyramidAttempt;

  private static _instance: Cache;

  private constructor() {
    this.lastMessages = [];
    this.isPyramidAttempt = false;
    this.db = new PrismaClient();
  }

  static get Instance() {
    return this._instance || (this._instance = new this());
  }

  static Load = async () => {
    this.Instance.db.chatter
      .findMany()
      .then(data => {
        this.Instance.chatters = data.map(c => new DailyChatter(c));
      })
      .catch(Logger.Error)
      .then(() => {
        this.Instance.lastMessages = [];
        this.Instance.isPyramidAttempt = false;
        this.Instance.lastChatter = undefined;
        Logger.Info('Chatters loaded!');
      });
  };

  static Save = async () => {
    this.Instance.chatters.forEach(c => {
      this.Instance.db.chatter
        .upsert({
          where: {
            username: c.username,
          },
          update: {
            failedPyramids: c.totalFailedPyramids,
            successfulPyramids: c.totalSuccessfulPyrmaids,
          },
          create: {
            username: c.username ?? '',
            failedPyramids: c.totalFailedPyramids,
            successfulPyramids: c.totalSuccessfulPyrmaids,
          },
        })
        .catch(Logger.Error)
        .then(() => {
          Logger.Info('Chatters saved!');
        });
    });
  };
}
