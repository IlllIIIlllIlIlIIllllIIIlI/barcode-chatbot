import {Message} from '../models';
import {
  getTagAndCommandText,
  getTrinketText,
  makeArrayString,
  matchCard,
  say,
} from '../util';
import {BaseCommand} from './BaseCommand';

export class TrinketCommand extends BaseCommand {
  timeout = 2000;

  getSpell = async (message: Message) => {
    const check = this.timeoutCheck();
    if (!check) return;

    const [spellName, tag] = getTagAndCommandText(message);
    if (!spellName) {
      say(
        message.channel,
        `Please type !trinket <trinketName> or to use this feature happ ${message.tags.username}`
      );

      return;
    }

    const possibleMatches = matchCard(
      spellName,
      s => s.type == 'BATTLEGROUND_TRINKET'
    );

    if (possibleMatches) {
      if (possibleMatches instanceof Array && possibleMatches.length > 1)
        say(
          message.channel,
          `${spellName} matches ${makeArrayString(
            possibleMatches.map(c => c.name)
          )}, please be more specific. ${tag}`
        );
      else {
        const match =
          possibleMatches instanceof Array
            ? possibleMatches[0]
            : possibleMatches;
        say(message.channel, `${getTrinketText(match)} ${tag}`);
      }
    }
  };
}
