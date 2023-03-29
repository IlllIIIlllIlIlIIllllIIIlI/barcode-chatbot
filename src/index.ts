import {Client, Message, Logger} from './models';
import {initBus, say} from './scripts';

const main = async () => {
  const bus = initBus();

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
