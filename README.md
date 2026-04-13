# Univerzo Music

Univerzo Music is a React + Vite music streaming frontend with a persistent player, discovery feeds, search, liked songs, recent plays, and playlist-style routes.

## Current Catalog Setup

- Default provider: `Audius`
- Optional providers: `Jamendo`, `Apple Music`
- No preview fallback is used in the active catalog flow

The current default path is designed to work without listener login by streaming from Audius's open catalog in the browser.

## Environment

Copy `.env.example` to `.env` and set the values you need:

```env
VITE_MUSIC_PROVIDER=audius
VITE_AUDIUS_API_KEY=
VITE_JAMENDO_CLIENT_ID=
VITE_JAMENDO_AUDIO_FORMAT=mp32
VITE_APPLE_MUSIC_DEVELOPER_TOKEN=
VITE_APPLE_MUSIC_STOREFRONT=us
VITE_APPLE_MUSIC_APP_NAME=Univerzo Music
```

Provider notes:

- `audius`: default no-login catalog path
- `jamendo`: optional alternative if you have your own Jamendo client id
- `apple-music`: requires Apple Music credentials and listener authorization

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Production Notes

- The app is frontend-only right now. Likes and recent plays are stored locally in the browser.
- If you need analytics, auth, subscriptions, or server-managed provider credentials, add a backend before launch.
- On this Windows + OneDrive environment, `npm run build` may fail inside restricted sandboxes because of native dependency loading. Running the build directly on the machine works.
