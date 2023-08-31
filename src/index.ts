import {Message} from './models';
import {TwitchClient} from './clients';
import {initBus, say} from './util';
import {Logger} from './infra';
import {CardService} from './services';

const main = async () => {
  const cardService = new CardService();
  const bus = initBus();

  cardService.init();

  TwitchClient.Instance.connection.connect().catch(Logger.Error);
  TwitchClient.Instance.connection.on(
    'message',
    (channel, tags, message, self) => {
      if (self) return;

      bus.trigger(new Message(channel, message, tags));
    }
  );
  TwitchClient.Instance.connection.on('redeem', (channel, _, type, ___) => {
    if (type === '00c5b9f1-ff6f-4bfd-978f-ccaf99d76a2e') {
      setTimeout(() => {
        say(channel, '-500k KEKW');
      }, 1000);
    }
  });
};

main();
