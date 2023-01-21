import {Cache, Client, Message, Logger, DailyChatter} from '../models';

const handlePyramids = (message: Message) => {
  chatCheck(message)
    .catch(Logger.Error)
    .then(() => {
      let chatter = Cache.Instance.chatters.find(
        c => c.username === message.tags.username
      );
      if (!chatter) {
        chatter = new DailyChatter(undefined, message.tags.username);
        Cache.Instance.chatters.push(chatter);
      }
      if (chatter.lastMessages.length > 9) {
        chatter.lastMessages.pop();
      }

      chatter.lastMessages.push(message.message);
      userCheck(chatter, message.channel);
    })
    .catch(Logger.Error);
};

const chatCheck = async (message: Message) => {
  if (Cache.Instance.lastMessages.length > 9) {
    Cache.Instance.lastMessages.pop();
  }

  Cache.Instance.lastMessages.push(message);
  Cache.Instance.isPyramidAttempt = firstCheck(
    Cache.Instance.lastMessages.map(m => m.message)
  );
};

const userCheck = (chatter: DailyChatter, channel: string) => {
  if (!Cache.Instance.lastChatter) {
    Cache.Instance.lastChatter = chatter;
  }
  const lastChatter = Cache.Instance.lastChatter;

  if (lastChatter.attemptingPyramid && lastChatter.lastMessages.length > 2) {
    if (
      chatter.username !== lastChatter.username &&
      !Cache.Instance.isPyramidAttempt
    ) {
      lastChatter.dailyFailedPyramids++;
      lastChatter.totalFailedPyramids++;
      Client.Instance.client
        .say(
          channel,
          `Bob69 Failed pyramid @${lastChatter.username} \n They have failed ${lastChatter.dailyFailedPyramids} today!`
        )
        .catch(Logger.Error)
        .finally(() => {
          lastChatter.lastMessages = [];
          lastChatter.attemptingPyramid = false;

          Cache.Instance.lastMessages = [];
        });
    } else {
      if (secondCheck(lastChatter.lastMessages)) {
        lastChatter.dailySuccessfulPyramids++;
        lastChatter.totalSuccessfulPyrmaids++;
        Client.Instance.client
          .say(
            channel,
            `Congrats to ${lastChatter.username} for a ${lastChatter.lastMessages[0]} pyramid! \n They have completed ${lastChatter.totalSuccessfulPyrmaids} all-time!`
          )
          .catch(Logger.Error)
          .finally(() => {
            lastChatter.lastMessages = [];
            lastChatter.attemptingPyramid = false;

            Cache.Instance.lastMessages = [];
            Cache.Instance.isPyramidAttempt = false;
          });
      }
    }
  }

  chatter.attemptingPyramid = firstCheck(chatter.lastMessages);
  if (!chatter.attemptingPyramid) {
    chatter.lastMessages = [];
  }
  Cache.Instance.lastChatter = chatter;
};

const firstCheck = (messages: string[]): boolean => {
  const first = messages[0].trim();
  const allWords = messages.map(m => m.split(' ').map(s => s.trim()));
  if (!allWords.map(w => w.every(ww => ww === first)).every(b => !!b)) {
    return false;
  }

  const half = Math.ceil(messages.length / 2);
  const firstHalf = messages.slice(0, half);

  // Run check for the "stairs" at the start of a pyramid
  let runningCheck = true;
  firstHalf.forEach((msg, i) => {
    if (i > 0 && runningCheck) {
      const words = msg.split(' ').map(s => s.trim());
      const lastWords = firstHalf[i - 1].split(' ').map(s => s.trim());
      runningCheck =
        words.length - 1 === lastWords.length && words.every(w => w === first);
    }
  });

  return runningCheck;
};

const secondCheck = (messages: string[]) => {
  let isSymmetric = true;
  for (let i = 0; i < messages.length / 2; i++) {
    if (messages[i] !== messages[messages.length - i - 1]) {
      isSymmetric = false;
      break;
    }
  }

  return isSymmetric;
};

export default handlePyramids;
export {handlePyramids};
