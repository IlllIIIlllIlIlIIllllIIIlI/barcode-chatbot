import {AdminHandler, CommandHandler, MessageHandler} from '../handlers';
import {Message} from '../models';
import {EventBus, Logger} from '../infra';
import {TwitchClient} from '../clients';

export const initBus = () => {
  const bus = new EventBus<Message>();
  const commandHandler = new CommandHandler();
  const adminHandler = new AdminHandler();
  const messageHandler = new MessageHandler();

  bus.listen(m => m.message.includes('barcode_chatbot'), Logger.Chat);
  bus.listen(m => !m.isCommand && !m.isBot, messageHandler.handle);
  bus.listen(m => m.isCommand && !m.isAdmin, commandHandler.handle);
  bus.listen(m => m.isAdmin, adminHandler.handle);

  return bus;
};

export const say = async (channel: string, message: string) => {
  await TwitchClient.Instance.connection
    ?.say(channel, message)
    .catch(Logger.Error);
};
