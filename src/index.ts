import {pyramidCheck} from './scripts/pyramidCheck';
import {Client} from './models/Client';
import {EventBus} from './models/EventBus';
import {Message} from './models/Message';
import {Logger} from './models/Logger';
import {handleCommands, handleAdminCommands} from './scripts/commandHandler';

const _initBus = () => {
  const bus = new EventBus<Message>();
  bus.listen(m => !!m.tags.username && !m.isCommand, pyramidCheck);
  bus.listen(m => m.isCommand && !m.isAdmin, handleCommands);
  bus.listen(m => m.isAdmin, handleAdminCommands);

  return bus;
};

const main = () => {
  const bus = _initBus();

  Client.Instance.client.connect().catch(Logger.Instance.Error);
  Client.Instance.client.on('message', (channel, tags, message, self) => {
    // Ignore echoed messages.
    if (self) return;

    bus.trigger(new Message(channel, message, tags));
  });
};

main();
