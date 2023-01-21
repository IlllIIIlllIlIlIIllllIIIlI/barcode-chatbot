import {Message, Client, Cache, Logger} from '../models';
import {saveAndLoadChatters} from '../scripts';

export const handleCommands = (message: Message) => {};
export const handleAdminCommands = (message: Message) => {
  switch (message.command?.split(' ')[0]) {
    case 'leaderboard':
      leaderboard(message.channel);
      break;
    case 'reset':
      saveAndLoadChatters(true).then(async () => {
        await Client.Instance.client
          .say(message.channel, 'Daily stats reset!')
          .catch(Logger.Error);
      });
      break;
    default:
      Client.Instance.client
        .say(message.channel, 'Command not implemented yet, sorry!')
        .catch(Logger.Error);
  }
};

const leaderboard = (channel: string) => {
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

  Client.Instance.client
    .say(channel, 'Top Pyramid Creators')
    .catch(Logger.Error)
    .then(() => {
      topChatters.forEach(async (c, i) => {
        await Client.Instance.client
          .say(
            channel,
            `#${i + 1} - ${c.username}: ${c.totalSuccessfulPyrmaids}`
          )
          .catch(Logger.Error);
      });
    });
};
