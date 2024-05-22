import {Message} from '../models';
import {CardService} from '../services';
import {say} from '../util';

export class AdminHandler {
  cardService: CardService;

  constructor() {
    this.cardService = new CardService();
  }
  handle = async (message: Message) => {
    switch (message.command) {
      case 'updatecards':
        this.cardService.updateCards();
        say(message.channel, 'Cards Updated!');
    }
  };
}
