# Univerzo Music

Univerzo Music is a React + Vite music streaming frontend with a persistent player, discovery feeds, search, liked songs, recent plays, and playlist-style routes.

## Current Catalog Setup

- Active provider: `JioSaavn`
- Playback: full-track browser streaming with no listener login
- Discovery: editorial playlist-backed sections for trending and genre lanes

The current catalog flow uses the live JioSaavn-backed provider configured in [`src/config/music.js`](./src/config/music.js).

## Environment

Copy `.env.example` to `.env` if you want a local place for future app-specific overrides:

```env
# No environment variables are required for the current JioSaavn catalog flow.
```

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Production Notes

- The app is frontend-only right now. Likes and recent plays are stored locally in the browser.
- Play queue, current track, player preferences, and library state are also persisted in local storage.
- If you need analytics, auth, subscriptions, or server-managed provider credentials, add a backend before launch.
- On this Windows + OneDrive environment, `npm run build` may fail inside restricted sandboxes because of native dependency loading. Running the build directly on the machine works.
