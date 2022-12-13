import {Message} from './Message';

export class Cache {
  lastUser: string | null;
  lastMessages: string[];
  isPyramidAttempt;

  private static _instance: Cache;

  private constructor() {
    this.lastUser = null;
    this.lastMessages = [];
    this.isPyramidAttempt = false;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  static Clear = () => {
    this.Instance.lastUser = null;
    this.Instance.lastMessages = [];
    this.Instance.isPyramidAttempt = false;
  };

  static Reset = (message: Message) => {
    this.Instance.lastUser = message.tags.username ?? null;
    this.Instance.lastMessages = [];
    this.Instance.lastMessages.push(message.message.trim());
    this.Instance.isPyramidAttempt = false;
  };
}
