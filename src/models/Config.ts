import path from 'path';
import dotenv from 'dotenv';

dotenv.config({path: path.resolve(__dirname, '../../.env')});

interface ENV {
  OAUTH: string | undefined;
  DEBUG: boolean;
}

interface Config {
  OAUTH: string;
  DEBUG: boolean;
}

const getConfig = (): ENV => {
  return {
    OAUTH: process.env.OAUTH,
    DEBUG: process.env.DEBUG === 'true',
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
