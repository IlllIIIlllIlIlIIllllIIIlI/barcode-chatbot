import {Message} from '../models';
import {
  getTagAndCommandText,
  say,
  makeArrayString,
  matchCard,
  getCardText,
} from '../util';
import {BaseCommand} from './BaseCommand';

export class CardCommand extends BaseCommand {
  timeout = 2000;

  getCard = async (message: Message, isGold: boolean = false) => {
    const check = this.timeoutCheck();
    if (!check) return;

    const [cardName, tag] = getTagAndCommandText(message);
    if (!cardName) {
      say(
        message.channel,
        `Please type !card <cardName> or !gcard for golden to use this feature happ ${message.tags.username}`
      );

      return;
    }

    const possibleMatches = matchCard(
      cardName,
      isGold
        ? c => !!c.battlegroundsNormalDbfId
        : c => !!c.battlegroundsPremiumDbfId
    );

    if (possibleMatches) {
      if (possibleMatches instanceof Array && possibleMatches.length > 1)
        say(
          message.channel,
          `${cardName} matches ${makeArrayString(
            possibleMatches.map(c => c.name)
          )}, please be more specific. ${tag}`
        );
      else {
        const match = possibleMatches instanceof Array ? possibleMatches[0] : possibleMatches
        say(message.channel, `${getCardText(match)} ${tag}`);
      }
    }
  };
}
