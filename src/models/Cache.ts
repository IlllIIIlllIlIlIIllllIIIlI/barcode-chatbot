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
}
