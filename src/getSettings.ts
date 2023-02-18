import Ajv from 'ajv';
import * as fs from 'fs';
import { resolve } from 'path';

const SCHEMA = {
  type: 'object',
  properties: {
    updateIntervalMs: {
      type: 'integer',
    },
    relays: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    gitDirectoryPath: {
      type: 'string',
    },
    authors: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['updateIntervalMs', 'relays', 'gitDirectoryPath', 'authors'],
} as const;

const ajv = new Ajv();
const validateSettings = ajv.compile(SCHEMA);

export const getSettings = (filePath: string) => {
  const settings: Settings = JSON.parse(
    fs.readFileSync(filePath || resolve(__dirname, '../settings.json'), 'utf-8')
  );

  if (!validateSettings(settings)) {
    throw Error('Invalid settings file');
  }

  return settings;
};
