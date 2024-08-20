import {readFileSync} from 'fs';
import {CardResponse} from '../interfaces';
import {cleanString, toTitleCase} from './stringUtils';
import {join} from 'path';

export const getCardText = (card: CardResponse) => {
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
    .filter(s => !!s && !!s.length)
    .join(' | ');
};

export const getHeroText = (
  hero: CardResponse,
  heroPower: CardResponse | undefined
) => {
  return [
    hero.name,
    `Armor: ${hero.armor}`,
    heroPower?.text
      ?.replace(/(<([^>]+)>)/gi, '')
      .replace('\n', ' ')
      .replace('[x]', ''),
    `HP Cost: ${heroPower?.cost}`,
  ]
    .filter(s => !!s && !!s.length)
    .join(' | ');
};

export const getSpellText = (spell: CardResponse) => {
  return [
    spell.name,
    `T${spell.techLevel}`,
    `Cost: ${spell.cost} Gold`,
    spell.text
      ?.replace(/(<([^>]+)>)/gi, '')
      .replace('\n', ' ')
      .replace('[x]', ''),
  ]
    .filter(s => !!s && !!s.length)
    .join(' | ');
};

export const getTrinketText = (trinket: CardResponse) => {
  return [
    trinket.name,
    `${trinket.spellSchool?.includes('LESSER') ? 'Lesser' : 'Greater'} Trinket`,
    trinket.text
      ?.replace(/(<([^>]+)>)/gi, '')
      .replace('\n', ' ')
      .replace('[x]', ''),
  ]
    .filter(s => !!s && !!s.length)
    .join(' | ');
};

export const matchCard = (
  userInput: string,
  filter: (value: any, index?: number, Array?: any[]) => boolean
) => {
  const allCards: CardResponse[] = JSON.parse(
    readFileSync(join(__dirname, '../data/cards.json'), 'utf-8')
  );
  const cards = allCards.filter(filter);

  const exactMatch = cards.find(c => cleanString(c.name) === userInput);
  if (exactMatch) return exactMatch;

  const nextMatch = cards.filter(c => cleanString(c.name).includes(userInput));
  if (nextMatch.length) return nextMatch;

  const finalMatch = cards.filter(c =>
    userInput.split(' ').some(n => cleanString(c.name).split(' ').includes(n))
  );
  if (finalMatch.length) return finalMatch;

  return null;
};
