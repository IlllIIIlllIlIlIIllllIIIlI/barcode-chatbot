import {AdminHandler, CommandHandler} from '../handlers';
import {Message} from '../models';
import {Config, EventBus, Logger} from '../infra';
import {TwitchClient} from '../clients';

export const initBus = () => {
  const bus = new EventBus<Message>();
  const commandHandler = new CommandHandler();
  const adminHandler = new AdminHandler();
  const config = new Config();

  bus.listen(m => m.message.includes(config.USERNAME), Logger.Chat);
  bus.listen(m => m.isCommand && !m.isAdmin, commandHandler.handle);
  bus.listen(m => m.isAdmin, adminHandler.handle);

  return bus;
};

export const say = async (channel: string, message: string) => {
  await TwitchClient.Instance.connection
    .say(channel, message)
    .catch(Logger.Error);
};
