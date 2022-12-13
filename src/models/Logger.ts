import {writeFileSync, mkdirSync, existsSync} from 'fs';
import {join} from 'path';
import {EventBus} from './EventBus';

export class Logger extends EventBus<object> {
  private static _instance: Logger;
  private _path: string;

  private constructor() {
    super();
    this._path = join(__dirname, '../logs/');
    if (!existsSync(this._path)) {
      mkdirSync(this._path);
    }
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private _log = (filename: string, data: string | object) => {
    const path = join(this._path, `${filename}.txt`);

    writeFileSync(path, this._format(data), {
      flag: 'a+',
    });
  };

  private _format = (data: string | object) => {
    const content =
      typeof data === 'string' ? data : JSON.stringify(data, null, 4);
    const result = `------------------------------------------------- \n
      # ${new Date().toLocaleString()}: \n ${content} \n`;
    return result;
  };

  Error = (data: string | object) => this._log('error', data);
  Chat = (data: string | object) => this._log('chat', data);
  Info = (data: string | object) => this._log('info', data);
}
