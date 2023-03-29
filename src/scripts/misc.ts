import {handleAdminCommands, handleCommands} from '.';
import {Client, EventBus, Logger, Message, sanitizedConfig} from '../models/';

export const initBus = () => {
  const bus = new EventBus<Message>();

  bus.listen(m => m.message.includes(sanitizedConfig.USERNAME), Logger.Chat);
  bus.listen(m => m.isCommand && !m.isAdmin, handleCommands);
  bus.listen(m => m.isAdmin, handleAdminCommands);

  return bus;
};

export const say = async (channel: string, message: string) => {
  await Client.Instance.client.say(channel, message).catch(Logger.Error);
};

export const cleanString = (s: string, slice?: number) => {
  if (slice !== undefined) {
    return s
      .toLowerCase()
      .split(' ')
      .filter(s => !!s.length && s !== 'the')
      .map(s => s.replace(/\s+/g, ' ').trim())
      .slice(slice)
      .join(' ')
      .trim();
  }

  return s
    .toLowerCase()
    .split(' ')
    .filter(s => !!s.length && s !== 'the')
    .map(s => s.replace(/\s+/g, ' ').trim())
    .join(' ')
    .trim();
};
