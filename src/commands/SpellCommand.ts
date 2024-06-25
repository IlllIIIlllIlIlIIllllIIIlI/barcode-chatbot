import {Message} from '../models';
import {
  getSpellText,
  getTagAndCommandText,
  makeArrayString,
  matchCard,
  say,
} from '../util';
import {BaseCommand} from './BaseCommand';

export class SpellCommand extends BaseCommand {
  timeout = 2000;

  getSpell = async (message: Message) => {
    const check = this.timeoutCheck();
    if (!check) return;

    const [spellName, tag] = getTagAndCommandText(message);
    if (!spellName) {
      say(
        message.channel,
        `Please type !spell <spellName> or to use this feature happ ${message.tags.username}`
      );

      return;
    }

    const possibleMatches = matchCard(
      spellName,
      s => s.type == 'BATTLEGROUND_SPELL'
    );

    if (possibleMatches) {
      if (!Array.isArray(possibleMatches))
        say(message.channel, `${getSpellText(possibleMatches)} ${tag}`);
      else
        say(
          message.channel,
          `${spellName} matches ${makeArrayString(
            possibleMatches.map(c => c.name)
          )}, please be more specific. ${tag}`
        );
    }
  };
}
