import {Client} from 'tmi.js';
import * as fs from 'fs';
import {pyramidCheck} from './scripts/pyramidCheck';
import config from './models/Config';

const main = () => {
  fs.readFile('src/cache/cache-template.json', (err, jsonString) => {
    if (err) {
      console.log('File read failed:', err);
    } else {
      fs.writeFile('src/cache/cache.json', jsonString, err => {
        if (err) {
          console.log('Error writing file', err);
        }
      });
    }
  });
  const client = new Client({
    options: {debug: true},
    identity: {
      username: 'barcode_chatbot',
      password: `oauth:${config.OAUTH}`,
    },
    channels: ['dogdog'],
  });

  client.connect().catch(console.error);

  client.on('message', (channel, tags, message, self) => {
    // Ignore echoed messages.
    if (self) return;

    pyramidCheck(channel, tags, message, client);
  });
};

main();
