import {Chatter} from '@prisma/client';

export class DailyChatter {
  username: string = '';
  lastMessages: string[];
  totalFailedPyramids: number = 0;
  totalSuccessfulPyrmaids: number = 0;
  dailyFailedPyramids: number;
  dailySuccessfulPyramids: number;

  attemptingPyramid: boolean = false;

  constructor(chatter?: Chatter, username?: string) {
    this.lastMessages = [];
    this.dailyFailedPyramids = 0;
    this.dailySuccessfulPyramids = 0;

    if (username) {
      this.username = username;
    } else if (chatter) {
      this.username = chatter.username;
      this.totalFailedPyramids = chatter.failedPyramids;
      this.totalSuccessfulPyrmaids = chatter.successfulPyramids;
    }
  }
}
