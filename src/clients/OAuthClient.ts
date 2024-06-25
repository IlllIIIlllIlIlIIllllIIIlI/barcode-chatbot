import {AccessToken, ClientCredentials, ModuleOptions} from 'simple-oauth2';
import {Logger} from '../infra';

export class OAuthClient {
  client: ClientCredentials;
  private _token: AccessToken | null | void = null;
  token: string | null = null;

  constructor(oauthOptions: ModuleOptions) {
    this.client = new ClientCredentials(oauthOptions);
  }

  getToken = async () => {
    if (!this._token || this._token.expired()) {
      this._token = await this.client
        .getToken({scope: ['chat:read', 'chat:edit']})
        .catch(Logger.Error);
    }
    this.token = this._reduceToken(this._token);

    return this.token;
  };

  private _reduceToken = (token: AccessToken | void) => {
    return token ? (token.token.access_token as string) : null;
  };
}
