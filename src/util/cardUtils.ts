import {Prisma} from '@prisma/client';
import {CardResponse} from '../responses';
import {toTitleCase} from './stringUtils';

type CardsWithTypes = Prisma.CardGetPayload<{
  include: {minionTypes: true};
}>;

export const getText = (card: CardsWithTypes) => {
  if (card.isHero) {
    return [card.name, `Armor: ${card.armor ?? 0}`, card.text]
      .filter(s => !!s.length && s !== '-')
      .join(' | ');
  } else {
    return [
      card.name,
      card.minionTypes.map(m => m.name).join('/') ?? 'N',
      `T${card.tier}`,
      `${card.attack}/${card.health}`,
      card.text.replace(/(<([^>]+)>)/gi, ''),
    ]
      .filter(s => !!s.length && s !== '-')
      .join(' | ');
  }
};

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
