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

    const cards: CardResponse[] = (await cardResp.json())['cards'];
    const types: MinionTypeResponse[] = await typeResp.json();

    cards.forEach(async c => {
      const minionTypes = types.filter(
        t => t.id && (t.id === c.minionTypeId || c.multiTypeIds?.includes(t.id))
      );
      const typesToAttach = minionTypes.map(m => ({
        where: {id: m.id ?? 0},
        create: {
          id: m.id ?? 0,
          name: m.name ?? '',
          slug: m.slug ?? '',
        },
      }));
      await this.db.card.upsert({
        where: {id: c.id},
        update: {
          slug: c.slug ?? '',
          health: c.health ?? 0,
          attack: c.attack,
          manaCost: c.manaCost ?? 0,
          name: c.name ?? '',
          text: c.text ?? '',
          armor: c.armor,
          tier: c.battlegrounds?.tier,
          isHero: c.battlegrounds?.hero ?? false,
          isQuest: c.battlegrounds?.quest ?? false,
          upgradeId: c.battlegrounds?.upgradeId,
          minionTypes: {
            connectOrCreate: typesToAttach,
          },
        },
        create: {
          id: c.id ?? 0,
          slug: c.slug ?? '',
          health: c.health ?? 0,
          attack: c.attack,
          manaCost: c.manaCost ?? 0,
          name: c.name ?? '',
          text: c.text ?? '',
          armor: c.armor,
          tier: c.battlegrounds?.tier,
          isHero: c.battlegrounds?.hero ?? false,
          isQuest: c.battlegrounds?.quest ?? false,
          upgradeId: c.battlegrounds?.upgradeId,
          minionTypes: {
            connectOrCreate: typesToAttach,
          },
        },
      });
    });
  };
}
