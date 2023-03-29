import {cleanString} from '../scripts';

export class Buddy {
  Name = '';
  Hero = '';
  Tier = 0;
  Stats = '';
  Flavor = '';
  Link = '';
  Aliases = '';
  Tribes = '';
  [key: string]: any;

  constructor(buddy: Buddy) {
    this.deserialize(buddy);
  }

  fullText = () =>
    [
      this.Name,
      this.Tribes,
      `T${this.Tier}`,
      this.Stats,
      this.Flavor,
      this.Link,
    ]
      .filter(s => !!s.length && s !== '-')
      .join(' | ');

  isHero = (input: string) => {
    const aliases = cleanString(this.Aliases)
      .split(',')
      .map(s => s.trim());
    const normalizedHeroName = cleanString(this.Hero);
    return (
      !!this.Name &&
      (input === normalizedHeroName ||
        aliases.includes(input) ||
        normalizedHeroName.includes(input))
    );
  };

  private deserialize(instanceData: Buddy) {
    const keys = Object.keys(this);

    for (const key of keys) {
      if (instanceData.hasOwnProperty(key)) {
        this[key] = instanceData[key];
      }
    }
  }
}
