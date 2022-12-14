import {ChatUserstate} from 'tmi.js';

export class Message {
  private adminCommands = ['add', 'remove', 'stop', 'start'];

  channel: string;
  message: string;
  tags: ChatUserstate;

  messageArr: string[];
  isCommand;
  command: string | null;
  isAdmin;

  constructor(channel: string, message: string, tags: ChatUserstate) {
    this.channel = channel;
    this.message = message;
    this.tags = tags;

    this.messageArr = message.split(' ').map(s => s.trim());
    this.isCommand = this.messageArr[0][0] === '!';
    this.command =
      this.isCommand && this.tags.username
        ? this.messageArr[0].replace('!', '')
        : null;
    this.isAdmin =
      this.isCommand &&
      this.command === 'barbot' &&
      this.messageArr.length > 1 &&
      !!this.tags.mod &&
      this.adminCommands.includes(this.messageArr[1]);
  }
}
