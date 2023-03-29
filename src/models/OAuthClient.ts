import {AccessToken, ClientCredentials, ModuleOptions} from 'simple-oauth2';
import {Logger} from './Logger';

export class OAuthClient {
  client: ClientCredentials;
  private _token: AccessToken | null | void = null;
  token: string | null = null;

  constructor(oauthOptions: ModuleOptions) {
    this.client = new ClientCredentials(oauthOptions);
  }

  getToken = async () => {
    try {
      if (!this._token || this._token.expired()) {
        this._token = await this.client
          .getToken({}, {json: true})
          .catch(Logger.Error);
      }
      this.token = this._reduceToken(this._token);
    } catch (err) {
      Logger.Error(err);
    }
  };

  private _reduceToken = (token: AccessToken | void) => {
    return token ? (token.token.access_token as string) : null;
  };
}
