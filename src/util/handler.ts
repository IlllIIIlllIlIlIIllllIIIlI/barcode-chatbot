import {connection, Message} from 'websocket';
import {pyramidCheck} from '../scripts/pyramidCheck';
import {parseMessage} from './parser';

const handleMessage = (
  message: Message,
  connection: connection,
  channel: string
) => {
  if (message.type === 'utf8') {
    const cleanMessage = message.utf8Data.trim();
    const messages = cleanMessage.split('\r\n');

    messages.forEach(msg => {
      const parsedMessage = parseMessage(msg);
      if (parsedMessage.command && parsedMessage.command.command) {
        switch (parsedMessage.command.command) {
          case 'PING':
            connection.sendUTF('PONG ' + parsedMessage.parameters);
            break;
          case '001':
            connection.sendUTF(`JOIN ${channel}`);
            break;
          case 'PART':
            console.log('The channel must have banned (/ban) the bot.');
            connection.close();
            break;
          case 'NOTICE':
            if ('Login authentication failed' === parsedMessage.parameters) {
              console.log(`Authentication failed; left ${channel}`);
              connection.sendUTF(`PART ${channel}`);
            } else if (
              'You don’t have permission to perform that action' ===
              parsedMessage.parameters
            ) {
              console.log(
                `No permission. Check if the access token is still valid. Left ${channel}`
              );
              connection.sendUTF(`PART ${channel}`);
            }
            break;
          case 'PRIVMSG':
            pyramidCheck(parsedMessage, connection);
            break;
          default:
        }
      }
    });
  }
};

export default handleMessage;
export {handleMessage};
