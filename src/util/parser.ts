import {ParsedMessage} from '../models/ParsedMessage';

const parseMessage = (message: string) => {
  const parsedMessage = new ParsedMessage();

  let idx = 0;

  let rawTagsComponent = null;
  let rawSourceComponent = null;
  let rawCommandComponent = null;
  let rawParametersComponent = null;

  if (message[idx] === '@') {
    const endIdx = message.indexOf(' ');
    rawTagsComponent = message.slice(1, endIdx);
    idx = endIdx + 1; // Should now point to source colon (:).
  }

  if (message[idx] === ':') {
    idx += 1;
    const endIdx = message.indexOf(' ', idx);
    rawSourceComponent = message.slice(idx, endIdx);
    idx = endIdx + 1; // Should point to the command part of the message.
  }

  let endIdx = message.indexOf(':', idx);
  if (-1 === endIdx) {
    endIdx = message.length;
  }

  rawCommandComponent = message.slice(idx, endIdx).trim();

  if (endIdx !== message.length) {
    idx = endIdx + 1;
    rawParametersComponent = message.slice(idx);
  }

  parsedMessage.command = parseCommand(rawCommandComponent);
  if (rawTagsComponent) {
    parsedMessage.tags = parseTags(rawTagsComponent);
  }
  if (rawSourceComponent) {
    parsedMessage.source = parseSource(rawSourceComponent);
  }
  if (rawParametersComponent) {
    parsedMessage.parameters = rawParametersComponent.trim();
  }

  return parsedMessage;
};

const parseTags = (tags: string) => {
  const tagsToIgnore = {
    'client-nonce': null,
    flags: null,
  };

  const dictParsedTags: {[key: string]: object | string | null} = {};
  const parsedTags = tags.split(';');

  parsedTags.forEach(tag => {
    const parsedTag = tag.split('=');
    const tagValue = parsedTag[1] === '' ? null : parsedTag[1];

    switch (parsedTag[0]) {
      case 'badges':
      case 'badge-info':
        if (tagValue) {
          const dict: {[key: string]: object | string | null} = {};
          const badges = tagValue.split(',');
          badges.forEach(pair => {
            const badgeParts = pair.split('/');
            dict[badgeParts[0]] = badgeParts[1];
          });
          dictParsedTags[parsedTag[0]] = dict;
        } else {
          dictParsedTags[parsedTag[0]] = null;
        }
        break;
      case 'emotes':
        if (tagValue) {
          const dictEmotes: {[key: string]: object | string | null} = {};
          const emotes = tagValue.split('/');
          emotes.forEach(emote => {
            const emoteParts = emote.split(':');

            const textPositions = new Array<object>();
            const positions = emoteParts[1].split(',');
            positions.forEach(position => {
              const positionParts = position.split('-');
              textPositions.push({
                startPosition: positionParts[0],
                endPosition: positionParts[1],
              });
            });

            dictEmotes[emoteParts[0]] = textPositions;
          });

          dictParsedTags[parsedTag[0]] = dictEmotes;
        } else {
          dictParsedTags[parsedTag[0]] = null;
        }

        break;
      case 'emote-sets':
        if (tagValue) {
          const emoteSetIds = tagValue.split(',');
          dictParsedTags[parsedTag[0]] = emoteSetIds;
        }
        break;
      default:
        if (!Object.getOwnPropertyDescriptor(tagsToIgnore, parsedTag[0])) {
          dictParsedTags[parsedTag[0]] = tagValue;
        }
    }
  });

  return dictParsedTags;
};

const parseCommand = (rawCommandComponent: string) => {
  let parsedCommand = {};
  const commandParts = rawCommandComponent.split(' ');

  switch (commandParts[0]) {
    case 'JOIN':
    case 'PART':
    case 'NOTICE':
    case 'CLEARCHAT':
    case 'HOSTTARGET':
    case 'PRIVMSG':
      parsedCommand = {
        command: commandParts[0],
        channel: commandParts[1],
      };
      break;
    case 'PING':
      parsedCommand = {
        command: commandParts[0],
      };
      break;
    case 'CAP':
      parsedCommand = {
        command: commandParts[0],
        isCapRequestEnabled: commandParts[2] === 'ACK' ? true : false,
      };
      break;
    case 'GLOBALUSERSTATE':
      parsedCommand = {
        command: commandParts[0],
      };
      break;
    case 'USERSTATE':
    case 'ROOMSTATE':
      parsedCommand = {
        command: commandParts[0],
        channel: commandParts[1],
      };
      break;
    case 'RECONNECT':
      console.log(
        'The Twitch IRC server is about to terminate the connection for maintenance.'
      );
      parsedCommand = {
        command: commandParts[0],
      };
      break;
    case '421':
      console.log(`Unsupported IRC command: ${commandParts[2]}`);
      return null;
    case '001':
      parsedCommand = {
        command: commandParts[0],
        channel: commandParts[1],
      };
      break;
    case '002':
    case '003':
    case '004':
    case '353':
    case '366':
    case '372':
    case '375':
    case '376':
      console.log(`numeric message: ${commandParts[0]}`);
      return null;
    default:
      console.log(`\nUnexpected command: ${commandParts[0]}\n`);
      return null;
  }

  return parsedCommand;
};

const parseSource = (rawSourceComponent: string) => {
  if (null === rawSourceComponent) {
    return undefined;
  } else {
    const sourceParts = rawSourceComponent.split('!');
    return {
      nick: sourceParts.length === 2 ? sourceParts[0] : null,
      host: sourceParts.length === 2 ? sourceParts[1] : sourceParts[0],
    };
  }
};

export default parseMessage;
export {parseMessage};
