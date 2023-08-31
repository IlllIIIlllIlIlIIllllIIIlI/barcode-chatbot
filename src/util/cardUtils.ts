import {CardResponse} from '../interfaces';
import {toTitleCase} from './stringUtils';

export const getResponseText = (card: CardResponse) => {
  return [
    card.name,
    card.races?.map(r => toTitleCase(r)).join('/') ?? 'N',
    `T${card.techLevel}`,
    `${card.attack}/${card.health}`,
    card.text
      ?.replace(/(<([^>]+)>)/gi, '')
      .replace('\n', ' ')
      .replace('[x]', ''),
  ]
    .filter(s => !!s && !!s.length && s !== '-')
    .join(' | ');
};
