export abstract class BaseCommand {
  protected lastMessage: number;
  protected abstract timeout: number;

  constructor() {
    this.lastMessage = 0;
  }

  timeoutCheck = () => {
    const timeNow = new Date().getTime();
    if (timeNow - this.lastMessage < this.timeout) return false;

    this.lastMessage = timeNow;
    return true;
  };
}
