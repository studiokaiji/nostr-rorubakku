# 📼 Nostr Rorubakku
Nostr Rorubakku manages your Nostr Following list (`kind: 3`) in git.
Each time you follow or unfollow another user, Nostr Rorubakku writes the Following list to a file and does an add & commit in git.

## Installation
```sh
npm install -g @studiokaiji/@nostr-rorubakku
```

## Usage
1. Setup (initialize git repository.)
```sh
rorubakku setup
```
2. Run server
```sh
rorubakku run
```

## Settings
A settings file can be specified when executing the `setup` and `run` commands.

```sh
rorubakku -s <CUSTOM_SETTINGS_FILE_PATH>
```

The Settings file should be written as follows. If no Settings file is specified, the following settings are used by default.
```json
{
  "updateIntervalMs": 5000,
  "relays": [
    "wss://eden.nostr.land",
    "wss://relay.nostr.info",
    "wss://nos.lol",
    "wss://nostr.mom"
  ],
  "gitDirectoryPath": "./rorubakku",
  "authors": ["2d417bce8c10883803bc427703e3c4c024465c88e7063ed68f9dfeecf56911ac"]
}
```