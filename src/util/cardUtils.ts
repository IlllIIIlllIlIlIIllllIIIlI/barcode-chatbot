import {CardResponse} from '../interfaces';
import {toTitleCase} from './stringUtils';

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
