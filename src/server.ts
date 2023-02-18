import 'websocket-polyfill';
import { Event, Filter, relayInit } from 'nostr-tools';
import * as fs from 'fs';
import { resolve } from 'path';
import simpleGit from 'simple-git';

const FILE_NAME = 'followingIdList.json';

export const runServer = (settings: Settings) => {
  const filter: Filter = {
    authors: settings.authors,
    kinds: [3],
  };

  const dirPath = settings.gitDirectoryPath.startsWith('/')
    ? settings.gitDirectoryPath
    : resolve(__dirname, '..', settings.gitDirectoryPath);

  const filePath = resolve(dirPath, FILE_NAME);

  const isExistFile = () => {
    try {
      fs.statSync(filePath);
      return true;
    } catch {
      return false;
    }
  };

  const git = simpleGit(dirPath);

  (async () => {
    let beforeFollowingIdSet = new Set<string>();
    let followingIdSet = new Set<string>();

    if (isExistFile()) {
      const currentFollowingIdList: string[] = JSON.parse(
        fs.readFileSync(filePath, 'utf8')
      );

      if (
        !Array.isArray(currentFollowingIdList) ||
        (currentFollowingIdList.length &&
          typeof currentFollowingIdList[0] !== 'string')
      ) {
        throw Error('Invalid json');
      }

      beforeFollowingIdSet = new Set(currentFollowingIdList);
    }

    console.log('📼 Nostr Rorubakku');

    settings.relays.forEach(async (url) => {
      const relay = relayInit(url);
      await relay.connect().catch(() => null);

      relay.sub([filter]).on('event', (ev: Event) => {
        ev.tags.forEach((tagList) => {
          followingIdSet.add(tagList[1]);
        });
      });
    });

    const writeFile = async () => {
      const followingIdList = [...followingIdSet];
      if (followingIdList.length < 1) return false;

      const beforeFollowingIdList = [...beforeFollowingIdSet];

      const strFollowingIdList = JSON.stringify(followingIdList);

      if (JSON.stringify(beforeFollowingIdList) === strFollowingIdList) {
        return false;
      }

      fs.writeFileSync(filePath, strFollowingIdList);

      const generateCommitMessage = () => {
        if (beforeFollowingIdSet.size === 0) {
          return `Added ${followingIdSet.size} following users.`;
        } else {
          const addedUsers = followingIdList.filter(
            (id) => beforeFollowingIdList.indexOf(id) === -1
          );
          const removedUsers = beforeFollowingIdList.filter(
            (id) => followingIdList.indexOf(id) === -1
          );

          let message = '';

          if (addedUsers.length) {
            message += `Added ${addedUsers.join(',')}`;
          }
          if (removedUsers.length) {
            if (message) {
              message += '. ';
            }
            message += `Removed ${removedUsers.join(',')}`;
          }

          return message;
        }
      };

      const commitMessage = generateCommitMessage();

      beforeFollowingIdSet = followingIdSet;
      followingIdSet = new Set();

      await git.add(FILE_NAME);
      await git.commit(commitMessage, FILE_NAME);

      console.log(commitMessage);

      return true;
    };

    setInterval(async () => {
      await writeFile();
    }, settings.updateIntervalMs);
  })();
};
