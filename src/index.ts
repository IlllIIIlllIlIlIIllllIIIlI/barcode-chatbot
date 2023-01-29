import {Client, EventBus, Message, Logger, Cache} from './models';
import {
  handleCommands,
  handleAdminCommands,
  handlePyramids,
  saveAndLoadChatters,
  say,
} from './scripts';

const _initBus = () => {
  const bus = new EventBus<Message>();

  bus.listen(m => !!m.tags.username && !m.isCommand, handlePyramids);
  bus.listen(m => m.isCommand && !m.isAdmin, handleCommands);
  bus.listen(m => m.isAdmin, handleAdminCommands);

  return bus;
};

const main = async () => {
  const bus = _initBus();
  await Cache.Load();

  setInterval(async () => {
    await saveAndLoadChatters();
  }, 3600000);

  Client.Instance.client.connect().catch(Logger.Error);
  Client.Instance.client.on('message', (channel, tags, message, self) => {
    if (self) return;

    bus.trigger(new Message(channel, message, tags));
  });
  Client.Instance.client.on('redeem', (channel, _, type, ___) => {
    if (type === '00c5b9f1-ff6f-4bfd-978f-ccaf99d76a2e') {
      say(channel, '-500k KEKW');
    }
  });
};

main();
