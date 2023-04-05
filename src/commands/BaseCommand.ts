export abstract class BaseCommand {
  protected lastMessage: number;
  protected abstract timeout: number;

  constructor() {
    this.lastMessage = 0;
  }
}
