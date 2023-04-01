import {Message} from '../models';
import {say} from '../util';

export class AdminHandler {
  handle = async (message: Message) => {
    switch (message.command) {
      default:
        await say(message.channel, 'Command not implemented yet, sorry!');
        break;
    }
  };
}
