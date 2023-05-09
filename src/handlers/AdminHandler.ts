import {Message} from '../models';
import {CardService} from '../services';
import {say} from '../util';

export class AdminHandler {
  handle = async (message: Message) => {
    switch (message.command) {
      case 'updatecards':
        const service = new CardService();
        await service.updateCards();
        await say(message.channel, `Cards updated! ${message.tags.username}`);
        break;
      default:
        await say(message.channel, 'Command not implemented yet, sorry!');
        break;
    }
  };
}
