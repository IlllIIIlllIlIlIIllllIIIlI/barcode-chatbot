import {writeFileSync, mkdirSync, existsSync} from 'fs';
import {join} from 'path';
import {EventBus} from '.';

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

  static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private _log = (filename: string, data: string | object | unknown) => {
    const path = join(this._path, `${filename}.txt`);

    writeFileSync(path, this._format(data), {
      flag: 'a+',
    });
  };

  private _format = (data: string | object | unknown) => {
    const content =
      typeof data === 'string' ? data : JSON.stringify(data, null, 4);
    const result = `------------------------------------------------- \n
      # ${new Date().toLocaleString()}: \n ${content} \n`;
    return result;
  };

  static Error = (data: string | object | unknown) =>
    this.Instance._log('error', data);
  static Chat = (data: string | object | unknown) =>
    this.Instance._log('chat', data);
  static Info = (data: string | object | unknown) =>
    this.Instance._log('info', data);
  static Debug = (data: string | object | unknown) =>
    this.Instance._log('debug', data);
}
