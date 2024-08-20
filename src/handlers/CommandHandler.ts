import {
  BuddyCommand,
  CardCommand,
  HeroCommand,
  RankCommand,
  SpellCommand,
} from '../commands';
import {TrinketCommand} from '../commands/TrinketCommand';
import {Message} from '../models';

export class CommandHandler {
  private buddy: BuddyCommand;
  private cards: CardCommand;
  private heroes: HeroCommand;
  private rank: RankCommand;
  private spells: SpellCommand;
  private trinkets: TrinketCommand;

  constructor() {
    this.buddy = new BuddyCommand();
    this.cards = new CardCommand();
    this.heroes = new HeroCommand();
    this.spells = new SpellCommand();
    this.rank = new RankCommand();
    this.trinkets = new TrinketCommand();
  }

  handle = async (message: Message) => {
    switch (message.command) {
      case 'buddy':
        await this.buddy.get(message);
        break;
      case 'gbuddy':
      case 'goldenbuddy':
        await this.buddy.get(message, true);
        break;
      case 'card':
        await this.cards.getCard(message);
        break;
      case 'goldencard':
      case 'gcard':
        await this.cards.getCard(message, true);
        break;
      case 'hero':
        await this.heroes.get(message);
        break;
      case 'spell':
        await this.spells.getSpell(message);
        break;
      case 'trinket':
        await this.trinkets.getSpell(message);
        break;
      // case 'bgrank':
      //   this.rank.get(message);
      //   break;
    }
  };
}
