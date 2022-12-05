import {Cache} from '../models/Cache';
import {Client} from '../models/Client';
import {Message} from '../models/Message';

const pyramidCheck = (message: Message) => {
  const cache = Cache.Instance;

  // Check for repeated messages
  if (message.tags.username === cache.lastUser) {
    // We only care if their message is 1 word, i.e. emote
    // So if we have already pushed an emote into lastMessages
    // or if this message is 1 word, we continue
    if (cache.lastMessages.length || message.message.split(' ').length === 1) {
      cache.lastMessages.push(message.message.trim());
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
          if (message.tags.mod) {
            // KEKG Blankedx
            Client.Instance.client
              .say(
                message.channel,
                `no mod pyramids @${message.tags.username} KEKG`
              )
              .catch(console.error);
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
              Client.Instance.client
                .say(
                  message.channel,
                  `Congrats to ${message.tags.username} for a ${
                    firstHalf[firstHalf.length - 1].split(' ').length
                  } high pyramid! pogg`
                )
                .catch(console.error);

              cache.lastUser = null;
              cache.lastMessages = [];
              cache.isPyramidAttempt = false;
            }
          }
        } else if (message.message.split(' ').length === 1) {
          // No pyramid, but they still sent a single word
          // So we need to save it in cache in case they start one
          cache.lastUser = message.tags.username;
          cache.lastMessages = [];
          cache.lastMessages.push(message.message.trim());
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
      Client.Instance.client
        .say(message.channel, `@Bob69 Failed pyramid @${cache.lastUser}`)
        .catch(console.error);
    }
    cache.lastUser = message.tags.username ?? null;
    cache.lastMessages = [];
    cache.lastMessages.push(message.message.trim());
    cache.isPyramidAttempt = false;
  }
};

export default pyramidCheck;
export {pyramidCheck};
