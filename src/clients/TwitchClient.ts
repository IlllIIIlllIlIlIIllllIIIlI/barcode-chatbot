import {Client} from 'tmi.js';
import {Config} from '../infra';
import {OAuthClient} from './OAuthClient';

export class TwitchClient extends OAuthClient {
  connection: Client | null = null;
  private static _instance: TwitchClient;

  private constructor() {
    const config = new Config();

    const oauthOptions = {
      client: {
        id: config.CLIENT_ID,
        secret: config.CLIENT_SECRET,
      },
      auth: {
        tokenHost: 'https://id.twitch.tv/',
        tokenPath: '/oauth2/token',
      },
    };

    super(oauthOptions);
    this.setup(config);
  }

  private setup = (config: Config) => {
    // this.getToken()
    //   .then(token => {
    //     console.log(token);
    //     this.connection = new Client({
    //       options: {debug: config.DEBUG},
    //       identity: {
    //         username: config.USERNAME,
    //         password: `oauth:${token}`,
    //       },
    //       channels: config.CHANNELS,
    //     });
    //   })
    //   .finally(() => {
    //     console.log('wut');
    //   });
    this.connection = new Client({
      options: {debug: config.DEBUG},
      identity: {
        username: config.USERNAME,
        password: `oauth:${config.OAUTH}`,
      },
      channels: config.CHANNELS,
    });
  };

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}
