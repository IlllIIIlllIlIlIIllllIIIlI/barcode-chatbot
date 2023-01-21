import {Client, EventBus, Message, Logger, Cache} from './models';
import {
  handleCommands,
  handleAdminCommands,
  handlePyramids,
  saveAndLoadChatters,
} from './scripts';

const _initBus = () => {
  const bus = new EventBus<Message>();

  bus.listen(
    m => !m.isBot && !!m.tags.username && !m.isCommand,
    handlePyramids
  );
  bus.listen(m => m.isCommand && !m.isAdmin, handleCommands);
  bus.listen(m => m.isAdmin, handleAdminCommands);

  return bus;
};

const main = async () => {
  const bus = _initBus();
  await Cache.Load();

  setInterval(async () => {
    await saveAndLoadChatters();
  }, 360000);

  Client.Instance.client.connect().catch(Logger.Error);
  Client.Instance.client.on('message', (channel, tags, message, self) => {
    // Ignore echoed messages.
    if (self) return;

    bus.trigger(new Message(channel, message, tags));
  });
};

main();
