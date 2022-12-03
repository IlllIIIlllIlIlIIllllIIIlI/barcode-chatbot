import {Client} from 'tmi.js';
import {pyramidCheck} from './scripts/pyramidCheck';
import {sanitizedConfig} from './models/Config';
import {Cache} from './models/Cache';

const main = () => {
  const config = sanitizedConfig;
  let cache = new Cache();
  const client = new Client({
    options: {debug: config.DEBUG},
    identity: {
      username: 'barcode_chatbot',
      password: `oauth:${config.OAUTH}`,
    },
    channels: ['dogdog'],
  });

  client.connect().catch(console.error);

  client.on('message', async (channel, tags, message, self) => {
    // Ignore echoed messages.
    if (self) return;

    cache = await pyramidCheck(channel, tags, message, client, cache);
  });
};

main();
