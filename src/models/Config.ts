import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({path: path.resolve(__dirname, '../../.env')});

interface ENV {
  OAUTH: string | undefined;
  DEBUG: boolean;
  USERNAME: string | undefined;
}

interface Config {
  OAUTH: string;
  DEBUG: boolean;
  USERNAME: string;
}

const getConfig = (): ENV => {
  return {
    OAUTH: process.env.OAUTH,
    DEBUG: process.env.DEBUG === 'true',
    USERNAME: process.env.USERNAME,
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
