import {ChatUserstate, Client} from 'tmi.js';
import {Cache} from '../models/Cache';

const pyramidCheck = async (
  channel: string,
  tags: ChatUserstate,
  message: string,
  client: Client,
  cache: Cache
) => {
  // Handle server messages
  if (!tags.username) return cache;

  // Check for repeated messages
  if (tags.username === cache.lastUser) {
    // We only care if their message is 1 word, i.e. emote
    // So if we have already pushed an emote into lastMessages
    // or if this message is 1 word, we continue
    if (cache.lastMessages.length || message.split(' ').length === 1) {
      cache.lastMessages.push(message.trim());
      const first = cache.lastMessages[0].trim();

      // Arbitrary rule that failed pyramids have to reach their peak
      if (cache.lastMessages.length > 2) {
        const half = Math.ceil(cache.lastMessages.length / 2);
        const firstHalf: string[] = cache.lastMessages.slice(0, half);

        // Run check for the "stairs" at the start of a pyramid
        let runningCheck = true;
        firstHalf.forEach((msg, i) => {
          if (i > 0 && runningCheck) {
            const words = msg.split(' ').map(s => s.trim());
            const lastWords = firstHalf[i - 1].split(' ').map(s => s.trim());
            runningCheck =
              words.length - 1 === lastWords.length &&
              words.every(w => w === first);
          }
        });

        // If we have stairs, we always want to know an attempt is being made
        cache.isPyramidAttempt = runningCheck;
        if (cache.isPyramidAttempt) {
          if (tags.mod) {
            // KEKG Blankedx
            await client.say(channel, `no mod pyramids @${tags.username} KEKG`);
            cache.lastUser = null;
            cache.lastMessages = [];
            cache.isPyramidAttempt = false;
          } else {
            // Check back half for complete pyramid
            let isSymmetric = true;
            for (let i = 0; i < cache.lastMessages.length / 2; i++) {
              if (
                cache.lastMessages[i] !==
                cache.lastMessages[cache.lastMessages.length - i - 1]
              ) {
                isSymmetric = false;
                break;
              }
            }
            if (isSymmetric) {
              await client.say(
                channel,
                `Congrats to ${tags.username} for a ${
                  firstHalf[firstHalf.length - 1].split(' ').length
                } high pyramid! pogg`
              );

              cache.lastUser = null;
              cache.lastMessages = [];
              cache.isPyramidAttempt = false;
            }
          }
        } else if (message.split(' ').length === 1) {
          // No pyramid, but they still sent a single word
          // So we need to save it in cache in case they start one
          cache.lastUser = tags.username;
          cache.lastMessages = [];
          cache.lastMessages.push(message.trim());
          cache.isPyramidAttempt = false;
        } else {
          cache.lastUser = null;
          cache.lastMessages = [];
          cache.isPyramidAttempt = false;
        }
      }
    }
  } else {
    // If this user is not the same as the one in cache
    // And the cached user was attempting a pyramid
    // /timeout
    if (cache.isPyramidAttempt) {
      await client.say(channel, `@Bob69 Failed pyramid @${cache.lastUser}`);
    }
    cache.lastUser = tags.username;
    cache.lastMessages = [];
    cache.lastMessages.push(message.trim());
    cache.isPyramidAttempt = false;
  }

  return cache;
};

export default pyramidCheck;
export {pyramidCheck};
