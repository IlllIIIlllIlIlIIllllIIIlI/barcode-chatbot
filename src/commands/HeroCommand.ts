import {Message} from '../models';
import {
  getTagAndCommandText,
  makeArrayString,
  say,
  cleanString,
  getHeroText,
} from '../util';
import {BaseCommand} from './BaseCommand';
import {CardResponse} from '../interfaces';
import heroAliases from '../data/heroAliases.json';
import cardsJson from '../data/cards.json';

export class HeroCommand extends BaseCommand {
  timeout: number = 2000;

  get = async (message: Message) => {
    const timeNow = new Date().getTime();
    if (timeNow - this.lastMessage > this.timeout) {
      this.lastMessage = timeNow;
      const [heroName, tag] = getTagAndCommandText(message);
      if (!heroName) {
        say(
          message.channel,
          `Please type !hero <heroName> to use this feature happ ${message.tags.username}`
        );
      } else {
        this.lastMessage = timeNow;
        const heroes: CardResponse[] = cardsJson.filter(
          c => !!c.battlegroundsHero
        );

        let hero =
          heroes.find(h => cleanString(h.name) == heroName) ||
          heroes.find(
            h =>
              h.name ==
              heroAliases.find(a => a.aliases.includes(heroName))?.name
          );

        if (hero) {
          const heroPower = cardsJson.find(
            c => c.type == 'HERO_POWER' && hero?.heroPowerDbfId == c.dbfId
          )?.text;
          say(message.channel, `${getHeroText(hero, heroPower)} ${tag}`);
        } else {
          const matches = heroes.filter(h =>
            cleanString(h.name).includes(heroName)
          );
          if (matches.length) {
            switch (matches.length) {
              case 1:
                const heroPower = cardsJson.find(
                  c =>
                    c.type == 'HERO_POWER' &&
                    matches[0].heroPowerDbfId == c.dbfId
                )?.text;
                say(
                  message.channel,
                  `${getHeroText(matches[0], heroPower)} ${tag}`
                );
                break;
              default:
                say(
                  message.channel,
                  `${heroName} matches ${makeArrayString(
                    matches.map(c => c.name)
                  )}, please be more specific. ${tag}`
                );
            }
          } else {
            const finalMatch = heroes.filter(h =>
              heroName
                .split(' ')
                .some(n => cleanString(h.name).split(' ').includes(n))
            );
            if (finalMatch.length) {
              switch (finalMatch.length) {
                case 1:
                  const heroPower = cardsJson.find(
                    c =>
                      c.type == 'HERO_POWER' &&
                      finalMatch[0].heroPowerDbfId == c.dbfId
                  )?.text;
                  say(
                    message.channel,
                    `${getHeroText(finalMatch[0], heroPower)} ${tag}`
                  );
                  break;
                default:
                  say(
                    message.channel,
                    `${heroName} matches ${makeArrayString(
                      finalMatch.map(c => c.name)
                    )}, please be more specific. ${tag}`
                  );
              }
            }
          }
        }
      }
    }
  };
}
