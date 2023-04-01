import {Client} from 'tmi.js';
import {Config} from '../infra';

export class TwitchClient {
  connection: Client;
  private static _instance: TwitchClient;

  private constructor() {
    const config = new Config();
    this.connection = new Client({
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
