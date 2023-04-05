import {Message} from '../models';
import {say} from '../util';

export class MessageHandler {
  handle = async (message: Message) => {
    await this.buddyCheck(message);
  };

  private buddyCheck = async (message: Message) => {
    if (
      message.message &&
      message.message.toLowerCase().split(' ').includes('what') &&
      message.message.toLowerCase().split(' ').includes('does') &&
      message.message.toLowerCase().split(' ').includes('buddy')
    ) {
      await say(
        message.channel,
        `I wonder if there is a bot that accepts !buddy <heroName> you could ask WeirdChamp ${message.tags.username}`
      );
    }
  };
}
