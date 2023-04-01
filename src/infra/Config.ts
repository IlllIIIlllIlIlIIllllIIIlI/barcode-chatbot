import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({path: path.resolve(__dirname, '../../.env')});

export class Config {
  OAUTH: string = process.env.OAUTH || '';
  DEBUG: boolean = process.env.DEBUG === 'true';
  USERNAME: string = process.env.USERNAME || '';
  CHANNELS: string[] = process.env.CHANNELS?.split(';') || [];
  CLIENT_ID: string = process.env.CLIENT_ID || '';
  CLIENT_SECRET: string = process.env.CLIENT_SECRET || '';
}
