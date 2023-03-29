import {Cache, Message, Logger, DailyChatter} from '../models';
import {isLive, say} from './misc';

const handlePyramids = async (message: Message) => {
  await chatCheck(message).catch(err => {
    console.log(err);
    Logger.Error(err as string);
  });

  let chatter = Cache.Instance.chatters.find(
    c => c.username === message.tags.username
  );

  if (!chatter) {
    chatter = new DailyChatter(undefined, message.tags.username);
    Cache.Instance.chatters.push(chatter);
  }

  chatter.lastMessages.push(message.message);
  await userCheck(chatter, message.channel).catch(err => {
    console.log(err);
    Logger.Error(err);
  });
};

const chatCheck = async (message: Message) => {
  if (
    !!Cache.Instance.lastMessages.length ||
    message.message.split(' ').length === 1
  ) {
    Cache.Instance.lastMessages.push(message);
    Cache.Instance.isPyramidAttempt = firstCheck(
      Cache.Instance.lastMessages.map(m => m.message)
    );

    if (Cache.Instance.isPyramidAttempt) {
      Cache.Log();
    }
  }
};

const userCheck = async (chatter: DailyChatter, channel: string) => {
  if (!Cache.Instance.lastChatter) {
    Cache.Instance.lastChatter = chatter;
  }
  const lastChatter = Cache.Instance.lastChatter;

  if (lastChatter.attemptingPyramid && lastChatter.lastMessages.length > 2) {
    const live = await isLive(channel);
    Cache.Log();
    if (
      chatter.username !== lastChatter.username &&
      !Cache.Instance.isPyramidAttempt &&
      live
    ) {
      lastChatter.dailyFailedPyramids++;
      lastChatter.totalFailedPyramids++;
      await say(
        channel,
        `Bob69 Failed pyramid @${lastChatter.username} They have failed ${lastChatter.dailyFailedPyramids} today!`
      );
      lastChatter.lastMessages = [];
      lastChatter.attemptingPyramid = false;

      Cache.Instance.lastMessages = [];
    } else if (secondCheck(lastChatter.lastMessages) && live) {
      lastChatter.dailySuccessfulPyramids++;
      lastChatter.totalSuccessfulPyrmaids++;

      await say(
        channel,
        `Congrats to ${lastChatter.username} for a ${lastChatter.lastMessages[0]} pyramid! They have completed ${lastChatter.totalSuccessfulPyrmaids} all-time!`
      );
      lastChatter.lastMessages = [];
      lastChatter.attemptingPyramid = false;

      Cache.Instance.lastMessages = [];
      Cache.Instance.isPyramidAttempt = false;
    }
  }

  if (!Cache.Instance.isPyramidAttempt) {
    Cache.Instance.lastMessages = [];
  }

  chatter.attemptingPyramid =
    firstCheck(chatter.lastMessages) || chatter.lastMessages.length < 2;
  if (!chatter.attemptingPyramid) {
    chatter.lastMessages = [];
  }
  Cache.Instance.lastChatter = chatter;
};

const firstCheck = (messages: string[]): boolean => {
  const first = messages[0].trim();
  const allWords = messages.map(m =>
    m
      .split(' ')
      .map(s => s.trim())
      .filter(s => !!s.length)
  );

  if (!allWords.map(w => w.every(ww => ww === first)).every(b => b)) {
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
