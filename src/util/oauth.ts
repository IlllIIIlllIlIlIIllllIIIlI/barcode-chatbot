import axios from 'axios';
import config from '../models/Config';

const getToken = async () => {
  const content = {
    client_id: config.CLIENT_ID,
    client_secret: config.CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:3000',
  };

  const resp = await axios.post('https://id.twitch.tv/oauth2/token', content);
  return resp.data.access_token;
};

export default getToken;
export {getToken};
