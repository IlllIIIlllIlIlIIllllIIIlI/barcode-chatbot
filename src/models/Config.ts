import path from 'path';
import dotenv from 'dotenv';

dotenv.config({path: path.resolve(__dirname, '../../.env')});

interface ENV {
  CLIENT_ID: string | undefined;
  CLIENT_SECRET: string | undefined;
  OAUTH: string | undefined;
}

interface Config {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  OAUTH: string;
}

const getConfig = (): ENV => {
  return {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    OAUTH: process.env.OAUTH,
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
