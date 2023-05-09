import {ChatUserstate} from 'tmi.js';

const adminCommands: string[] = ['updatecards'];
const bots = ['robonito', 'streamelements'];
const powerUsers = ['illliiilllililiilllliiili'];
const regex = /[^\x00-\x7F]/g;

export class Message {
  channel: string;
  message: string;
  tags: ChatUserstate;

  isCommand;
  command: string | null;
  isAdmin;
  isBot;

  constructor(channel: string, message: string, tags: ChatUserstate) {
    this.channel = channel;
    this.message = message.replace(regex, '').trim();
    this.tags = tags;

    this.isBot =
      this.tags.username && bots.includes(this.tags.username.toLowerCase());

    this.isCommand = !this.isBot && this.message[0] === '!';

    this.command =
      this.isCommand && this.tags.username
        ? this.message.split(' ')[0].replace('!', '').toLowerCase()
        : null;

    this.isAdmin =
      !!this.command &&
      !!this.tags.username &&
      (!!this.tags.mod ||
        powerUsers.includes(this.tags.username.toLowerCase())) &&
      adminCommands.includes(this.command);
  }
}
