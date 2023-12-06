import {CardResponse} from '../interfaces';
import {Message} from '../models';
import {
  cleanString,
  getSpellText,
  getTagAndCommandText,
  makeArrayString,
  say,
} from '../util';
import {BaseCommand} from './BaseCommand';
import {readFileSync} from 'fs';
import {join} from 'path';

export class SpellCommand extends BaseCommand {
  timeout = 2000;

  getSpell = async (message: Message) => {
    const timeNow = new Date().getTime();
    if (timeNow - this.lastMessage > this.timeout) {
      const [spellName, tag] = getTagAndCommandText(message);
      if (!spellName) {
        say(
          message.channel,
          `Please type !spell <spellName> or to use this feature happ ${message.tags.username}`
        );
      } else {
        const allCards: CardResponse[] = JSON.parse(
          readFileSync(join(__dirname, '../data/cards.json'), 'utf-8')
        );

        const relevantSpells = allCards.filter(
          s => s.type == 'BATTLEGROUND_SPELL'
        );
        const exactMatch = relevantSpells.find(
          c => cleanString(c.name) === spellName
        );
        if (exactMatch) {
          say(message.channel, `${getSpellText(exactMatch)} ${tag}`);
        } else {
          // most likely match scenario
          const nextMatch = relevantSpells.filter(c =>
            cleanString(c.name).includes(spellName)
          );
          if (nextMatch.length) {
            switch (nextMatch.length) {
              case 1:
                say(message.channel, `${getSpellText(nextMatch[0])} ${tag}`);
                break;
              default:
                say(
                  message.channel,
                  `${spellName} matches ${makeArrayString(
                    nextMatch.map(c => c.name)
                  )}, please be more specific. ${tag}`
                );
            }
          } else {
            // last ditch effort to be useful
            const finalMatch = relevantSpells.filter(c =>
              spellName
                .split(' ')
                .some(n => cleanString(c.name).split(' ').includes(n))
            );
            if (finalMatch.length) {
              switch (finalMatch.length) {
                case 1:
                  say(message.channel, `${getSpellText(finalMatch[0])} ${tag}`);
                  break;
                default:
                  say(
                    message.channel,
                    `${spellName} matches ${makeArrayString(
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
