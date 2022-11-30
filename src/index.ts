import {client as web_client} from 'websocket';
import handleMessage from './util/handler';
import config from './models/Config';
import * as fs from 'fs';

const main = async () => {
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
  const client = new web_client();
  const channel = '#barcode_chatbot';
  const account = 'barcode_chatbot';
  const password = `oauth:${config.OAUTH}`;

  client.on('connectFailed', error => {
    console.log(`Connect Error: ${error.toString()}`);
  });

  client.on('connect', connection => {
    connection.sendUTF(`PASS ${password}`);
    connection.sendUTF(`NICK ${account}`);

    connection.on('error', error => {
      console.log(`Connect Error: ${error.toString()}`);
    });

    connection.on('close', () => {
      console.log('Connection Closed');
      console.log(`close description: ${connection.closeDescription}`);
      console.log(`close reason code: ${connection.closeReasonCode}`);
    });

    connection.on('message', message => {
      handleMessage(message, connection, channel);
    });
  });

  client.connect('wss://irc-ws.chat.twitch.tv:443');
};

main();
