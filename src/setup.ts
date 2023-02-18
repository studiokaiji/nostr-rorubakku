import { getSettings } from './getSettings';
import simpleGit from 'simple-git';

export const setup = async (settings: Settings) => {
  const git = simpleGit(settings.gitDirectoryPath);
  await git.init();
  console.log('git initialize is completed.');
  console.log('Setup is completed.');
};
