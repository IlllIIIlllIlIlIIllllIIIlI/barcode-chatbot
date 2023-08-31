import {Message} from '../models';
import {stopwords} from './stopwords';

export const cleanString = (s: string, slice?: number) => {
  if (slice !== undefined) {
    return s
      .toLowerCase()
      .split(' ')
      .filter(s => !!s.length && !stopwords.includes(s))
      .map(s => s.replace(/\s+/g, ' ').trim())
      .slice(slice)
      .join(' ')
      .trim();
  }

  return s
    .toLowerCase()
    .split(' ')
    .filter(s => !!s.length && !stopwords.includes(s))
    .map(s => s.replace(/\s+/g, ' ').trim())
    .join(' ')
    .trim();
};

export const makeArrayString = (arr: string[]) => {
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  const len = Math.min(5, arr.length - 1);
  const firsts = arr.slice(0, len);
  const last = arr[len];
  if (arr.length > 5) {
    return firsts.join(', ') + ', ' + last + `, and ${arr.length - 5} more`;
  }
  return firsts.join(', ') + ' and ' + last;
};

export const getTagAndCommandText = (
  message: Message
): [string | null, string | null] => {
  let commandText = cleanString(message.message, 1);
  if (!commandText) return [null, null];

  const tag =
    commandText.split(' ').find(s => s.includes('@')) ??
    message.tags.username ??
    '';
  if (tag && tag.replace('@', '') !== commandText) {
    commandText = cleanString(commandText.split('@')[0])
      .replace(/\s+/g, ' ')
      .trim();
  }

  return [commandText, tag.replace('@', '')];
};

export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, txt => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};
