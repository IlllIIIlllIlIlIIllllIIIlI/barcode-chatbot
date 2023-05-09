import {PrismaClient} from '@prisma/client';
import {BaseService, OAuthOptions} from '.';
import {Logger, Config} from '../infra';
import {CardResponse, MinionTypeResponse} from '../responses';

export class CardService extends BaseService {
  db: PrismaClient;

  constructor(_oauthOptions?: OAuthOptions) {
    const config = new Config();
    const oauthOptions = _oauthOptions || {
      client: {
        id: config.CLIENT_ID,
        secret: config.CLIENT_SECRET,
      },
      auth: {
        tokenHost: 'https://us.battle.net',
      },
    };
    super(oauthOptions);
    this.db = new PrismaClient();
  }

  update = async () => {
    await this.updateCards();

    setInterval(async () => {
      await this.updateCards();
    }, 86400000);
  };

  updateCards = async () => {
    const cardUrl =
      'https://us.api.blizzard.com/hearthstone/cards?locale=en_US&gameMode=battlegrounds&pageSize=20000';
    const typeUrl =
      'https://us.api.blizzard.com/hearthstone/metadata/minionTypes?locale=en_US';

    const cardResp = await this.getResponse(cardUrl);
    if (!cardResp.ok) {
      Logger.Error(
        `Error getting cards - ${cardResp.status}: ${cardResp.statusText}`
      );
      return;
    }

    const typeResp = await this.getResponse(typeUrl);
    if (!typeResp.ok) {
      Logger.Error(
        `Error getting types - ${typeResp.status}: ${typeResp.statusText}`
      );
      return;
    }

    const allCards: CardResponse[] = (await cardResp.json())['cards'];
    // const goldIds = cards
    //   .map(c => c.battlegrounds?.upgradeId ?? 0)
    //   .filter(c => c > 0);
    // const allCards = cards.concat(this.getGoldCards(goldIds));
    const types: MinionTypeResponse[] = await typeResp.json();

    allCards.forEach(async c => {
      const minionTypes = types.filter(
        t => t.id && (t.id === c.minionTypeId || c.multiTypeIds?.includes(t.id))
      );
      const typesToAttach = minionTypes.map(m => ({
        where: {id: m.id},
        create: {
          id: m.id,
          name: m.name,
          slug: m.slug,
        },
      }));
      await this.db.card.upsert({
        where: {id: c.id},
        update: {
          health: c.health,
          attack: c.attack,
          name: c.name,
          text: c.text,
          armor: c.armor,
          tier: c.battlegrounds?.tier,
          minionTypes: {
            connectOrCreate: typesToAttach,
          },
        },
        create: {
          id: c.id,
          slug: c.slug,
          health: c.health,
          attack: c.attack,
          name: c.name,
          text: c.text,
          armor: c.armor,
          tier: c.battlegrounds?.tier,
          isHero: !!c.battlegrounds?.hero,
          isGold: !!c.battlegrounds?.upgradeId,
          upgradeId: c.battlegrounds?.upgradeId,
          minionTypes: {
            connectOrCreate: typesToAttach,
          },
        },
      });
    });
  };

  private getGoldCards = (cardIds: number[]) => {
    const cards: CardResponse[] = [];
    cardIds.forEach(async c => {
      const resp = await this.getResponse(
        `https://us.api.blizzard.com/hearthstone/cards/${c}?locale=en_US`
      );

      if (resp.ok) {
        cards.push(await resp.json());
      } else {
        console.log(resp.status);
      }
    });

    return cards;
  };
}
