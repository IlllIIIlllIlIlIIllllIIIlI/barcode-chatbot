import {Card, PrismaClient} from '@prisma/client';
import {Message} from '../models';
import {getTagAndCommandText, say} from '../util';
import {BaseCommand} from './BaseCommand';
import Fuse from 'fuse.js';
import {CardService} from '../services';

export class CardCommand extends BaseCommand {
  timeout = 5000;
  db: PrismaClient;
  cardService: CardService;
  searchableCards: Fuse<Card> | null = null;
  searchableHeroes: Fuse<Card> | null = null;

  constructor() {
    super();
    this.db = new PrismaClient();
    this.cardService = new CardService();
  }

  init = async () => {
    await this.set();

    setInterval(async () => {
      await this.cardService.updateCards();
      await this.set();
    }, 86400000);
  };

  private set = async () => {
    const cards = await this.db.card.findMany({
      where: {
        isHero: false,
      },
    });
    const heroes = await this.db.card.findMany({
      where: {
        isHero: true,
      },
    });

    this.searchableCards = new Fuse(cards);
    this.searchableHeroes = new Fuse(heroes);
  };

  getCard = async (message: Message) => {
    const timeNow = new Date().getTime();
    if (timeNow - this.lastMessage > this.timeout) {
      this.lastMessage = timeNow;
      const [cardName, tag] = getTagAndCommandText(message);
      if (!cardName) {
        say(
          message.channel,
          `Please type !card <cardName> (or !gcard for golden) to use this feature happ ${message.tags.username}`
        );
      } else {
      }
    }
  };
}
