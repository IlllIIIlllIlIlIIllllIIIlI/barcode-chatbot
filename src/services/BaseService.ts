import fetch from 'node-fetch';
import {OAuthClient} from '../clients';

declare interface Client {
  id: string;
  secret: string;
}

declare interface Auth {
  tokenHost: string;
}

export interface OAuthOptions {
  client: Client;
  auth: Auth;
}

export class BaseService {
  protected oauthOptions: OAuthOptions;
  client: OAuthClient;
  private token: string | null = null;

  constructor(oauthOptions: OAuthOptions) {
    this.oauthOptions = oauthOptions;
    this.client = new OAuthClient(this.oauthOptions);
  }

  init = async () => {
    this.token = await this.client.getToken();
  };

  getResponse = async (url: string) => {
    if (!this.token) {
      this.token = await this.client.getToken();
    }

    const headers = {Authorization: `Bearer ${this.token}`};
    return await fetch(url, {headers});
  };
}
