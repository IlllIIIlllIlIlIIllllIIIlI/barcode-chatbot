import {Buddy, Message} from '../models';
import {say, cleanString} from '../scripts';
import PublicGoogleSheetsParser from 'public-google-sheets-parser';

export const handleCommands = async (message: Message) => {
  switch (message.command) {
    case 'buddy':
      await getBuddy(message, '485160647');
      break;
    case 'gbuddy':
    case 'goldenbuddy':
      await getBuddy(message, '802395848', true);
      break;
  }
};

export const handleAdminCommands = async (message: Message) => {
  switch (message.command) {
    default:
      await say(message.channel, 'Command not implemented yet, sorry!');
      break;
  }
};

let lastMessage: number;

const getBuddy = async (
  message: Message,
  sheetId: string,
  isGold: boolean = false
) => {
  const timeNow = new Date().getTime();
  if (!lastMessage || timeNow - lastMessage > 2 * 1000) {
    lastMessage = timeNow;
    let heroName = cleanString(message.message, 1);
    if (!heroName) {
      say(
        message.channel,
        `Please type !buddy <heroName> (or !gbuddy for golden) to use this feature happ ${message.tags.username}`
      );
    } else {
      const tag =
        heroName.split(' ').find(s => s.includes('@')) ?? message.tags.username;
      if (tag && tag.replace('@', '') !== heroName) {
        heroName = cleanString(heroName.replace(tag, ''))
          .replace(/\s+/g, ' ')
          .trim();
      }
      lastMessage = timeNow;
      const bookId = '14HIzwwJHrse0zgkdkKlycAue7Y7EGQSOthHZST4ArSY';
      const parser = new PublicGoogleSheetsParser();
      const data = await parser.parse(bookId, {sheetId: sheetId});
      const buddies: Buddy[] = data.map((b: Buddy) => new Buddy(b));
      const buddy = buddies.filter(b => b.isHero(heroName) && !!b.Name);
      switch (buddy.length) {
        case 1:
          say(
            message.channel,
            `${isGold ? 'Golden ' : ''}${buddy[0].fullText()} ${tag}`
          );
          break;
        case 0:
          break;
        default:
          say(
            message.channel,
            `${heroName} matches ${makeArrayString(
              buddy.map(b => b.Hero)
            )}, please be more specific. ${tag}`
          );
      }
    }
  }
};

const makeArrayString = (arr: string[]) => {
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  const len = Math.min(5, arr.length - 1);
  const firsts = arr.slice(0, len);
  const last = arr[len];
  if (arr.length > 5) {
    return firsts.join(', ') + ', ' + last + `, and ${arr.length - 5} more`;
  }
  return firsts.join(', ') + ' and ' + last;
};
