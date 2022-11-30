import {Source} from './Source';
import {Command} from './Command';

export class ParsedMessage {
  tags!: {[key: string]: string | object | null};
  source?: Source | null;
  command?: Command | null;
  parameters!: string;
}
