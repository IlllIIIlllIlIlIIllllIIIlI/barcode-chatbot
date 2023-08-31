import {Message} from '../models';
import {say} from '../util';

export class MessageHandler {
  buddyCount = 0;
  anomalyCount = 0;

  handle = async (message: Message) => {
    await Promise.all([
      // this.buddyCheck(message),
      this.anomalyCheck(message),
    ]);
  };

  private buddyCheck = async (message: Message) => {
    if (this.isDumbMessageCheck(message, 'buddy')) {
      this.buddyCount++;
      await say(
        message.channel,
        `I wonder if there is a bot that accepts !buddy <heroName> you could ask WeirdChamp ${message.tags.username}. Times triggered: ${this.buddyCount}`
      );
    }
  };

  private anomalyCheck = async (message: Message) => {
    if (this.isDumbMessageCheck(message, 'anomaly')) {
      this.anomalyCount++;
      await say(
        message.channel,
        `I wonder if there is a pinned message you could read that would answer your question ${message.tags.username}. Times triggered: ${this.anomalyCount}`
      );
    }
  };

  private isDumbMessageCheck = (message: Message, checkFor: string) => {
    return (
      message.message &&
      message.message.toLowerCase().includes('what') &&
      message.message
        .toLowerCase()
        .substring(message.message.toLowerCase().indexOf('what'))
        .includes(checkFor) &&
      (message.message
        .toLowerCase()
        .substring(message.message.toLowerCase().indexOf('what'))
        .includes('does') ||
        message.message
          .toLowerCase()
          .substring(message.message.toLowerCase().indexOf('what'))
          .includes('do') ||
        message.message
          .toLowerCase()
          .substring(message.message.toLowerCase().indexOf('what'))
          .includes('is this'))
    );
  };
}
