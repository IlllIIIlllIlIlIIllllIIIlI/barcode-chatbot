import {pyramidCheck} from './scripts/pyramidCheck';
import {Client} from './models/Client';
import {EventBus} from './models/EventBus';
import {Message} from './models/Message';

const _initBus = () => {
  const bus = new EventBus<Message>();
  bus.listen(m => !!m.tags.username, pyramidCheck);

  return bus;
};

const main = () => {
  const bus = _initBus();

  Client.Instance.client.connect().catch(console.error);
  Client.Instance.client.on('message', (channel, tags, message, self) => {
    // Ignore echoed messages.
    if (self) return;

    const msg = new Message(channel, message, tags);
    bus.trigger(msg);
  });
};

main();
