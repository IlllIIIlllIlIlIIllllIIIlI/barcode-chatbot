import {ChatUserstate} from 'tmi.js';

export class Message {
  private adminCommands = ['leaderboard', 'reset'];
  private bots = ['robonito', 'streamelements'];
  private powerUsers = ['illliiilllililiilllliiili'];

  channel: string;
  message: string;
  tags: ChatUserstate;

  isCommand;
  command: string | null;
  isAdmin;
  isBot;

  constructor(channel: string, message: string, tags: ChatUserstate) {
    this.channel = channel;
    this.message = message.trim();
    this.tags = tags;

    this.isBot =
      this.tags.username &&
      this.bots.includes(this.tags.username.toLowerCase());

    this.isCommand = !this.isBot && this.message[0] === '!';

    this.command =
      this.isCommand && this.tags.username
        ? this.message.replace('!', '')
        : null;

    this.isAdmin =
      !!this.command &&
      !!this.tags.username &&
      (!!this.tags.mod ||
        this.powerUsers.includes(this.tags.username.toLowerCase())) &&
      this.adminCommands.includes(this.command);
  }
}
