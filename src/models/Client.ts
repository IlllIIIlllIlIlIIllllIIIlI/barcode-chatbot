import {Client as TClient} from 'tmi.js';
import {sanitizedConfig} from '.';

export class Client {
  client: TClient;
  private static _instance: Client;

  private constructor() {
    const config = sanitizedConfig;
    this.client = new TClient({
      options: {debug: config.DEBUG},
      identity: {
        username: config.USERNAME,
        password: `oauth:${config.OAUTH}`,
      },
      channels: config.CHANNELS,
    });
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}
