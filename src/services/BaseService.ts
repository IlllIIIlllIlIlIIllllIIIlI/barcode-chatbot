import {mkdirSync, existsSync} from 'fs';
import {join} from 'path';

export abstract class BaseService {
  abstract init(): void;
  protected _path: string;

  constructor() {
    this._path = join(__dirname, '../data/');
    if (!existsSync(this._path)) {
      mkdirSync(this._path);
    }
  }
}
