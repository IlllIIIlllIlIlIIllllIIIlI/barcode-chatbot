import {DailyChatter, Logger, Message} from '.';
import {PrismaClient} from '@prisma/client';

export class Cache {
  lastMessages: Message[];
  chatters: DailyChatter[] = [];
  lastChatter: DailyChatter | undefined = undefined;
  db: PrismaClient | null;
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

  static Log() {
    const obj = this.Instance;
    obj.chatters = [];
    obj.db = null;
    Logger.Debug(obj);
  }

  static Load = async () => {
    if (this.Instance.db) {
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
        });
    }
  };

  static Save = async () => {
    this.Instance.chatters.forEach(c => {
      if (this.Instance.db) {
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
          .catch(Logger.Error);
      }
    });
  };
}
