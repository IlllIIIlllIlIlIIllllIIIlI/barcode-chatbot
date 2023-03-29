import {sanitizedConfig, OAuthClient} from '../models';

const _oauthOptions = {
  client: {
    id: sanitizedConfig.CLIENT_ID,
    secret: sanitizedConfig.CLIENT_SECRET,
  },
  auth: {
    tokenHost: 'https://us.battle.net',
  },
};
