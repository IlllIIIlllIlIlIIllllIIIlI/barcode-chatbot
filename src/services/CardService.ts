import {Logger} from '../infra';
import {CardResponse} from '../interfaces';
import fetch from 'node-fetch';
import {writeFileSync} from 'fs';
import {join} from 'path';
import {BaseService} from './BaseService';

export class CardService extends BaseService {
  init = () => {
    this.updateCards();

    setInterval(() => {
      this.updateCards();
      Logger.Info('Updated cards');
    }, 7200000);
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
