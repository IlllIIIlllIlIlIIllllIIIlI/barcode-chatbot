import {Prisma} from '@prisma/client';

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
