import {Message} from '../models';
import {
  say,
  makeArrayString,
  getTagAndCommandText,
  getCardText,
  cleanString,
} from '../util';
import {BaseCommand} from './BaseCommand';
import heroAliases from '../data/heroAliases.json';
import cardsJson from '../data/cards.json';
import {CardResponse} from '../interfaces';

export class BuddyCommand extends BaseCommand {
  timeout: number = 2000;

  get = async (message: Message, isGold: boolean = false) => {
    const timeNow = new Date().getTime();
    if (timeNow - this.lastMessage > this.timeout) {
      this.lastMessage = timeNow;
      const [heroName, tag] = getTagAndCommandText(message);
      if (!heroName) {
        say(
          message.channel,
          `Please type !buddy <heroName> (or !gbuddy for golden) to use this feature happ ${message.tags.username}`
        );
      } else {
        this.lastMessage = timeNow;
        const buddies: CardResponse[] = cardsJson.filter(
          c => !!c.isBattlegroundsBuddy
        );
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

        if (!hero) {
          const matches = heroes.filter(h =>
            cleanString(h.name).includes(heroName)
          );
          if (matches.length) {
            switch (matches.length) {
              case 1:
                const match = isGold
                  ? buddies.find(
                      b =>
                        b.battlegroundsNormalDbfId ==
                        matches[0].battlegroundsBuddyDbfId
                    )
                  : buddies.find(
                      b => b.dbfId == matches[0].battlegroundsBuddyDbfId
                    );
                if (match) {
                  say(
                    message.channel,
                    `${isGold ? 'Golden ' : ''}${getCardText(match)} ${tag}`
                  );
                }
                break;
              default:
                say(
                  message.channel,
                  `${heroName} matches ${makeArrayString(
                    matches.map(c => c.name)
                  )}, please be more specific. ${tag}`
                );
            }
          }
        } else {
          const match = isGold
            ? buddies.find(
                b => b.battlegroundsNormalDbfId == hero?.battlegroundsBuddyDbfId
              )
            : buddies.find(b => b.dbfId == hero?.battlegroundsBuddyDbfId);
          if (match) {
            say(
              message.channel,
              `${isGold ? 'Golden ' : ''}${getCardText(match)} ${tag}`
            );
          } else {
            const finalMatch = heroes.filter(h =>
              heroName
                .split(' ')
                .some(n => cleanString(h.name).split(' ').includes(n))
            );
            if (finalMatch.length) {
              switch (finalMatch.length) {
                case 1:
                  const match = isGold
                    ? buddies.find(
                        b =>
                          b.battlegroundsNormalDbfId ==
                          hero?.battlegroundsBuddyDbfId
                      )
                    : buddies.find(
                        b => b.dbfId == hero?.battlegroundsBuddyDbfId
                      );
                  if (match) {
                    say(
                      message.channel,
                      `${isGold ? 'Golden ' : ''}${getCardText(match)} ${tag}`
                    );
                  }
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
