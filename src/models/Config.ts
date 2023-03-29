import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({path: path.resolve(__dirname, '../../.env')});

interface ENV {
  OAUTH: string | undefined;
  DEBUG: boolean;
  USERNAME: string | undefined;
  CHANNELS: string[] | undefined;
  CLIENT_ID: string | undefined;
  CLIENT_SECRET: string | undefined;
}

interface Config {
  OAUTH: string;
  DEBUG: boolean;
  USERNAME: string;
  CHANNELS: string[];
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}

const getConfig = (): ENV => {
  return {
    OAUTH: process.env.OAUTH,
    DEBUG: process.env.DEBUG === 'true',
    USERNAME: process.env.USERNAME,
    CHANNELS: process.env.CHANNELS?.split(';'),
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
export {sanitizedConfig};
