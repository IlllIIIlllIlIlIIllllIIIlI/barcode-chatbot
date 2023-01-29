import {Message, Cache, Logger} from '../models';
import {saveAndLoadChatters, say} from '../scripts';

export const handleCommands = (message: Message) => {};

export const handleAdminCommands = async (message: Message) => {
  switch (message.command?.split(' ')[0]) {
    case 'pyramids':
      await leaderboard(message.channel);
      break;
    case 'reset':
      await saveAndLoadChatters(true);
      await say(message.channel, 'Daily stats reset!');
      break;
    case 'log':
      Cache.Log();
      await say(message.channel, 'Chat logged!');
      break;
    default:
      await say(message.channel, 'Command not implemented yet, sorry!');
  }
};

const leaderboard = async (channel: string) => {
  const topChatters = Cache.Instance.chatters
    .filter(c => c.totalSuccessfulPyrmaids > 0)
    .sort((a, b) =>
      a.totalSuccessfulPyrmaids - b.totalSuccessfulPyrmaids ||
      a.totalFailedPyramids - b.totalFailedPyramids ||
      a.dailySuccessfulPyramids - b.dailySuccessfulPyramids ||
      a.dailyFailedPyramids - b.dailyFailedPyramids ||
      a.username > b.username
        ? 1
        : -1
    )
    .reverse()
    .slice(0, 10);

  let msg = 'Top Pyramid Creators: ';
  topChatters.forEach((c, i) => {
    msg += `|| #${i + 1}: ${c.username} - ${c.totalSuccessfulPyrmaids} `;
  });

  await say(channel, msg).catch(Logger.Error);
};
