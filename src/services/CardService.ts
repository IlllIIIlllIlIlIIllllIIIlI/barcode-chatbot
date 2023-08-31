import {Logger} from '../infra';
import {CardResponse} from '../responses';
import fetch from 'node-fetch';
import {writeFileSync, mkdirSync, existsSync} from 'fs';
import {join} from 'path';

export class CardService {
  private _path: string;

  constructor() {
    this._path = join(__dirname, '../data/');
    if (!existsSync(this._path)) {
      mkdirSync(this._path);
    }
  }

  init = () => {
    this.updateCards();

    setInterval(() => {
      this.updateCards();
      Logger.Info('Updated cards');
    }, 3600000);
  };

  updateCards = () => {
    fetch('https://api.hearthstonejson.com/v1/184727/enUS/cards.json')
      .then(response => {
        return response.json();
      })
      .then((myJson: CardResponse[]) => {
        const cards = myJson.filter(
          c =>
            !!c.battlegroundsHero ||
            !!c.isBattlegroundsBuddy ||
            !!c.battlegroundsPremiumDbfId ||
            !!c.battlegroundsNormalDbfId ||
            c.type == 'HERO_POWER'
        );

        writeFileSync(
          join(this._path, 'cards.json'),
          JSON.stringify(cards, null, 4),
          {
            flag: 'w+',
          }
        );
      });
  };
}
