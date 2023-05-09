import {PrismaClient} from '@prisma/client';
import {Message} from '../models';
import {
  getTagAndCommandText,
  say,
  makeArrayString,
  cleanString,
  getText,
} from '../util';
import {BaseCommand} from './BaseCommand';
import {CardService} from '../services';

export class CardCommand extends BaseCommand {
  timeout = 5000;
  db: PrismaClient;
  cardService: CardService;

  constructor() {
    super();
    this.db = new PrismaClient();
    this.cardService = new CardService();
  }

  getCard = async (message: Message, isGold: boolean = false) => {
    const allCards = await this.db.card.findMany({
      where: {
        isHero: false,
        isGold: isGold,
      },
      include: {
        minionTypes: true,
      },
    });
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
        const cards = allCards.filter(
          c =>
            cleanString(c.name) === cardName ||
            cleanString(c.name).includes(cardName) ||
            cardName
              .split(' ')
              .some(n => cleanString(c.name).split(' ').includes(n))
        );
        const match = cards.find(c => cleanString(c.name) === cardName);
        if (match) {
          say(
            message.channel,
            `${isGold ? 'Golden ' : ''}${getText(match)} ${tag}`
          );
        } else {
          switch (cards.length) {
            case 1:
              say(
                message.channel,
                `${isGold ? 'Golden ' : ''}${getText(cards[0])} ${tag}`
              );
              break;
            case 0:
              break;
            default:
              say(
                message.channel,
                `${cardName} matches ${makeArrayString(
                  cards.map(c => c.name)
                )}, please be more specific. ${tag}`
              );
          }
        }
      }
    }
  };
}
