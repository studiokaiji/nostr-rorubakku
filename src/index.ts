import { getSettings } from './getSettings';
import { runServer } from './server';
import { setup } from './setup';

import { program } from 'commander';

program
  .version('0.0.1')
  .option('-s, --settings <settingsFilePath>', 'Settings file path');

const options = program.opts();

program.command('setup').action(() => {
  const settings = getSettings(options?.settingsFilePath);
  setup(settings);
});

program.command('run').action(() => {
  const settings = getSettings(options?.settingsFilePath);
  runServer(settings);
});

program.parse();
