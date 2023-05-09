import PublicGoogleSheetsParser from 'public-google-sheets-parser';
import {Hero, Message} from '../models';
import {getTagAndCommandText, makeArrayString, say} from '../util';
import {BaseCommand} from './BaseCommand';

export class HeroCommand extends BaseCommand {
  timeout: number = 2000;
  bookId: string = '14HIzwwJHrse0zgkdkKlycAue7Y7EGQSOthHZST4ArSY';

  get = async (message: Message, sheetId: string) => {
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
        const parser = new PublicGoogleSheetsParser();
        const data = await parser.parse(this.bookId, {sheetId: sheetId});
        const heroes: Hero[] = data.map((b: Hero) => new Hero(b));
        const hero = heroes.filter(b => b.isHero(heroName));
        switch (hero.length) {
          case 1:
            say(message.channel, `${hero[0].fullText()} ${tag}`);
            break;
          case 0:
            break;
          default:
            say(
              message.channel,
              `${heroName} matches ${makeArrayString(
                hero.map(b => b.Hero)
              )}, please be more specific. ${tag}`
            );
        }
      }
    }
  };
}
