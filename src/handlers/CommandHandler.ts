import {BuddyCommand, CardCommand} from '../commands';
import {Message} from '../models';

export class CommandHandler {
  private buddy: BuddyCommand;
  private cards: CardCommand;

  constructor() {
    this.buddy = new BuddyCommand();
    this.cards = new CardCommand();
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
      // case 'goldencard':
      // case 'gcard':
      //   await this.cards.getCard(message, false, true);
      //   break;
      // case 'hero':
      //   await this.cards.getCard(message, true);
      //   break;
    }
  };
}
