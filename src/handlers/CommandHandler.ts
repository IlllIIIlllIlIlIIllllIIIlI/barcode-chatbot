import {BuddyCommand, CardCommand, HeroCommand} from '../commands';
import {Message} from '../models';

export class CommandHandler {
  private buddy: BuddyCommand;
  private cards: CardCommand;
  private heroes: HeroCommand;

  constructor() {
    this.buddy = new BuddyCommand();
    this.cards = new CardCommand();
    this.heroes = new HeroCommand();
  }

  handle = async (message: Message) => {
    switch (message.command) {
      case 'buddy':
        await this.buddy.get(message, '485160647');
        break;
      case 'gbuddy':
      case 'goldenbuddy':
        await this.buddy.get(message, '802395848', true);
        break;
      case 'card':
        await this.cards.getCard(message);
        break;
      case 'goldencard':
      case 'gcard':
        await this.cards.getCard(message, true);
        break;
      case 'hero':
        await this.heroes.get(message, '796606412');
        break;
    }
  };
}
