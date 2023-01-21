import {Cache} from '../models/';

export const saveAndLoadChatters = async (load: boolean = false) => {
  await Cache.Save();
  if (new Date().getHours() === 0 || load) {
    await Cache.Load();
  }
};
