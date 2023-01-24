import fetch from 'node-fetch';
import {Cache} from '../models/';

export const saveAndLoadChatters = async (load: boolean = false) => {
  await Cache.Save();
  if (new Date().getHours() === 0 || load) {
    await Cache.Load();
  }
};

export const isLive = async (channel: string) => {
  const resp = await fetch(`https://www.twitch.tv/${channel.replace('#', '')}`);
  const text = await resp.text();
  return text.includes('isLiveBroadcast');
};
