import {Message} from '../models';
import {CardResponse} from '../responses';
import {
  getTagAndCommandText,
  say,
  makeArrayString,
  cleanString,
  getResponseText,
} from '../util';
import {BaseCommand} from './BaseCommand';
import {readFileSync} from 'fs';
import {join} from 'path';

export class CardCommand extends BaseCommand {
  timeout = 2000;

  getCard = async (message: Message, isGold: boolean = false) => {
    const timeNow = new Date().getTime();
    if (timeNow - this.lastMessage > this.timeout) {
      this.lastMessage = timeNow;
      const [cardName, tag] = getTagAndCommandText(message);
      if (!cardName) {
        say(
          message.channel,
          `Please type !card <cardName> or !gcard for golden to use this feature happ ${message.tags.username}`
        );
      } else {
        const allCards: CardResponse[] = JSON.parse(
          readFileSync(join(__dirname, '../data/cards.json'), 'utf-8')
        );
        // split gold vs. normal
        // since gold has normal id and vice versa
        const relevantMinions = isGold
          ? allCards.filter(c => !!c.battlegroundsNormalDbfId)
          : allCards.filter(c => !!c.battlegroundsPremiumDbfId);

        const exactMatch = relevantMinions.find(
          c => cleanString(c.name) === cardName
        );
        if (exactMatch) {
          say(
            message.channel,
            `${isGold ? 'Golden ' : ''}${getResponseText(exactMatch)} ${tag}`
          );
        } else {
          const nextMatch = relevantMinions.filter(c =>
            cleanString(c.name).includes(cardName)
          );
          if (nextMatch.length) {
            switch (nextMatch.length) {
              case 1:
                say(
                  message.channel,
                  `${isGold ? 'Golden ' : ''}${getResponseText(
                    nextMatch[0]
                  )} ${tag}`
                );
                break;
              default:
                say(
                  message.channel,
                  `${cardName} matches ${makeArrayString(
                    nextMatch.map(c => c.name)
                  )}, please be more specific. ${tag}`
                );
            }
          } else {
            const finalMatch = relevantMinions.filter(c =>
              cardName
                .split(' ')
                .some(n => cleanString(c.name).split(' ').includes(n))
            );
            if (finalMatch.length) {
              switch (finalMatch.length) {
                case 1:
                  say(
                    message.channel,
                    `${isGold ? 'Golden ' : ''}${getResponseText(
                      finalMatch[0]
                    )} ${tag}`
                  );
                  break;
                default:
                  say(
                    message.channel,
                    `${cardName} matches ${makeArrayString(
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
