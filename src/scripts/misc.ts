import fetch from 'node-fetch';
import {Cache, Client, Logger} from '../models/';

export const saveAndLoadChatters = async (load: boolean = false) => {
  await Cache.Save();
  if (new Date().getHours() === 0 || load) {
    await Cache.Load();
  }
};

export const isLive = async (channel: string) => {
  try {
    let text = '';
    const response = await fetch(
      `https://www.twitch.tv/${channel.replace('#', '')}`
    ).catch(Logger.Error);
    if (response) {
      text = await response.text();
      const status = response.status;
      const sText = response.statusText;
      Logger.Debug({status, sText});
    }
    return text.includes('isLiveBroadcast');
  } catch (error) {
    Logger.Error(error);
    return true;
  }
};

export const say = async (channel: string, message: string) => {
  await Client.Instance.client.say(channel, message).catch(Logger.Error);
};
