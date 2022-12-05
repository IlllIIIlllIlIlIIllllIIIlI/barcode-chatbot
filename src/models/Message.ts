import {ChatUserstate} from 'tmi.js';

export class Message {
  channel: string;
  message: string;
  tags: ChatUserstate;

  messageArr: string[];
  isCommand;

  constructor(channel: string, message: string, tags: ChatUserstate) {
    this.channel = channel;
    this.message = message;
    this.tags = tags;

    this.messageArr = message.split(' ').map(s => s.trim());
    this.isCommand = this.messageArr[0][0] === '!';
  }
}
