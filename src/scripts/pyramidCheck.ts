import * as fs from 'fs';
import {ChatUserstate, Client} from 'tmi.js';

const FILENAME = 'src/cache/cache.json';

const pyramidCheck = (
  channel: string,
  tags: ChatUserstate,
  message: string,
  client: Client
) => {
  fs.readFile(FILENAME, async (err, jsonString) => {
    if (err) {
      console.log('File read failed:', err);
    } else {
      const json = JSON.parse(jsonString.toString());
      const cache = {
        lastUser: json['lastUser'],
        lastMessages: json['lastMessages'],
        isPyramidAttempt: json['isPyramidAttempt'],
      };

      if (tags.username && tags.username === cache['lastUser']) {
        if (cache['lastMessages'].length || message.split(' ').length === 1) {
          const first = cache['lastMessages'].length
            ? cache['lastMessages'][0]
            : message;
          const temp = cache['lastMessages'];
          temp.push(message);
          if (temp.length > 2) {
            const half = Math.ceil(temp.length / 2);
            const firstHalf: string[] = temp.slice(0, half);
            const lastHalf: string[] = temp.slice(half).reverse();

            let runningCheck = true;
            firstHalf.forEach((msg, i) => {
              if (i > 0 && runningCheck) {
                const words = msg.split(' ').map(s => s.trim());
                const lastWords = firstHalf[i - 1]
                  .split(' ')
                  .map(s => s.trim());
                runningCheck =
                  words.length - 1 === lastWords.length &&
                  words.every(w => w === first);
              }
            });

            cache['isPyramidAttempt'] = runningCheck;
            if (cache['isPyramidAttempt']) {
              if (tags.mod) {
                await client.say(
                  channel,
                  `no mod pyramids @${tags.username} KEKG`
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
                  await client.say(
                    channel,
                    `Congrats to ${tags.username} for a ${
                      temp[half].split(' ').length
                    } high pyramid! pogg`
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
      } else if (tags.username) {
        if (cache['isPyramidAttempt']) {
          client
            .say(
              channel,
              // `/timeout ${cache['lastUser']} 30 Failed pyramid`
              `@Bob69 Failed pyramid @${cache['lastUser']}`
            )
            .then(async () => {
              await client.say(
                channel,
                `@${cache['lastUser']} nife no failed pyramids allowed`
              );
            });
        }
        cache['lastUser'] = tags.username;
        cache['lastMessages'] = [];
        cache['lastMessages'].push(message);
        cache['isPyramidAttempt'] = false;
      }
      writeCache(cache);
    }
  });
};

const writeCache = (cache: object) => {
  fs.writeFileSync(FILENAME, JSON.stringify(cache));
};
export default pyramidCheck;
export {pyramidCheck};
