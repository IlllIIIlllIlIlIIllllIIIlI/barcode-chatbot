import {Buddy, Message} from '../models';
import {say, makeArrayString, getTagAndCommandText} from '../util';
import PublicGoogleSheetsParser from 'public-google-sheets-parser';
import {BaseCommand} from './BaseCommand';

export class BuddyCommand extends BaseCommand {
  timeout: number = 2000;
  bookId: string = '14HIzwwJHrse0zgkdkKlycAue7Y7EGQSOthHZST4ArSY';

  get = async (message: Message, sheetId: string, isGold: boolean = false) => {
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
        const parser = new PublicGoogleSheetsParser();
        const data = await parser.parse(this.bookId, {sheetId: sheetId});
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
}
