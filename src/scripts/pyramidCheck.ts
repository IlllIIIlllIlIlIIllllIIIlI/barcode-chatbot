import {connection} from 'websocket';
import {ParsedMessage} from '../models/ParsedMessage';
import * as fs from 'fs';

const FILENAME = 'src/cache/cache.json';

const pyramidCheck = (message: ParsedMessage, connection: connection) => {
  fs.readFile(FILENAME, (err, jsonString) => {
    if (err) {
      console.log('File read failed:', err);
    } else {
      const json = JSON.parse(jsonString.toString());
      const cache = {
        lastUser: json['lastUser'],
        lastMessages: json['lastMessages'],
        isPyramidAttempt: json['isPyramidAttempt'],
      };

      if (message.source?.nick && message.source?.nick === cache['lastUser']) {
        if (
          cache['lastMessages'].length ||
          message.parameters.split(' ').length === 1
        ) {
          const first = cache['lastMessages'].length
            ? cache['lastMessages'][0]
            : message.parameters;
          const temp = cache['lastMessages'];
          temp.push(message.parameters);
          if (temp.length > 2) {
            const half = Math.ceil(temp.length / 2);
            const firstHalf: string[] = temp.slice(0, half);
            const lastHalf: string[] = temp.slice(half).reverse();

            let runningCheck = true;
            firstHalf.forEach((msg, i) => {
              if (i > 0 && runningCheck) {
                const words = msg.split(' ');
                const lastWords = firstHalf[i - 1].split(' ');
                runningCheck =
                  words.length - 1 === lastWords.length &&
                  words.every(w => w === first);
              }
            });

            cache['isPyramidAttempt'] = runningCheck;
            if (cache['isPyramidAttempt']) {
              if (
                message.tags &&
                message.tags['mod'] &&
                message.tags['mod'] === '1'
              ) {
                connection.sendUTF(
                  `PRIVMSG no mod pyramids @${message.source.nick} KEKG`
                );
                cache['lastUser'] = null;
                cache['lastMessages'] = [];
                cache['isPyramidAttempt'] = false;
                writeCache(cache);
              } else {
                lastHalf.forEach((msg, i) => {
                  if (i === 0) {
                    runningCheck =
                      msg.split(' ').length === 1 &&
                      msg.split(' ')[0] === first;
                  } else if (runningCheck) {
                    const words = msg.split(' ');
                    const lastWords = firstHalf[i - 1].split(' ');
                    runningCheck =
                      words.length - 1 === lastWords.length &&
                      words.every(w => w === first);
                  }
                });

                if (runningCheck) {
                  connection.sendUTF(
                    `PRIVMSG Congrats to ${message.source.nick} for a ${
                      temp[half].split(' ').length
                    } high pyramid! pogg`,
                    err => {
                      console.log(err);
                    }
                  );

                  cache['lastUser'] = null;
                  cache['lastMessages'] = [];
                  cache['isPyramidAttempt'] = false;
                  writeCache(cache);
                }
              }
            }
          }
        }
      } else if (message.source?.nick) {
        if (cache['isPyramidAttempt']) {
          connection.sendUTF(
            // `PRIVMSG /timeout ${message.source.nick} 300 Failed pyramid`
            `PRIVMSG @Bob69 Failed pyramid ${message.source.nick}`,
            err => {
              console.log(err);
            }
          );
          connection.sendUTF(
            `PRIVMSG @${message.source.nick} nife no failed pyramids allowed`,
            err => {
              console.log(err);
            }
          );
        }
        cache['lastUser'] = message.source?.nick;
        cache['lastMessages'] = [];
        cache['lastMessages'].push(message.parameters);
        cache['isPyramidAttempt'] = false;

        writeCache(cache);
      }
      writeCache(cache);
    }
  });
};

const writeCache = (cache: object) => {
  fs.writeFile(FILENAME, JSON.stringify(cache), err => {
    if (err) {
      console.log('Error writing file', err);
    }
  });
};
export default pyramidCheck;
export {pyramidCheck};
