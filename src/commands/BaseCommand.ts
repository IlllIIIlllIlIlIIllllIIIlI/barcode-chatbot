export abstract class BaseCommand {
  protected lastMessage: number;
  protected abstract timeout: number;

  constructor() {
    this.lastMessage = new Date().getTime();
  }
}
