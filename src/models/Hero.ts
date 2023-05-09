import {cleanString} from '../util';

export class Hero {
  Hero = '';
  Armor = 0;
  'Hero Power' = '';
  Aliases = '';

  [key: string]: any;

  fullText = () =>
    [this.Hero, `Armor: ${this.Armor}`, this['Hero Power']]
      .filter(s => !!s.length && s !== '-')
      .join(' | ');

  isHero = (input: string) => {
    const aliases = cleanString(this.Aliases)
      .split(',')
      .map(s => s.trim())
      .filter(s => !!s.length);
    const normalizedHeroName = cleanString(this.Hero);
    return (
      !!this.Hero &&
      (input === normalizedHeroName ||
        aliases.includes(input) ||
        normalizedHeroName.includes(input))
    );
  };

  constructor(hero: Hero) {
    this.deserialize(hero);
  }

  private deserialize(instanceData: Hero) {
    const keys = Object.keys(this);

    for (const key of keys) {
      if (instanceData.hasOwnProperty(key)) {
        this[key] = instanceData[key];
      }
    }
  }
}
